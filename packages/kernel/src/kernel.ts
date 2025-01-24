// Interface to interact with the kernel

import { Judgement, TopCmd } from "./ast";
import { KernelState, topLoop } from "./checker";
import { Ok, Result } from "./common";
import { TopHistory } from "./history";
import { CmdWithLoc, Location, parseProgram } from "./parser";

export class Kernel {
    private tophistory: TopHistory;
    private lastLoc: Location;
    private currentState: KernelState;
    private loop: Generator<Result<KernelState, string>, never, TopCmd>;

    constructor() {
        console.log("Kernel Initialized!");
        this.tophistory = new TopHistory();
        this.loop = topLoop(this.tophistory);
        this.loop.next(); // initialize
        this.lastLoc = { line: 0, column: 0 };
    }

    lastLocation(): Location {
        return this.lastLoc;
    }

    parse(input: string): Result<CmdWithLoc[], string> {
        const program = parseProgram(input);

        if (program.tag === "Err") {
            console.log(program.error);
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

    // execute a command
    execute(command: CmdWithLoc): Result<KernelState, string> {
        const res = this.loop.next(command.cmd);
        if (res.value.tag == "Ok") {
            this.currentState = res.value.value;
            this.lastLoc = command.loc.end;

        } else {
            console.log(res.value.error);
        }
        return res.value;
    }


    undoUntil(location: Location): Result<string, string> {
        return Ok("Redo until");
    }

    undo(): Result<string, string> {
        return Ok("Undo");
    }
}