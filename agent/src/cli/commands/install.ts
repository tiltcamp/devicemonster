import { cp } from "node:fs/promises";
import chalk from "chalk";
import { getOsConfig } from "../../config/os";

export async function installCommand(): Promise<void> {
	const osConfig = getOsConfig();
	const currentPath = process.execPath;
	const moveExecutable = currentPath !== (await osConfig.agentExecutablePath());

	if (moveExecutable) {
		console.warn("Moving agent binary to the correct location...");
		await osConfig.requireElevatedPrivileges(
			"to relocate the DeviceMonster agent binary",
		);

		const newPath = await osConfig.agentExecutablePath();
		await cp(currentPath, newPath);
	}

	console.warn("Installing the agent service...");
	await osConfig.installDaemonService();
	if (moveExecutable) {
		console.warn(
			chalk.yellow(
				`The agent binary has been relocated to ${await osConfig.agentExecutablePath()} and ` +
					"and the daemon service has been installed. You may now delete this installer by running: " +
					chalk.blue(
						process.platform === "win32"
							? `del ${currentPath}`
							: `rm ${currentPath}`,
					),
			),
		);
	}
}
