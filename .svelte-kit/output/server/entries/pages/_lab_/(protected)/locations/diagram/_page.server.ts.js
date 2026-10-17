const load = async ({ parent }) => {
  const { lab } = await parent();
  return { labId: lab.id };
};
export {
  load
};
