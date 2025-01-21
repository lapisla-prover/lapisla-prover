import { Judgement, Rule } from "./ast";
import { judgeOne } from "./checker";
import { Err, Ok, Result } from "./common.ts";

export class History {
    private steps: Judgement[][] = [];

    constructor(initial: Judgement[]) {
        this.steps.push(initial);
    }

    // Check if all goals are finished.
    isFinished(): boolean {
        return this.top().length === 0;
    }

    // Apply rule for top of stack.
    //   If application finished successfully, 
    //   new goals are pushed to stack.
    //   If it's not able to apply, 
    //   return Err and goal (top of stack) is not change.
    applyRule(rule: Rule): Result<Judgement[], string> {
        const current = this.top();
        const result = judgeOne(rule, current);
        if (result.tag === "Ok") {
            this.steps.push(result.value);
        }

        return result;
    }

    // Get current goals (top of stack)
    top(): Judgement[] {
        return this.steps[this.steps.length - 1];
    }

    // Pop current goals
    pop(): Result<Judgement[], string> {
        if (this.steps.length === 1) {
            return Err("No history to pop.");
        }
        return Ok(this.steps.pop()!);
    }
}