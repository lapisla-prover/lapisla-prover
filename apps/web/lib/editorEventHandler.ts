import { Result } from "@repo/kernel/common";
import { Kernel } from "@repo/kernel/kernel";
import { CmdWithLoc, isAfter, Location, PartialProgram } from "@repo/kernel/parser";
import { EditorInteracter } from "./editorInteracter";
import { formatProofState } from "./format";

function findFirstCommand(commands: CmdWithLoc[], loc: Location): CmdWithLoc | undefined {
    for (const command of commands) {
        if (isAfter(command.loc.start, loc)) {
            return command;
        }
    }

    return undefined;
}

export type StepResult = {
    somethingExecuted: boolean;
};


export function undoLocation(prev: string, next: string): Location | undefined {
    if (next.startsWith(prev)) {
        return undefined;
    }

    let line = 0;
    let column = 0;

    for (let i = 0; i < prev.length; i++) {
        if (prev[i] === "\n") {
            line++;
            column = 0;
        } else {
            column++;
        }

        if (i >= next.length || prev[i] !== next[i]) {
            return { line, column };
        }
    }

    return undefined;
}


export function step(kernel: Kernel, interacter: EditorInteracter): Result<StepResult, string> {
    const content = interacter.getMainEditorContent();
    const commandsResult: Result<CmdWithLoc[], PartialProgram> = kernel.parse(content);

    const commands = commandsResult.tag === "Ok" ? commandsResult.value : commandsResult.error.cmds;

    if (commandsResult.tag === "Err") {
        const errorloc = commandsResult.error.error.loc;
        console.log(`Error at ${errorloc.start.line}:${errorloc.start.column}`);
    }

    if (commands.length === 0 || !commands[0]) {
        console.log("No command execute new.");
        return { tag: "Ok", value: { somethingExecuted: false } };
    }

    const firstCommand = findFirstCommand(commands, kernel.lastLocation());
    if (!firstCommand) {
        console.log("No command execute new.");
        return { tag: "Ok", value: { somethingExecuted: false } };
    }

    const result = kernel.execute(firstCommand);

    if (result.tag !== "Ok") {
        interacter.setMessagesEditorContent(
            `Execution Error:\n${result.error} \n at row ${firstCommand.loc.start.line + 1}.`
        );
        return { tag: "Err", error: result.error };
    } 

    const proofHistory = result.value.proofHistory;
    if (proofHistory) {
        interacter.setGoalEditorContent(formatProofState(proofHistory.top()));
    } else {
        interacter.setGoalEditorContent("No goal. Proven!");
    }

    interacter.greenHighlight(firstCommand.loc);
    return { tag: "Ok", value: { somethingExecuted: true } };
}

export function undo(kernel: Kernel, interacter: EditorInteracter, steps: number) {
    for (let i = 0; i < steps; i++) {
        const result = kernel.undo();
        if (result.tag === "Err") {
            console.log("No command to undo. Skip....");
            interacter.setGoalEditorContent("Waiting for command...");
            break;
        } else {
            interacter.setGoalEditorContent(formatProofState(kernel.getCurrentGoals()));
        }
    }
    interacter.removeGreenHighlight(1);
}


export function executeAll(kernel: Kernel, interacter: EditorInteracter) {
    while (true) {
        const result = step(kernel, interacter);
        if (result.tag === "Err") {
            console.log(result.error);
            break;
        }

        if (!result.value.somethingExecuted) {
            break;
        }
    }
}

export function undoStep(kernel: Kernel, interacter: EditorInteracter) {
    const res = kernel.undo();

    if (res.tag === "Err") {
        console.log(res.error);
    } else {
        interacter.setGoalEditorContent(formatProofState(kernel.getCurrentGoals()));
    }

    interacter.removeGreenHighlight(1);
}



export function undoUntil(kernel: Kernel, interacter: EditorInteracter, loc: Location): void {
    while (isAfter(kernel.lastLocation(), loc)) {
        undoStep(kernel, interacter);
    }
}