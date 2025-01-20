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
        formula.right,
      )})`;
    case "Or":
      return `(${formatFormula(formula.left)} ∨ ${formatFormula(
        formula.right,
      )})`;
    case "Imply":
      return `(${formatFormula(formula.left)} → ${formatFormula(
        formula.right,
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

export function substTerm(term: Term, v: Ident, target: Term): Term {
  switch (term.tag) {
    case "Var":
      return term.ident === v ? target : term;
    case "Abs": {
      if (term.idents.includes(v)) {
        return term;
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
  target: Term,
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
    case "Forall":
      if (formula.ident === v) {
        return formula;
      }
      return {
        tag: "Forall",
        ident: formula.ident,
        body: substFormula(formula.body, v, target),
      };
    case "Exist":
      if (formula.ident === v) {
        return formula;
      }
      return {
        tag: "Exist",
        ident: formula.ident,
        body: substFormula(formula.body, v, target),
      };
  }
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
      return formula.args.some((arg) => freeInTerm(arg, v));
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
