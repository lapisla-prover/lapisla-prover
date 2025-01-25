// Interface to interact with the kernel

import { Judgement, TopCmd } from "./ast";
import { KernelState, topLoop } from "./checker";
import { Err, Ok, Result } from "./common";
import { deepCopyEnv, Env, insertConstant, insertThm } from "./env";
import { TopHistory, TopStep } from "./history";
import { CmdWithLoc, Location, parseProgram, PartialProgram } from "./parser";

export class Kernel {
    private tophistory: TopHistory = new TopHistory();
    private lastLoc: Location[] = [{ line: 0, column: 0 }];
    private currentState: KernelState = { mode: "DeclareWait" };
    private loop: Generator<Result<KernelState, string>, never, TopCmd>;
    private pkggeter: (name: string) => string;

    constructor(pkggeter: (name: string) => string) {
        this.loop = topLoop(this.tophistory);
        this.loop.next(); // initialize
        this.pkggeter = pkggeter;
    }

    reset(): void {
        this.tophistory = new TopHistory();
        this.loop = topLoop(this.tophistory);
        this.loop.next(); // initialize
        this.lastLoc = [{ line: 0, column: 0 }];
    }

    poploc(): void {
        if (this.lastLoc.length > 1) {
            this.lastLoc.pop();
        }
    }

    lastLocation(): Location {
        return this.lastLoc[this.lastLoc.length - 1];
    }

    parse(input: string): Result<CmdWithLoc[], PartialProgram> {
        const program = parseProgram(input);

        if (program.tag === "Err") {
            console.log(program.error.error.message);
        }
        return program;
    }

    getCurrentMode(): KernelState {
        return this.currentState;
    }

    getCurrentGoals(): Judgement[] {
        if (this.currentState.mode === "Proving") {
            return this.currentState.proofHistory.top();
        } else if (this.currentState.mode === "DeclareWait") {
            return [];
        } else {
            throw new Error("Unexpected mode");
        }
    }

    // return the environment after the proof
    // under the assumption that the proof is correct
    private collectEnv(
        src: string
    ): Result<Env, string> {
        console.log("Collecting environment from", src);
        const res = parseProgram(src);
        if (res.tag === "Err") {
            return Err(res.error.error.message);
        }

        let newEnv = deepCopyEnv(this.currentglobalEnv());

        for (const cmd of res.value) {
            if (cmd.cmd.tag === "Theorem") {
                newEnv = insertThm(newEnv, cmd.cmd.name, cmd.cmd.formula);
            } else if (cmd.cmd.tag === "Axiom") {
                newEnv = insertThm(newEnv, cmd.cmd.name, cmd.cmd.formula);
            } else if (cmd.cmd.tag === "Constant") {
                newEnv = insertConstant(newEnv, cmd.cmd.name, cmd.cmd.ty);
            } else if (cmd.cmd.tag === "Import") {
                // NOTE: Don't create new command for recursive import!
                //    In case of undo `import`, all theorems and constants should be removed.
                //    It means that we need to pack all import for one command.
                //    So, don't create new command, just collect and merge the environment.

                const childEnv = this.collectEnv(this.pkggeter(cmd.cmd.name));

                if (childEnv.tag === "Err") {
                    return Err(childEnv.error);
                }

                // Merge the child environment into the parent environment
                for (const [key, value] of childEnv.value.thms.entries()) {
                    newEnv = insertThm(newEnv, key, value);
                }
                for (const [key, value] of childEnv.value.types.entries()) {
                    newEnv = insertConstant(newEnv, key, value);
                }
            }
        }

        return Ok(newEnv);
    }



    // execute a command
    execute(command: CmdWithLoc): Result<KernelState, string> {
        if (command.cmd.tag === "Import") {
            const importprogram = this.pkggeter(command.cmd.name);

            const newEnv = this.collectEnv(importprogram);

            if (newEnv.tag === "Err") {
                return { tag: "Err", error: `Import Error: Failed to import ${command.cmd.name} with ${newEnv.error}` };
            }

            this.tophistory.insertImport(command.cmd.name, newEnv.value);

            this.currentState = { mode: "DeclareWait" };
            this.lastLoc.push(command.loc.end);

            return { tag: "Ok", value: this.currentState };

        } else {
            const res = this.loop.next(command.cmd);
            if (res.value.tag == "Ok") {
                this.currentState = res.value.value;
                this.lastLoc.push(command.loc.end);
            } else {
                console.log(res.value.error);
            }
            return res.value;
        }
    }

    undo(): Result<KernelState, string> {
        const unDoCommand: TopCmd = { tag: "Undo" };
        const res = this.loop.next(unDoCommand);
        if (res.value.tag === "Ok") {
            this.poploc();
            this.currentState = res.value.value;
        }
        return res.value;
    }

    currentglobalEnv(): Env {
        return this.tophistory.top().env;
    }
}