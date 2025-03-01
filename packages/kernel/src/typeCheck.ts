import { formatType, Formula, Ident, Term, Type } from "./ast";
import { Err, Ok, reduceResult, Result, traverseResult } from "./common";

const newTVar: () => Type = (() => {
  let cnt = 0;
  return () => ({ tag: "Var", ident: `α${cnt++}` });
})();

function occurIn(v: Ident, type: Type): boolean {
  switch (type.tag) {
    case "Prop":
      return false;
    case "Con":
      return type.args.some((arg) => occurIn(v, arg));
    case "Var": {
      if (type.content === undefined) {
        return type.ident === v;
      }
      return occurIn(v, type.content);
    }
  }
}

function assign(
  tvar: { tag: "Var"; ident: Ident; content?: Type },
  type: Type,
) {
  tvar.content = type;
}

function unify(type1: Type, type2: Type): Result<void, string> {
  if (type1.tag === "Prop" && type2.tag === "Prop") {
    return Ok();
  }

  if (type1.tag === "Con" && type2.tag === "Con") {
    if (type1.ident !== type2.ident) {
      return Err(
        `Type mismatch: failed to unify ${formatType(type1)} and ${formatType(type2)}`,
      );
    }
    if (type1.args.length !== type2.args.length) {
      return Err(
        `Type mismatch: failed to unify ${formatType(type1)} and ${formatType(type2)}`,
      );
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

  if (type1.tag === "Var" && type1.content !== undefined) {
    return unify(type1.content, type2);
  }

  if (type2.tag === "Var" && type2.content !== undefined) {
    return unify(type1, type2.content);
  }

  if (
    type1.tag === "Var" &&
    type2.tag === "Var" &&
    type1.ident === type2.ident
  ) {
    return Ok();
  }

  if (type1.tag === "Var") {
    if (occurIn(type1.ident, type2)) {
      return Err(`Recursive type`);
    }
    assign(type1, type2);
    return Ok();
  }
  if (type2.tag === "Var") {
    if (occurIn(type2.ident, type1)) {
      return Err(`Recursive type`);
    }
    assign(type2, type1);
    return Ok();
  }

  return Err(
    `Type mismatch: failed to unify ${formatType(type1)} and ${formatType(type2)}`,
  );
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
    if (funcTy.content !== undefined) {
      return matchArr(funcTy.content, argTy);
    }

    const [left, right] = [newTVar(), newTVar()];
    assign(funcTy, { tag: "Arr", left, right });
    const res = unify(left, argTy);
    if (res.tag === "Err") {
      return res;
    }
    return Ok(right);
  }

  return Err(`Expected function type`);
}

function freshenTVars(type: Type): Type {
  const newTVars = new Map<Ident, Type>();

  function rec(type: Type): Type {
    switch (type.tag) {
      case "Var": {
        if (type.content !== undefined) {
          return rec(type.content);
        }

        return (
          newTVars.get(type.ident) ??
          (newTVars.set(type.ident, newTVar()), newTVars.get(type.ident))
        );
      }
      case "Con":
        return { tag: "Con", ident: type.ident, args: type.args.map(rec) };
      case "Arr":
        return { tag: "Arr", left: rec(type.left), right: rec(type.right) };
      case "Prop":
        return { tag: "Prop" };
    }
  }

  return rec(type);
}

export function inferTerm(
  sig: Map<Ident, Type>,
  ctx: Map<Ident, Type>,
  term: Term,
): Result<Type, string> {
  switch (term.tag) {
    case "Var": {
      if (sig.has(term.ident)) {
        const ty = freshenTVars(sig.get(term.ident));
        return Ok(ty);
      }
      if (ctx.has(term.ident)) {
        const ty = ctx.get(term.ident);
        return Ok(ty);
      }
      const ty = newTVar();
      ctx.set(term.ident, ty);
      return Ok(ty);
    }
    case "Abs": {
      const oldCtx = new Map(ctx);

      const paramTys = term.idents.map((ident) => [ident, newTVar()] as const);
      paramTys.forEach(([ident, ty]) => ctx.set(ident, ty));

      const retTy = inferTerm(sig, ctx, term.body);
      if (retTy.tag === "Err") {
        return retTy;
      }

      const ty = paramTys.reduceRight<Type>(
        (acc, [_, paramTys]) => ({ tag: "Arr", left: paramTys, right: acc }),
        retTy.value,
      );

      paramTys.forEach(([ident, _]) =>
        oldCtx.has(ident)
          ? ctx.set(ident, oldCtx.get(ident))
          : ctx.delete(ident),
      );

      return Ok(ty);
    }
    case "App": {
      const funcTy = inferTerm(sig, ctx, term.func);
      if (funcTy.tag === "Err") {
        return funcTy;
      }
      const argTys = traverseResult(
        term.args.map((arg) => inferTerm(sig, ctx, arg)),
      );
      if (argTys.tag === "Err") {
        return argTys;
      }
      return reduceResult(
        (acc, argTy) => matchArr(acc, argTy),
        funcTy.value,
        argTys.value,
      );
    }
  }
}

// check if the given formula has type Prop
export function checkFormula(
  sig: Map<string, Type>,
  ctx: Map<Ident, Type>,
  formula: Formula,
): Result<void, string> {
  switch (formula.tag) {
    case "Pred": {
      let pTy: Type;
      if (sig.has(formula.ident)) {
        pTy = freshenTVars(sig.get(formula.ident));
      } else if (ctx.has(formula.ident)) {
        pTy = ctx.get(formula.ident);
      } else {
        pTy = newTVar();
        ctx.set(formula.ident, pTy);
      }

      const retTy = reduceResult(
        (acc, arg) => {
          const argTy = inferTerm(sig, ctx, arg);
          if (argTy.tag === "Err") {
            return argTy;
          }
          return matchArr(acc, argTy.value);
        },
        pTy,
        formula.args,
      );

      if (retTy.tag === "Err") {
        return retTy;
      }
      const res = unify(retTy.value, { tag: "Prop" });
      if (res.tag === "Err") {
        return res;
      }
      return Ok();
    }
    case "Top":
    case "Bottom":
      return Ok();
    case "And":
    case "Or":
    case "Imply": {
      const leftRes = checkFormula(sig, ctx, formula.left);
      if (leftRes.tag === "Err") {
        return leftRes;
      }
      const rightRes = checkFormula(sig, ctx, formula.right);
      if (rightRes.tag === "Err") {
        return rightRes;
      }
      return Ok();
    }
    case "Forall":
    case "Exist": {
      const oldType: Type | undefined = ctx.get(formula.ident);

      ctx.set(formula.ident, newTVar());

      const checkResult = checkFormula(sig, ctx, formula.body);

      if (oldType === undefined) {
        ctx.delete(formula.ident);
      } else {
        ctx.set(formula.ident, oldType);
      }

      return checkResult;
    }
  }
}

export function normalizeType(type: Type): Type {
  switch (type.tag) {
    case "Prop":
      return { tag: "Prop" };
    case "Con":
      return {
        tag: "Con",
        ident: type.ident,
        args: type.args.map(normalizeType),
      };
    case "Arr":
      return {
        tag: "Arr",
        left: normalizeType(type.left),
        right: normalizeType(type.right),
      };
    case "Var":
      if (type.content === undefined) {
        return type;
      }
      return normalizeType(type.content);
  }
}
