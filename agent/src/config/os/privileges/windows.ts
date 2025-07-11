import { execa } from "execa";
import { PrivilegesError } from "./errors";

export async function requireElevatedPrivileges(
	reason = "to run the DeviceMonster agent",
): Promise<void> {
	const proc = await execa({ reject: false })`net session`;
	if (proc.exitCode !== 0)
		throw new PrivilegesError(
			`Administrator privileges are required ${reason}. Please run as Administrator.`,
		);
}
