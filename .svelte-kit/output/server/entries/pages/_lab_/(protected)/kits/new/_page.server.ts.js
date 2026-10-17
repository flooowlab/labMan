import { redirect } from "@sveltejs/kit";
const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager"].includes(membership.role)) throw redirect(302, `/${params.lab}/kits`);
  return { labId: lab.id, labSlug: params.lab };
};
export {
  load
};
