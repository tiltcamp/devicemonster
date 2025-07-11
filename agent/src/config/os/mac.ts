import { resolve } from "node:path";
import { BaseOsConfig, UnsupportedOsVersionError } from "./base";
import { installLaunchAgent, uninstallLaunchAgent } from "./daemon/mac";
import { requireElevatedPrivileges } from "./privileges/posix";

export class MacOsConfig extends BaseOsConfig {
	constructor() {
		super();
		if (this.osVersion.major <= 20)
			throw new UnsupportedOsVersionError(
				`macOS ${this.osVersion.major} is not supported. Please use macOS 21 or later.`,
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
		await installLaunchAgent();
	}

	public async uninstallDaemonService(): Promise<void> {
		await uninstallLaunchAgent();
	}

	public async requireElevatedPrivileges(reason: string): Promise<void> {
		await requireElevatedPrivileges(reason);
	}
}
