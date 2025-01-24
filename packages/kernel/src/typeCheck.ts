import { Formula, Ident, Term, Type } from "./ast";
import { Err, Ok, reduceResult, Result, traverseResult } from "./common";

export type Signature = Map<string, Type>;

const newTVar: () => Type = (() => {
  let cnt = 0;
  return () => ({ tag: "Var", ident: `α${cnt++}` });
})();

function occurs(v: Ident, type: Type): boolean {
  switch (type.tag) {
    case "Prop":
      return false;
    case "Con":
      return type.args.some((arg) => occurs(v, arg));
    case "Var":
      return type.ident === v;
  }
}

function unify(type1: Type, type2: Type): Result<void, string> {
  if (type1.tag === "Prop" && type2.tag === "Prop") {
    return Ok();
  }

  if (type1.tag === "Con" && type2.tag === "Con") {
    if (type1.ident !== type2.ident) {
      return Err(`Type mismatch`);
    }
    if (type1.args.length !== type2.args.length) {
      return Err(`Type mismatch`);
    }
    for (let i = 0; i < type1.args.length; i++) {
      const res = unify(type1.args[i], type2.args[i]);
      if (res.tag === "Err") {
        return res;
      }
    }
    return Ok();
  }

  if (type1.tag === "Arr" && type2.tag === "Arr") {
    const leftRes = unify(type1.left, type2.left);
    if (leftRes.tag === "Err") {
      return leftRes;
    }
    const rightRes = unify(type1.right, type2.right);
    if (rightRes.tag === "Err") {
      return rightRes;
    }
    return Ok();
  }

  if (type1.tag === "Var") {
    if (occurs(type1.ident, type2)) {
      return Err(`Recursive type`);
    }
    Object.assign(type1, type2);
    return Ok();
  }
  if (type2.tag === "Var") {
    if (occurs(type2.ident, type1)) {
      return Err(`Recursive type`);
    }
    Object.assign(type2, type1);
    return Ok();
  }

  return Err(`Type mismatch`);
}

function matchArr(funcTy: Type, argTy: Type): Result<Type, string> {
  if (funcTy.tag === "Arr") {
    const res = unify(funcTy.left, argTy);
    if (res.tag === "Err") {
      return res;
    }
    return Ok(funcTy.right);
  }

  if (funcTy.tag === "Var") {
    const [left, right] = [newTVar(), newTVar()];
    Object.assign(funcTy, { tag: "Arr", left, right });
    const res = unify(left, argTy);
    if (res.tag === "Err") {
      return res;
    }
    Ok(right);
  }

  return Err(`Expected function type`);
}

export function inferTerm(
  env: Record<Ident, Type>,
  term: Term
): Result<Type, string> {
  switch (term.tag) {
    case "Var": {
      const ty = env[term.ident];
      if (!ty) {
        return Err(`Unbound variable ${term.ident}`);
      }
      return Ok(ty);
    }
    case "Abs": {
      const paramTys = term.idents.map((ident) => [ident, newTVar()] as const);
      const newEnv = { ...env, ...Object.fromEntries(paramTys) };
      const retTy = inferTerm(newEnv, term.body);
      if (retTy.tag === "Err") {
        return retTy;
      }
      const type = paramTys.reduceRight<Type>(
        (acc, [_, paramTy]) => ({ tag: "Arr", left: paramTy, right: acc }),
        retTy.value
      );
      return Ok(type);
    }
    case "App": {
      const funcTy = inferTerm(env, term.func);
      if (funcTy.tag === "Err") {
        return funcTy;
      }
      const argTys = traverseResult(
        term.args.map((arg) => inferTerm(env, arg))
      );
      if (argTys.tag === "Err") {
        return argTys;
      }
      return reduceResult(
        (acc, argTy) => matchArr(acc, argTy),
        funcTy.value,
        argTys.value
      );
    }
  }
}

export function checkFormula(
  sig: Signature,
  env: Record<Ident, Type>,
  formula: Formula,
  type: Type
): Result<void, string> {
  const inferred = inferFormula(sig, env, formula);
  if (inferred.tag === "Err") {
    return inferred;
  }
}

export function inferFormula(
  sig: Signature,
  env: Record<Ident, Type>,
  formula: Formula
): Result<Type, string> {
  switch (formula.tag) {
    case "Pred":
      throw new Error("Not implemented");
    case "Top":
    case "Bottom":
      return Ok({ tag: "Prop" });
    case "And":
    case "Or":
    case "Imply": {
      const leftRes = checkFormula(sig, env, formula.left, { tag: "Prop" });
      if (leftRes.tag === "Err") {
        return leftRes;
      }
      const rightRes = checkFormula(sig, env, formula.right, { tag: "Prop" });
      if (rightRes.tag === "Err") {
        return rightRes;
      }
      return Ok({ tag: "Prop" });
    }
    case "Forall":
    case "Exist": {
      const newEnv = { ...env, [formula.ident]: newTVar() };
      const bodyRes = checkFormula(sig, newEnv, formula.body, { tag: "Prop" });
      if (bodyRes.tag === "Err") {
        return bodyRes;
      }
      return Ok({ tag: "Prop" });
    }
  }
}
