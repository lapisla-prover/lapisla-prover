export type Ident = string;

export type Term =
  | { tag: "Var"; ident: Ident }
  | { tag: "Abs"; idents: Ident[]; body: Term }
  | { tag: "App"; func: Term; args: Term[] };

export type Formula =
  | { tag: "Pred"; ident: Ident; args: Term[] }
  | { tag: "Top" }
  | { tag: "Bottom" }
  | { tag: "And"; left: Formula; right: Formula }
  | { tag: "Or"; left: Formula; right: Formula }
  | { tag: "Imply"; left: Formula; right: Formula }
  | { tag: "Forall"; ident: Ident; body: Formula }
  | { tag: "Exist"; ident: Ident; body: Formula };

export type Rule =
  | { tag: "I" }
  | { tag: "Cut"; formula: Formula }
  | { tag: "AndL1" }
  | { tag: "AndL2" }
  | { tag: "AndR" }
  | { tag: "OrL" }
  | { tag: "OrR1" }
  | { tag: "OrR2" }
  | { tag: "ImpL" }
  | { tag: "ImpR" }
  | { tag: "BottomL" }
  | { tag: "TopR" }
  | { tag: "ForallL"; term: Term }
  | { tag: "ForallR"; ident: Ident }
  | { tag: "ExistL"; ident: Ident }
  | { tag: "ExistR"; term: Term }
  | { tag: "WL" }
  | { tag: "WR" }
  | { tag: "CL" }
  | { tag: "CR" }
  | { tag: "PL"; index: number }
  | { tag: "PR"; index: number };

export type Judgement = {
  assms: Formula[];
  concls: Formula[];
};

export type ProofCmd =
  | { tag: "Apply"; rule: Rule }
  | { tag: "Use"; thm: string }
  | { tag: "Qed" };

export type DeclCmd = { tag: "ThmD"; name: string; formula: Formula };

export type UndoCmd = { tag: "Undo" };

export type TopCmd = ProofCmd | DeclCmd | UndoCmd;

export function isDeclCmd(cmd: TopCmd): cmd is DeclCmd {
  return cmd.tag === "ThmD";
}

export function isProofCmd(cmd: TopCmd): cmd is ProofCmd {
  return ["Apply", "Use", "Qed"].includes(cmd.tag);
}

export function formatTerm(term: Term): string {
  switch (term.tag) {
    case "Var":
      return term.ident;
    case "Abs":
      return `λ${term.idents.join(", ")}.${formatTerm(term.body)}`;
    case "App": {
      const args = term.args.map(formatTerm).join(", ");
      return `${formatTerm(term.func)}(${args})`;
    }
  }
}

export function formatFormula(formula: Formula): string {
  switch (formula.tag) {
    case "Pred": {
      const args = formula.args.map(formatTerm).join(", ");
      return `${formula.ident}(${args})`;
    }
    case "Top":
      return "⊤";
    case "Bottom":
      return "⊥";
    case "And":
      return `(${formatFormula(formula.left)} ∧ ${formatFormula(
        formula.right
      )})`;
    case "Or":
      return `(${formatFormula(formula.left)} ∨ ${formatFormula(
        formula.right
      )})`;
    case "Imply":
      return `(${formatFormula(formula.left)} → ${formatFormula(
        formula.right
      )})`;
    case "Forall":
      return `∀${formula.ident}.(${formatFormula(formula.body)})`;
    case "Exist":
      return `∃${formula.ident}.(${formatFormula(formula.body)})`;
  }
}

export function formatJudgement(judgement: Judgement): string {
  const assms = judgement.assms.map(formatFormula).join(", ");
  const concls = judgement.concls.map(formatFormula).join(", ");
  return `${assms} ⊢ ${concls}`;
}

export function renameTerm(term: Term, from_to_table: Map<Ident, Ident>): Term {
  switch (term.tag) {
    case "Var":
      return { tag: "Var", ident: from_to_table.get(term.ident) ?? term.ident };
    case "Abs": {
      const new_table = new Map(from_to_table);
      term.idents.forEach((ident) => new_table.delete(ident));
      return {
        tag: "Abs",
        idents: term.idents,
        body: renameTerm(term.body, new_table),
      };
    }
    case "App":
      return {
        tag: "App",
        func: renameTerm(term.func, from_to_table),
        args: term.args.map((arg) => renameTerm(arg, from_to_table)),
      };
  }
}

export function renameFormula(
  formula: Formula,
  from_to_table: Map<Ident, Ident>
): Formula {
  switch (formula.tag) {
    case "Pred":
      return {
        tag: "Pred",
        ident: formula.ident,
        args: formula.args.map((arg) => renameTerm(arg, from_to_table)),
      };
    case "Top":
    case "Bottom":
      return formula;
    case "And":
      return {
        tag: "And",
        left: renameFormula(formula.left, from_to_table),
        right: renameFormula(formula.right, from_to_table),
      };
    case "Or":
      return {
        tag: "Or",
        left: renameFormula(formula.left, from_to_table),
        right: renameFormula(formula.right, from_to_table),
      };
    case "Imply":
      return {
        tag: "Imply",
        left: renameFormula(formula.left, from_to_table),
        right: renameFormula(formula.right, from_to_table),
      };
    case "Forall": {
      const new_table = new Map(from_to_table);
      new_table.delete(formula.ident);
      return {
        tag: "Forall",
        ident: formula.ident,
        body: renameFormula(formula.body, new_table),
      };
    }
    case "Exist": {
      const new_table = new Map(from_to_table);
      new_table.delete(formula.ident);
      return {
        tag: "Exist",
        ident: formula.ident,
        body: renameFormula(formula.body, new_table),
      };
    }
  }
}

export function substTerm(term: Term, v: Ident, target: Term): Term {
  switch (term.tag) {
    case "Var":
      return term.ident === v ? target : term;
    case "Abs": {
      if (term.idents.includes(v)) {
        return term;
      }

      // TODO: 毎回fvarsInTargetを計算しているので効率が悪い
      const fvarsInTarget = allFreeVarsInTerm(target);
      const rename_table = new Map();
      for (const ident of term.idents) {
        if (fvarsInTarget.has(ident)) {
          rename_table.set(ident, freshen(fvarsInTarget, ident));
        }
      }
      if (rename_table.size > 0) {
        return {
          tag: "Abs",
          idents: term.idents.map((ident) => rename_table.get(ident) ?? ident),
          body: substTerm(renameTerm(term.body, rename_table), v, target),
        };
      }

      return {
        tag: "Abs",
        idents: term.idents,
        body: substTerm(term.body, v, target),
      };
    }
    case "App":
      return {
        tag: "App",
        func: substTerm(term.func, v, target),
        args: term.args.map((arg) => substTerm(arg, v, target)),
      };
  }
}

export function substFormula(
  formula: Formula,
  v: Ident,
  target: Term
): Formula {
  switch (formula.tag) {
    case "Pred":
      return {
        tag: "Pred",
        ident: formula.ident,
        args: formula.args.map((arg) => substTerm(arg, v, target)),
      };
    case "Top":
    case "Bottom":
      return formula;
    case "And":
      return {
        tag: "And",
        left: substFormula(formula.left, v, target),
        right: substFormula(formula.right, v, target),
      };
    case "Or":
      return {
        tag: "Or",
        left: substFormula(formula.left, v, target),
        right: substFormula(formula.right, v, target),
      };
    case "Imply":
      return {
        tag: "Imply",
        left: substFormula(formula.left, v, target),
        right: substFormula(formula.right, v, target),
      };
    case "Forall": {
      if (formula.ident === v) {
        return formula;
      }

      // TODO: 毎回fvarsInTargetを計算しているので効率が悪い
      const fvarsInTarget = allFreeVarsInTerm(target);
      if (fvarsInTarget.has(formula.ident)) {
        const new_ident = freshen(fvarsInTarget, formula.ident);
        return {
          tag: "Forall",
          ident: new_ident,
          body: substFormula(
            renameFormula(formula, new Map([[formula.ident, new_ident]])),
            v,
            target
          ),
        };
      }

      return {
        tag: "Forall",
        ident: formula.ident,
        body: substFormula(formula.body, v, target),
      };
    }
    case "Exist": {
      if (formula.ident === v) {
        return formula;
      }

      // TODO: 毎回fvarsInTargetを計算しているので効率が悪い
      const fvarsInTarget = allFreeVarsInTerm(target);
      if (fvarsInTarget.has(formula.ident)) {
        const new_ident = freshen(fvarsInTarget, formula.ident);
        return {
          tag: "Exist",
          ident: new_ident,
          body: substFormula(
            renameFormula(formula, new Map([[formula.ident, new_ident]])),
            v,
            target
          ),
        };
      }

      return {
        tag: "Exist",
        ident: formula.ident,
        body: substFormula(formula.body, v, target),
      };
    }
  }
}

export function allFreeVarsInTerm(term: Term): Set<Ident> {
  switch (term.tag) {
    case "Var":
      return new Set([term.ident]);
    case "Abs":
      return allFreeVarsInTerm(term.body).difference(new Set(term.idents));
    case "App":
      return term.args.reduce(
        (acc, arg) => acc.union(allFreeVarsInTerm(arg)),
        allFreeVarsInTerm(term.func)
      );
  }
}

export function allFreeVarsInFormula(formula: Formula): Set<Ident> {
  switch (formula.tag) {
    case "Pred":
      return formula.args.reduce(
        (acc, arg) => acc.union(allFreeVarsInTerm(arg)),
        new Set([formula.ident])
      );
    case "Top":
    case "Bottom":
      return new Set();
    case "And":
    case "Or":
    case "Imply":
      return allFreeVarsInFormula(formula.left).union(
        allFreeVarsInFormula(formula.right)
      );
    case "Forall":
    case "Exist":
      return allFreeVarsInFormula(formula.body).difference(
        new Set([formula.ident])
      );
  }
}

export function freshen(idents: Set<Ident>, x: Ident): Ident {
  while (idents.has(x)) {
    x = `${x}'`;
  }
  return x;
}

export function freeInTerm(term: Term, v: Ident): boolean {
  switch (term.tag) {
    case "Var":
      return term.ident === v;
    case "Abs":
      return !term.idents.includes(v) && freeInTerm(term.body, v);
    case "App":
      return (
        freeInTerm(term.func, v) || term.args.some((arg) => freeInTerm(arg, v))
      );
  }
}

export function freeInFormula(formula: Formula, v: Ident): boolean {
  switch (formula.tag) {
    case "Pred":
      return (
        v === formula.ident || formula.args.some((arg) => freeInTerm(arg, v))
      );
    case "Top":
    case "Bottom":
      return false;
    case "And":
    case "Or":
    case "Imply":
      return freeInFormula(formula.left, v) || freeInFormula(formula.right, v);
    case "Forall":
    case "Exist":
      return formula.ident !== v && freeInFormula(formula.body, v);
  }
}

export function freeInFormulas(formulas: Formula[], v: Ident): boolean {
  return formulas.some((formula) => freeInFormula(formula, v));
}
