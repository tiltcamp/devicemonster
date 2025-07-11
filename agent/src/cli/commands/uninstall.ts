import { rm } from "node:fs/promises";
import chalk from "chalk";
import { getOsConfig } from "../../config/os";

export async function uninstallCommand(): Promise<void> {
	const osConfig = getOsConfig();
	const currentPath = process.execPath;

	console.warn("Uninstalling the agent service...");
	await osConfig.uninstallDaemonService();

	if (currentPath === (await osConfig.agentExecutablePath())) {
		console.warn(
			"The agent daemon service is uninstalled, but the agent binary " +
				"(which you've called) is unable to remove itself. You can do this " +
				"manually by running:\n" +
				chalk.blue(
					process.platform === "win32"
						? `del ${currentPath}`
						: `rm ${currentPath}`,
				),
		);
	} else {
		console.warn("Removing the agent binary...");
		await rm(await osConfig.agentExecutablePath(), { force: true });
		console.warn(
			chalk.yellow(
				"The agent binary and daemon service have been uninstalled. " +
					"You may now delete this installer by running: " +
					chalk.blue(
						process.platform === "win32"
							? `del ${currentPath}`
							: `rm ${currentPath}`,
					),
			),
		);
	}
}
