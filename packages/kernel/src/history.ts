import { Judgement, Rule } from "./ast";
import { judgeOne } from "./checker";
import { Err, Ok, Result } from "./common.ts";

export class History {
    private steps: Judgement[][] = [];

    constructor(initial: Judgement[]) {

        this.steps.push(initial);
    }

    applyRule(rule: Rule): Result<Judgement[], string> {
        const current = this.top();
        if (current.tag === "Err") {
            return Err("No goal to apply.");
        }

        const result = judgeOne(rule, current.value);
        if (result.tag === "Ok") {
            this.steps.push(result.value);
        }

        return result;
    }

    top(): Result<Judgement[], string> {
        if (this.steps.length === 0) {
            return Err("No history to get.");
        }
        return Ok(this.steps[this.steps.length - 1]);
    }

    pop(): Result<Judgement[], string> {
        if (this.steps.length === 0) {
            return Err("No history to pop.");
        }
        return Ok(this.steps.pop()!);
    }
}