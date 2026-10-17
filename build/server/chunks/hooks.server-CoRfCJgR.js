import 'dotenv/config';
import { b as bootMigrations } from './runner-DQcmKiSu.js';
import 'fs';
import 'path';
import './db-CfhGAyvN.js';
import 'crypto';
import 'proper-lockfile';

const booted = bootMigrations();
const handle = async ({ event, resolve }) => {
  await booted;
  return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server-CoRfCJgR.js.map
