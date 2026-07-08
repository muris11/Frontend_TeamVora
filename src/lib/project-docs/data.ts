import { architecturePages } from "./architecture";
import { backendPages } from "./backend";
import { databasePages } from "./database";
import { frontendPages } from "./frontend";
import { operationsPages } from "./operations";
import { referencePages } from "./reference";
import { ProjectDocPage } from "./types";

export const projectDocPages: ProjectDocPage[] = [
  ...architecturePages,
  ...backendPages,
  ...databasePages,
  ...frontendPages,
  ...operationsPages,
  ...referencePages
];
