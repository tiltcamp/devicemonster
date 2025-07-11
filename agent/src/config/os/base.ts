import { release } from "node:os";

export class InvalidOsVersionError extends Error {
	constructor(message: string, opts?: ErrorOptions) {
		super(message, opts);
		this.name = "InvalidOsVersionError";
	}
}

export class UnsupportedOsVersionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnsupportedOsVersionError";
	}
}

export abstract class BaseOsConfig {
	protected osVersion: {
		major: number;
		minor: number;
		patch: number;
	};

	constructor() {
		const osVersion = release()
			.match(/^(\d+)\.(\d+)\.(\d+)/)
			?.slice(1)
			.map(Number);
		if (!osVersion || osVersion.length < 2)
			throw new InvalidOsVersionError(
				`Could not parse OS version: ${release()}`,
				{ cause: osVersion },
			);

		const [major, minor, patch] = osVersion;
		if (major === undefined || minor === undefined || patch === undefined) {
			throw new InvalidOsVersionError(`Incomplete OS version: ${release()}`, {
				cause: osVersion,
			});
		}
		this.osVersion = { major, minor, patch };
	}

	/**
	 * Returns the installation directory path for the agent.
	 *
	 * @returns {Promise<string>} A promise that resolves to the installation directory path.
	 */
	public abstract installationDirectoryPath(): Promise<string>;

	/**
	 * Returns the path to the installed agent executable.
	 *
	 * @returns {Promise<string>} A promise that resolves to the path of the agent executable.
	 */
	public abstract agentExecutablePath(): Promise<string>;

	/**
	 * Installs and enables the service to run the agent at startup.
	 */
	public abstract installDaemonService(): Promise<void>;

	/**
	 * Uninstalls and disables the service that runs the agent at startup.
	 */
	public abstract uninstallDaemonService(): Promise<void>;

	/**
	 * Raise an error if not running with elevated privileges.
	 *
	 * @param reason - The reason why elevated privileges are required.
	 * @throws {PrivilegesError} If the user does not have sufficient privileges.
	 */
	public abstract requireElevatedPrivileges(reason: string): Promise<void>;
}
