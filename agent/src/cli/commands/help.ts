import chalk from "chalk";
import packageJson from "../../../package.json";

const docs: Record<string, string> = {
	help: `
DeviceMonster Agent v${packageJson.version}

Usage: devicemonster-agent <command>

Commands:
  install    Install the agent
  uninstall  Uninstall the agent
  update     Update the agent
  version    Show the agent version
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
	update: `
Usage: devicemonster-agent update

Updates the DeviceMonster agent to the latest version.

This command checks for updates and applies them if available. If an update is available, elevated
privileges are required to actually perform the update.
`,
	version: `
Usage: devicemonster-agent version

Displays the current version of the DeviceMonster agent.
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
