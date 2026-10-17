const POST = async (ctx) => {
  ctx.cookies.delete("token", { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export { POST };
//# sourceMappingURL=_server.ts-DjcTiLr6.js.map
