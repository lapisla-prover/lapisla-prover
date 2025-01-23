import { Formula } from "./ast";

export type Env = {
  thms: Map<string, Formula>;
};

export function deepCopyEnv(env: Env): Env {
  return { thms: new Map(env.thms) };
}

export function initialEnv(): Env {
  return { thms: new Map() };
}

export function insertThm(env: Env, ident: string, formula: Formula): Env {
  const new_env = deepCopyEnv(env);
  new_env.thms.set(ident, formula);
  return new_env;
}
