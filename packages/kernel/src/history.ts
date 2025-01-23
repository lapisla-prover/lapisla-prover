import { Formula, Ident, Judgement, Rule } from "./ast";
import { judgeOne } from "./checker";
import { Err, Ok, Result } from "./common.ts";
import { Env as TopEnv, initialEnv, insertThm } from "./env.ts";

export class ProofHistory {
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
    if (this.steps.length <= 1) {
      return Err("No history to pop.");
    }
    return Ok(this.steps.pop()!);
  }
}

export type TopStep =
  | {
    tag: "Theorem";
    name: string;
    formula: Formula;
    proofHistory: ProofHistory;
    env: TopEnv;
  }
  | { tag: "Other"; env: TopEnv };

export class TopHistory {
  private steps: TopStep[] = [{ tag: "Other", env: initialEnv() }];

  // Insert theorem to current environment and push it to stack.
  insertThm(name: Ident, formula: Formula, history: ProofHistory): TopEnv {
    if (!history.isFinished()) {
      throw new Error("Proof is not finished.");
    }
    const new_env = insertThm(this.top().env, name, formula);
    this.steps.push({
      tag: "Theorem",
      name,
      formula,
      proofHistory: history,
      env: new_env,
    });
    return new_env;
  }

  // Get current step (top of stack)
  top(): TopStep {
    return this.steps.at(-1);
  }

  // Pop current step
  pop(): Result<TopStep, string> {
    if (this.steps.length <= 1) {
      throw new Error("No history to pop.");
    }
    return Ok(this.steps.pop()!);
  }
}
