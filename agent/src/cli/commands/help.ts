import chalk from "chalk";

const docs: Record<string, string> = {
	help: `
Usage: devicemonster-agent <command>

Commands:
  install    Install the agent
  uninstall  Uninstall the agent
  help       Show this help message

Run 'devicemonster-agent <command> --help' for more information on a specific command.
`,
	install: `
Usage: devicemonster-agent install

Installs the DeviceMonster agent.

This command relocates the agent binary to the appropriate installation directory and
installs the service. Requires elevated privileges.
`,
	uninstall: `
Usage: devicemonster-agent uninstall

Uninstalls the DeviceMonster agent.

This command removes the agent binary and uninstalls the service. Requires elevated privileges.
`,
};

export function helpCommand(command = "help"): void {
	if (!docs[command]) {
		console.error(chalk.red(`Unknown command: ${command}`));
		console.error(
			"Run 'devicemonster-agent help' for a list of available commands.",
		);
		process.exit(1);
	}

	console.warn(docs[command]);
	process.exit(0);
}
