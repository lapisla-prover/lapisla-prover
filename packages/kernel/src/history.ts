import { Formula, Ident, Judgement, Rule, Type } from "./ast";
import { judgeOne } from "./checker";
import { Err, Ok, Result } from "./common";
import { Env as TopEnv, initialEnv, insertThm, insertConstant } from "./env";

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

  push(goals: Judgement[]): void {
    this.steps.push(goals);
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
  | { tag: "Constant"; name: string; ty: Type; env: TopEnv }
  | { tag: "Axiom"; name: string; formula: Formula; env: TopEnv }
  | { tag: "Import"; name: string; env: TopEnv }
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

  // Insert type to current environment and push it to stack.
  insertConstant(name: Ident, ty: Type): TopEnv {
    const new_env = insertConstant(this.top().env, name, ty);
    this.steps.push({ tag: "Constant", name, ty, env: new_env });
    return new_env;
  }

  // Insert axiom to current environment and push it to stack.
  insertAxiom(name: Ident, formula: Formula): TopEnv {
    const new_env = insertThm(this.top().env, name, formula);
    this.steps.push({ tag: "Axiom", name, formula, env: new_env });
    return new_env;
  }

  insertImport(name: Ident, new_env: TopEnv): TopEnv {
    this.steps.push({ tag: "Import", name, env: new_env });
    return new_env;
  }

  // Get current step (top of stack)
  top(): TopStep {
    return this.steps.at(-1);
  }

  // Pop current step
  pop(): Result<TopStep, string> {
    if (this.steps.length <= 1) {
      return Err("No history to pop.");
    }
    return Ok(this.steps.pop()!);
  }

  allTheorem(): TopStep[] {
    const result: TopStep[] = [];
    for (const step of this.steps) {
      if (step.tag === "Theorem") {
        result.push(step);
      }
    }

    return result;
  }
}
