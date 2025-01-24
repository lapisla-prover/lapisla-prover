import { Kernel } from "@repo/kernel/kernel";
import { CmdWithLoc, isAfter, Location, Range } from "@repo/kernel/parser";
import { formatProofState } from "./format";
import { EditorInteracter } from "./editorInteracter";



function findFirstCommand(commands: CmdWithLoc[], loc: Location): CmdWithLoc | undefined {
    for (const command of commands) {
        if (isAfter(command.loc.start, loc)) {
            return command;
        }
    }

    return undefined;
}


export function step(kernel: Kernel, interacter: EditorInteracter) {
    const content = interacter.getMainEditorContent();
    const commands = kernel.parse(content);

    if (commands.tag === "Ok") {
        if (commands.value.length > 0) {
            if (commands.value[0]) {
                const firstCommand = findFirstCommand(commands.value, kernel.lastLocation());
                if (firstCommand) {
                    const result = kernel.execute(firstCommand);

                    if (result.tag === "Ok") {

                        console.log(result);
                        if (result.value.proofHistory) {
                            interacter.setGoalEditorContent(formatProofState(result.value.proofHistory.top()));
                        } else {
                            interacter.setGoalEditorContent("No goal. Proven!");
                        }

                        interacter.highlight(firstCommand.loc);

                    } else {
                        // contentSetter("Failed to execute");
                    }
                } else {
                    console.log("No command execute new.");
                }
            }
        }

    } else {
        console.log("Failed to parse");
    }
}

