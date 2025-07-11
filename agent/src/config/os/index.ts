import type { BaseOsConfig } from "./base";
import { LinuxOsConfig } from "./linux";
import { MacOsConfig } from "./mac";
import { WindowsOsConfig } from "./windows";

export class UnsupportedOsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnsupportedOsError";
	}
}

let instance: BaseOsConfig | null = null;

/**
 * Returns the appropriate OS configuration based on the current platform.
 *
 * @returns {BaseOsConfig} An instance of the OS configuration class for the current platform.
 */
export function getOsConfig(): BaseOsConfig {
	if (instance) return instance;

	if (process.platform === "darwin") instance = new MacOsConfig();
	else if (process.platform === "linux") instance = new LinuxOsConfig();
	else if (process.platform === "win32") instance = new WindowsOsConfig();
	else
		throw new UnsupportedOsError(
			`Your operating system (${process.platform}) is not supported by DeviceMonster. ` +
				"This build only supports Linux, macOS, and Windows.",
		);

	return instance;
}
