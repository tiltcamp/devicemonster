import { PrivilegesError } from "./errors";

export async function requireElevatedPrivileges(
	reason = "to run the DeviceMonster agent",
): Promise<void> {
	if (!process.getuid)
		throw new Error(
			"Process does not support getuid, cannot check permissions.",
		);
	if (process.getuid() !== 0) {
		throw new PrivilegesError(
			`Root privileges are required ${reason}. Please run with sudo.`,
		);
	}
}
