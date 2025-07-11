import { execa } from "execa";
import { requireElevatedPrivileges } from "../privileges/windows";

export async function installWindowsService(): Promise<void> {
	await requireElevatedPrivileges(
		"to install the Windows service for the DeviceMonster agent",
	);

	const serviceName = "DeviceMonsterAgent";
	const args = "--autostarted";
	const regPath = "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
	const command = `Set-ItemProperty -Path '${regPath}' -Name '${serviceName}' -Value '"${process.execPath}" ${args}'`;

	await execa("powershell", ["-Command", command], { shell: true });
}

export async function uninstallWindowsService(): Promise<void> {
	await requireElevatedPrivileges(
		"to uninstall the Windows service for the DeviceMonster agent",
	);

	const serviceName = "DeviceMonsterAgent";
	const regPath = "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
	const command = `Remove-ItemProperty -Path '${regPath}' -Name '${serviceName}'`;

	await execa("powershell", ["-Command", command], { shell: true });
}
