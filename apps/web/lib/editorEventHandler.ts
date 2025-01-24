import { Result } from "@repo/kernel/common";
import { Kernel } from "@repo/kernel/kernel";
import { CmdWithLoc, isAfter, Location } from "@repo/kernel/parser";
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


export function step(kernel: Kernel, interacter: EditorInteracter): Result<StepResult, string> {
    const content = interacter.getMainEditorContent();
    const commandsResult = kernel.parse(content);

    if (commandsResult.tag !== "Ok") {
        console.log("Failed to parse");
        return { tag: "Err", error: "Failed to parse" };
    }

    const commands = commandsResult.value;

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
        return { tag: "Err", error: "Failed to execute command" };
    }

    const proofHistory = result.value.proofHistory;
    if (proofHistory) {
        interacter.setGoalEditorContent(formatProofState(proofHistory.top()));
    } else {
        interacter.setGoalEditorContent("No goal. Proven!");
    }

    interacter.highlight(firstCommand.loc);
    return { tag: "Ok", value: { somethingExecuted: true } };
}

export function undo(kernel: Kernel, interacter: EditorInteracter, steps: number) {
    for (let i = 0; i < steps; i++) {
        const result = kernel.undo();
        if (result.tag === "Err") {
            console.log(result.error);
            break;
        }
    }
    interacter.removeHighlight(1);
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
