import { w as withAuth, o as ok, e as err } from "../../../../../chunks/middleware.js";
import { a as readDb, w as withLocks, c as commit } from "../../../../../chunks/db.js";
import { p as parseBody, a as AuthorizationSchema } from "../../../../../chunks/validate.js";
import { n as newId } from "../../../../../chunks/ids.js";
const GET = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const auths = readDb(labId, "authorizations.json");
  const { searchParams } = ctx.url;
  let result = auths;
  const studentId = searchParams.get("student_id");
  const category = searchParams.get("category");
  if (searchParams.get("active") !== "false") result = result.filter((a) => a.is_active);
  if (studentId) result = result.filter((a) => a.student_id === studentId);
  if (category) result = result.filter((a) => a.item_category === category);
  if (membership?.role === "instructor") {
    result = result.filter((a) => a.instructor_id === user.user_id);
  }
  return ok(result);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const parsed = await parseBody(ctx.request, AuthorizationSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  if (membership?.role === "instructor" && data.instructor_id !== user.user_id) {
    return err(403, "Instructors may only grant authorizations under their own ID");
  }
  const memberships = readDb("_global", "lab_memberships.json");
  const studentMembership = memberships.find(
    (m) => m.user_id === data.student_id && m.lab_id === labId && m.is_active
  );
  if (!studentMembership) return err(404, "Student not found in this lab");
  return withLocks(labId, ["authorizations.json"], async () => {
    const auths = readDb(labId, "authorizations.json");
    auths.filter(
      (a) => a.student_id === data.student_id && a.item_category === data.item_category && a.is_active
    ).forEach((a) => {
      a.is_active = false;
    });
    const auth = {
      id: newId(),
      lab_id: labId,
      student_id: data.student_id,
      instructor_id: data.instructor_id,
      item_category: data.item_category,
      is_active: true,
      expires_at: data.expires_at,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    auths.push(auth);
    await commit({
      labId,
      writes: [["authorizations.json", auths]],
      audit: {
        action: "authorization.grant",
        entity_type: "authorization",
        entity_id: auth.id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        after: { student_id: data.student_id, item_category: data.item_category },
        ip: ctx.getClientAddress()
      }
    });
    return ok(auth, 201);
  });
}, { minRole: "instructor" });
export {
  GET,
  POST
};
