import { a as readDb } from "../../../../chunks/db.js";
const GET = async () => {
  let labCount = 0;
  try {
    labCount = readDb("_global", "labs.json").filter((l) => l.is_active).length;
  } catch {
  }
  return new Response(
    JSON.stringify({
      status: "ok",
      labs: labCount,
      uptime_s: Math.floor(process.uptime())
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
export {
  GET
};
