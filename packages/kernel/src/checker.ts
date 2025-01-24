import {
  Formula,
  Judgement,
  KernelMode,
  KernelState,
  ProofCmd,
  Rule,
  TopCmd,
  UndoCmd,
  freeInFormula,
  freeInFormulas,
  isDeclCmd,
  isProofCmd,
  substFormula
} from "./ast.ts";
import { Err, Ok, Result, deepEqual } from "./common.ts";
import { ProofHistory, TopHistory } from "./history.ts";

export function judgeOne(
  rule: Rule,
  goals: Judgement[]
): Result<Judgement[], string> {
  if (goals.length === 0) {
    return Err("No goal");
  }
  const [{ assms, concls }, ...restGoals] = goals;
  switch (rule.tag) {
    //
    // -------- (I)
    //  A |- A
    case "I": {
      if (assms.length !== 1 || concls.length !== 1) {
        return Err("The number of assumptions and conclusions must be 1");
      }
      if (!deepEqual(assms[0], concls[0])) {
        return Err("The assumption and the conclusion must be the same");
      }
      return Ok(restGoals);
    }
    //  Γ |- A, Δ    A, Γ |- Δ
    // ------------------------ (Cut)
    //          Γ |- Δ
    case "Cut": {
      const subgoal1 = { assms, concls: [rule.formula, ...concls] };
      const subgoal2 = { assms: [rule.formula, ...assms], concls };
      return Ok([subgoal1, subgoal2, ...restGoals]);
    }
    //    A, Γ |- Δ
    // ---------------- (AndL1)
    //  A /\ B, Γ |- Δ
    case "AndL1": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      if (assm.tag !== "And") {
        return Err("The assumption must be a conjunction");
      }
      const subgoal = { assms: [assm.left, ...restAssms], concls };
      return Ok([subgoal, ...restGoals]);
    }
    //    B, Γ |- Δ
    // ---------------- (AndL2)
    //  A /\ B, Γ |- Δ
    case "AndL2": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      if (assm.tag !== "And") {
        return Err("The assumption must be a conjunction");
      }
      const subgoal = { assms: [assm.right, ...restAssms], concls };
      return Ok([subgoal, ...restGoals]);
    }
    //  Γ |- A, Δ    Γ |- B, Δ
    // ------------------------ (AndR)
    //      Γ |- A /\ B, Δ
    case "AndR": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      if (concl.tag !== "And") {
        return Err("The assumption must be a conjunction");
      }
      const subgoal1 = { assms, concls: [concl.left, ...restConcls] };
      const subgoal2 = { assms, concls: [concl.right, ...restConcls] };
      return Ok([subgoal1, subgoal2, ...restGoals]);
    }
    //  A, Γ |- Δ    B, Γ |- Δ
    // ------------------------ (OrL)
    //      A \/ B, Γ |- Δ
    case "OrL": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      if (assm.tag !== "Or") {
        return Err("The assumption must be a disjunction");
      }
      const subgoal1 = { assms: [assm.left, ...restAssms], concls };
      const subgoal2 = { assms: [assm.right, ...restAssms], concls };
      return Ok([subgoal1, subgoal2, ...restGoals]);
    }
    //    Γ |- A, Δ
    // ---------------- (OrR1)
    //  Γ |- A \/ B, Δ
    case "OrR1": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      if (concl.tag !== "Or") {
        return Err("The conclusion must be a disjunction");
      }
      const subgoal = { assms, concls: [concl.left, ...restConcls] };
      return Ok([subgoal, ...restGoals]);
    }
    //    Γ |- B, Δ
    // ---------------- (OrR2)
    //  Γ |- A \/ B, Δ
    case "OrR2": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      if (concl.tag !== "Or") {
        return Err("The conclusion must be a disjunction");
      }
      const subgoal = { assms, concls: [concl.right, ...restConcls] };
      return Ok([subgoal, ...restGoals]);
    }
    //  Γ |- A, Δ    B, Γ |- Δ
    // ------------------------ (ImpL)
    //      A -> B, Γ |- Δ
    case "ImpL": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      if (assm.tag !== "Imply") {
        return Err("The assumption must be an implication");
      }
      const subgoal1 = { assms: restAssms, concls: [assm.left, ...concls] };
      const subgoal2 = { assms: [assm.right, ...restAssms], concls };
      return Ok([subgoal1, subgoal2, ...restGoals]);
    }
    //   A, Γ |- B, Δ
    // ---------------- (ImpR)
    //  Γ |- A -> B, Δ
    case "ImpR": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      if (concl.tag !== "Imply") {
        return Err("The conclusion must be an implication");
      }
      const subgoal = {
        assms: [concl.left, ...assms],
        concls: [concl.right, ...restConcls],
      };
      return Ok([subgoal, ...restGoals]);
    }
    //
    // ----------- (BottomL)
    //  ⊥, Γ |- Δ
    case "BottomL": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      if (assms[0].tag !== "Bottom") {
        return Err("The assumption must be a bottom");
      }
      return Ok(restGoals);
    }
    //
    // ----------- (TopR)
    //  Γ |- ⊤, Δ
    case "TopR": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      if (concls[0].tag !== "Top") {
        return Err("The conclusion must be a top");
      }
      return Ok(restGoals);
    }
    //  A[x:=t], Γ |- Δ
    // ----------------- (ForallL)
    //   ∀x. A, Γ |- Δ
    case "ForallL": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      if (assm.tag !== "Forall") {
        return Err("The assumption must be a universal quantification");
      }
      const subgoal = {
        assms: [substFormula(assm.body, assm.ident, rule.term), ...restAssms],
        concls,
      };
      return Ok([subgoal, ...restGoals]);
    }
    //  Γ |- A[x:=z], Δ    z does not appear free
    // ------------------------------------------- (ForallR)
    //              Γ |- ∀x. A, Δ
    case "ForallR": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      if (concl.tag !== "Forall") {
        return Err("The conclusion must be a universal quantification");
      }
      if (
        freeInFormulas(assms, rule.ident) ||
        freeInFormulas(restConcls, rule.ident) ||
        freeInFormula(concl.body, rule.ident)
      ) {
        return Err("The variable must not appear free in the conclusion");
      }
      const subgoal = {
        assms,
        concls: [
          substFormula(concl.body, concl.ident, {
            tag: "Var",
            ident: rule.ident,
          }),
          ...restConcls,
        ],
      };
      return Ok([subgoal, ...restGoals]);
    }
    //  A[x:=z], Γ |- Δ    z does not appear free
    // ------------------------------------------- (ExistL)
    //            ∃x. A, Γ |- Δ
    case "ExistL": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      if (assm.tag !== "Exist") {
        return Err("The assumption must be an existential quantification");
      }
      if (
        freeInFormulas(restAssms, rule.ident) ||
        freeInFormulas(concls, rule.ident) ||
        freeInFormula(assm.body, rule.ident)
      ) {
        return Err("The variable must not appear free in the conclusion");
      }
      const subgoal = {
        assms: [
          substFormula(assm.body, assm.ident, {
            tag: "Var",
            ident: rule.ident,
          }),
          ...restAssms,
        ],
        concls,
      };
      return Ok([subgoal, ...restGoals]);
    }
    //  Γ |- A[x:=t], Δ
    // ----------------- (ExistR)
    //   Γ |- ∃x. A, Δ
    case "ExistR": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      if (concl.tag !== "Exist") {
        return Err("The conclusion must be an existential quantification");
      }
      const subgoal = {
        assms,
        concls: [
          substFormula(concl.body, concl.ident, rule.term),
          ...restConcls,
        ],
      };
      return Ok([subgoal, ...restGoals]);
    }
    //   Γ |- Δ
    // ----------- (WL)
    //  A, Γ |- Δ
    case "WL": {
      if (assms.length === 0) {
        return Err("No assumption");
      }
      return Ok([{ assms: assms.slice(1), concls }, ...restGoals]);
    }
    //   Γ |- Δ
    // ----------- (WR)
    //  A, Γ |- Δ
    case "WR": {
      if (concls.length === 0) {
        return Err("No conclusion");
      }
      return Ok([{ assms, concls: concls.slice(1) }, ...restGoals]);
    }
    //  A, A, Γ |- Δ
    // -------------- (CL)
    //   A, Γ |- Δ
    case "CL": {
      if (assms.length == 0) {
        return Err("No assumption");
      }
      const [assm, ...restAssms] = assms;
      return Ok([{ assms: [assm, assm, ...restAssms], concls }, ...restGoals]);
    }
    //  Γ |- A, A, Δ
    // -------------- (CR)
    //   Γ |- A, Δ
    case "CR": {
      if (concls.length == 0) {
        return Err("No conclusion");
      }
      const [concl, ...restConcls] = concls;
      return Ok([
        { assms, concls: [concl, concl, ...restConcls] },
        ...restGoals,
      ]);
    }
    //  A, Γ, Γ' |- Δ
    // --------------- (PL)
    //  Γ, A, Γ' |- Δ
    case "PL": {
      if (assms.length <= rule.index) {
        return Err("The index is out of range");
      }
      return Ok([
        {
          assms: [assms[rule.index], ...assms.toSpliced(rule.index, 1)],
          concls,
        },
        ...restGoals,
      ]);
    }
    //  Γ |- A, Δ, Δ'
    // --------------- (PR)
    //  Γ |- Δ, A, Δ'
    case "PR": {
      if (concls.length <= rule.index) {
        return Err("The index is out of range");
      }
      return Ok([
        {
          assms,
          concls: [concls[rule.index], ...concls.toSpliced(rule.index, 1)],
        },
        ...restGoals,
      ]);
    }
  }
}

export function judgeMany(
  rules: Rule[],
  goals: Judgement[]
): Result<Judgement[], [cause: Rule, error: string, restGoals: Judgement[]]> {
  for (const rule of rules) {
    const result = judgeOne(rule, goals);
    if (result.tag === "Err") {
      return Err([rule, result.error, goals]);
    }
    goals = result.value;
  }
  return Ok(goals);
}

export function* proofLoop(
  history: ProofHistory
): Generator<Result<void, string>, Result<void, string>, ProofCmd | UndoCmd> {
  let result: Result<void, string> = Ok();

  loop: while (true) {
    const com = yield result;

    switch (com.tag) {
      case "Apply": {
        const res = history.applyRule(com.rule);
        if (res.tag === "Err") {
          result = Err(res.error);
        } else {
          result = Ok();
        }
        continue loop;
      }
      case "Use":
        throw new Error("unimplemented");
      case "Undo": {
        const res = history.pop();
        if (res.tag === "Err") {
          return Err(res.error);
        }
        result = Ok();
        continue loop;
      }
      case "Qed":
        if (history.isFinished()) {
          return Ok();
        }
        result = Err("The proof is not finished");
        continue loop;
      default:
        com satisfies never;
        throw new Error("Unreachable");
    }
  }
}

export type KernelMode = "DeclareWait" | "Proving";
export type KernelState = {
  mode: KernelMode;
  proofHistory?: ProofHistory;
}

export function* topLoop(
  topHistory: TopHistory
): Generator<Result<KernelState, string>, never, TopCmd> {
  let result: Result<KernelState, string> = Ok({ mode: "DeclareWait" });

  // 全体のループ
  while (true) {
    // topModeからproofModeに移行する際に必要な情報
    let thmName: string; // 示そうとしている定理の名前
    let thmFormula: Formula; // 示そうとしている定理の式
    let proofHistory: ProofHistory; // 証明の履歴

    // トップレベルのコマンドを受け取る
    topMode: while (true) {
      const topCmd = yield result;


      if (isProofCmd(topCmd)) {
        result = Err("Invalid command; we are in declare mode");
        continue topMode;
      }

      if (topCmd.tag === "Theorem") {
        thmName = topCmd.name;
        thmFormula = topCmd.formula;
        proofHistory = new ProofHistory([{ assms: [], concls: [thmFormula] }]);
        result = Ok({ mode: "Proving", proofHistory });
        break topMode;
      }

      if (topCmd.tag === "Undo") {
        const maybePrevStep = topHistory.pop();
        if (maybePrevStep.tag === "Err") {
          result = Err(maybePrevStep.error);
          continue topMode;
        }

        const prevStep = maybePrevStep.value;
        // 前のstepがTheoremの場合はproofModeに移行する
        if (prevStep.tag === "Theorem") {
          thmName = prevStep.name;
          thmFormula = prevStep.formula;
          proofHistory = prevStep.proofHistory;
          result = Ok({ mode: "Proving", proofHistory });
          break topMode;
        }

        result = Ok({ mode: "DeclareWait" });
        continue topMode;
      }

      topCmd satisfies never;
      throw new Error("Unreachable");
    }

    const ploop = proofLoop(proofHistory);
    ploop.next(); // 最初の `yield` まで進める

    // proofモードのループ
    proofMode: while (true) {
      const topCmd = yield result;

      if (isDeclCmd(topCmd)) {
        result = Err("Invalid command; we are in proof mode");
        continue proofMode;
      }

      const res = ploop.next(topCmd);
      // Qedにより証明が終了した場合(res.valueがOk)，またはUndoで証明の履歴が空になった場合(res.valueがErr)
      // FIXME: もう少しいいやり方がある気がする
      if (res.done) {
        if (res.value.tag === "Ok") {
          topHistory.insertThm(thmName, thmFormula, proofHistory);
        }
        result = Ok({ mode: "DeclareWait" });
        break proofMode;
      } 

      result = Ok({ mode: "Proving", proofHistory });
    }
  }
}
