import "dotenv/config";
import { b as bootMigrations } from "../chunks/runner.js";
const booted = bootMigrations();
const handle = async ({ event, resolve }) => {
  await booted;
  return resolve(event);
};
export {
  handle
};
