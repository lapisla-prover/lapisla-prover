import { Formula, Type } from "./ast";

export type Env = {
  thms: Map<string, Formula>;
  types: Map<string, Type>;
};

export function deepCopyEnv(env: Env): Env {
  return { thms: new Map(env.thms), types: new Map(env.types) };
}

export function initialEnv(): Env {
  return { thms: new Map(), types: new Map() };
}

export function insertThm(env: Env, ident: string, formula: Formula): Env {
  const new_env = deepCopyEnv(env);
  new_env.thms.set(ident, formula);
  return new_env;
}

export function insertConstant(env: Env, ident: string, ty: Type): Env {
  const new_env = deepCopyEnv(env);
  new_env.types.set(ident, ty);
  return new_env;
}
