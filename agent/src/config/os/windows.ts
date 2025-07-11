import { resolve } from "node:path";
import { BaseOsConfig, UnsupportedOsVersionError } from "./base";
import {
	installWindowsService,
	uninstallWindowsService,
} from "./daemon/windows";
import { requireElevatedPrivileges } from "./privileges/windows";

export class WindowsOsConfig extends BaseOsConfig {
	constructor() {
		super();
		if (this.osVersion.major < 10)
			throw new UnsupportedOsVersionError(
				`Windows ${this.osVersion.major} is not supported. Please use Windows 10 or later.`,
			);
	}

	public async installationDirectoryPath(): Promise<string> {
		if (!process.env.ProgramFiles)
			throw new Error("ProgramFiles environment variable is not set.");

		return resolve(process.env.ProgramFiles, "DeviceMonster");
	}

	public async agentExecutablePath(): Promise<string> {
		return resolve(
			await this.installationDirectoryPath(),
			"devicemonster-agent.exe",
		);
	}

	public async installDaemonService(): Promise<void> {
		await installWindowsService();
	}

	public async uninstallDaemonService(): Promise<void> {
		await uninstallWindowsService();
	}

	public async requireElevatedPrivileges(reason: string): Promise<void> {
		await requireElevatedPrivileges(reason);
	}
}
