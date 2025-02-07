import { describe, expect, test } from "vitest";
import { executeProgram } from "./kernel";
import { expectOk } from "./test-util";

describe("executeProgram", () => {


    // simple proof
    const src1 = `
    Theorem id P → P
    apply ImpR
    apply I
    qed
    `


    test("executeProgram", async () => {
        const res = await executeProgram(src1, async (pkgName: string) => {
            return {
                tag: "Ok",
                value: ""
            }
        }
        );

        expect(res.success).toBe(true);
    });


    // not finished
    const src2 = `
    Theorem id P → P
    apply ImpR 
    apply I
    `

    test("executeProgram", async () => {
        const res = await executeProgram(src2, async (pkgName: string) => {
            return {
                tag: "Ok",
                value: ""
            }
        }
        );

        expect(res.success).toBe(false);
    }
    )

    // double theorems
    const src3 = `
    Theorem id P → P
    apply ImpR
    apply I
    qed

    Theorem thm ∀x. P(x) → ∀x. P(x)
    use id {P ↦ ∀x. P(x)}
    apply I
    qed
    `

    test("executeProgram", async () => {
        const res = await executeProgram(src3, async (pkgName: string) => {
            return {
                tag: "Ok",
                value: ""
            }
        }
        );

        expect(res.success).toBe(true);

    });


    //  syntax err
    const src4 = `
    Theorem id P → P
    apply ImpR
    apply 
    qed
    `

    test("executeProgram", async () => {
        const res = await executeProgram(src4, async (pkgName: string) => {
            return {
                tag: "Ok",
                value: ""
            }
        }
        );

        expect(res.success).toBe(false);
        expect(res.errorType).toBe("ProgramError");

    }
    )

    // success
    const src = `
    Theorem id P → P
    apply ImpR
    apply I 
    qed

    Theorem thm ∀x. P(x) → ∀x. P(x)
    use id {P ↦ ∀x. P(x)}
    apply I
    qed

    Theorem curry (A → B → C) → (A ∧ B → C) 
    apply ImpR
    apply ImpR
    apply PL 1
    apply ImpL
    apply AndL1
    apply PR 1
    apply WR
    apply I
    apply ImpL
    apply AndL2
    apply PR 1
    apply WR
    apply I
    apply PL 1
    apply WL
    apply I
    qed

    Theorem distribute (A → (B ∧ C)) → (A → B) ∧ (A → C)
    apply ImpR
    apply AndR
    apply ImpL
    apply PR 1
    apply ImpR
    apply WR
    apply I
    apply AndL1
    apply ImpR
    apply WL
    apply I
    apply ImpL
    apply PR 1
    apply ImpR
    apply WR
    apply I
    apply AndL2
    apply ImpR
    apply WL
    apply I
    qed`;

    test("executeProgram", async () => {
        const res = await executeProgram(src, async (pkgName: string) => {
            return {
                tag: "Ok",
                value: ""
            }
        }
        );

        expect(res.success).toBe(true);

    }
    )
});