import { existsSync } from "node:fs";
import { parseArgs } from "node:util";
import { isExecutablePathCorrect } from "../config/install";
import { getOsConfig } from "../config/os";
import { helpCommand } from "./commands/help";
import { installCommand } from "./commands/install";
import { uninstallCommand } from "./commands/uninstall";

export async function cli(): Promise<void> {
	const command = parseArgs({
		args: Bun.argv,
		strict: false,
		allowPositionals: true,
	}).positionals[2];

	if (
		!command ||
		command === "help" ||
		Bun.argv.includes("--help") ||
		Bun.argv.includes("-h")
	) {
		helpCommand(command);
		process.exit(0);
	}

	if (command === "install") {
		await installCommand();
		process.exit(0);
	}

	if (
		command === "uninstall" &&
		existsSync(await getOsConfig().agentExecutablePath())
	) {
		await uninstallCommand();
		process.exit(0);
	}

	if (!(await isExecutablePathCorrect())) {
		console.error(
			"Agent is not installed. Please run the install command first.",
		);
		process.exit(1);
	}

	helpCommand(command);
	process.exit(1);
}
