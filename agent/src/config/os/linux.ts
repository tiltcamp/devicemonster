import { resolve } from "node:path";
import { BaseOsConfig, UnsupportedOsVersionError } from "./base";
import { installSystemdService, uninstallSystemdService } from "./daemon/linux";
import { requireElevatedPrivileges } from "./privileges/posix";

export class LinuxOsConfig extends BaseOsConfig {
	constructor() {
		super();
		if (this.osVersion.major < 5)
			throw new UnsupportedOsVersionError(
				`Linux kernel version ${this.osVersion.major} is not supported. Please use Linux kernel 5 or later.`,
			);
	}

	public async installationDirectoryPath(): Promise<string> {
		return resolve("/", "usr", "local", "bin");
	}

	public async agentExecutablePath(): Promise<string> {
		return resolve(
			await this.installationDirectoryPath(),
			"devicemonster-agent",
		);
	}

	public async installDaemonService(): Promise<void> {
		await installSystemdService();
	}

	public async uninstallDaemonService(): Promise<void> {
		await uninstallSystemdService();
	}

	public async requireElevatedPrivileges(reason: string): Promise<void> {
		await requireElevatedPrivileges(reason);
	}
}
