const load = async ({ parent, params }) => {
  const { lab } = await parent();
  return { labId: lab.id, labSlug: params.lab, borrowId: params.id };
};
export {
  load
};
