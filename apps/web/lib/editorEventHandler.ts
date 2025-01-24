import { Kernel } from "@repo/kernel/kernel";
import { CmdWithLoc, isAfter, Location, Range } from "@repo/kernel/parser";
import { formatProofState } from "./format";



function findFirstCommand(commands: CmdWithLoc[], loc: Location): CmdWithLoc | undefined {
    for (const command of commands) {
        if (isAfter(command.loc.start, loc)) {
            return command;
        }
    }

    return undefined;
}


export function step(kernel: Kernel, contentGetter: () => string, contentSetter: (content: string) => void, highlighter: (range: Range) => void) {
    const content = contentGetter();
    const commands = kernel.parse(content);

    if (commands.tag === "Ok") {
        if (commands.value.length > 0) {
            if (commands.value[0]) {
                const firstCommand = findFirstCommand(commands.value, kernel.lastLocation());
                if (firstCommand) {
                    const result = kernel.execute(firstCommand);

                    if (result.tag === "Ok") {
                        if (result.value.proofHistory) {
                            contentSetter(
                                `Current command: ${firstCommand.cmd.tag}, Goals: ${formatProofState(result.value.proofHistory.top())}`
                            )
                        } else {
                            contentSetter("No goals to display");
                        }

                    } else {
                        // contentSetter("Failed to execute");
                    }
                } else {
                    contentSetter("Tail of commands");
                }
            }
        }

    } else {
        contentSetter("Failed to parse");
    }
}

