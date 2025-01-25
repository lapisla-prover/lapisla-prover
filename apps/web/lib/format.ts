import { Formula, Judgement, Term } from "@repo/kernel/ast";


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
            if (formula.args.length === 0) {
                return formula.ident;
            }

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


export function formatProofState(judgements: Judgement[]): string {
    if (judgements.length === 0) {
        return "No goal. Proven!";
    }

    let result = `${judgements.length} subgoals\n\n`;

    for (let i = 0; i < judgements.length; i++) {
        if (i > 0) {
            result += "\n\n";
        }

        result += `Goal ${i + 1} / ${judgements.length}:\n  `;



        const judgement = judgements[i];
        if (judgement) {
            const { assms, concls } = judgement;

            const assmsStr = assms.map(formatFormula);
            const conclsStr = concls.map(formatFormula);

            const maxLen = assmsStr
                .concat(conclsStr)
                .map((f) => f.length)
                .reduce((a, b) => Math.max(a, b), 20);

            result += assmsStr.join(",\n  ");

            result += "\n " + "─".repeat(maxLen + 2) + "\n  ";

            result += conclsStr.join(",\n  ");
        }

    }

    return result;
}
