import { writeFile } from "node:fs/promises";
import { execa } from "execa";
import { requireElevatedPrivileges } from "../privileges/posix";

export async function installSystemdService(): Promise<void> {
	await requireElevatedPrivileges(
		"to install the systemd service for the DeviceMonster agent",
	);

	const serviceName = "devicemonster-agent";
	const serviceFile = `/etc/systemd/system/${serviceName}.service`;

	const user = process.env.SUDO_USER || process.env.USER || "nobody";

	const serviceContent = `
[Unit]
Description=DeviceMonster Agent
After=network.target

[Service]
Type=simple
ExecStart=${process.execPath} --autostarted
Restart=on-failure
User=${user}

[Install]
WantedBy=multi-user.target
`;

	await writeFile(serviceFile, serviceContent, { mode: 0o644 });
	await execa`systemctl daemon-reload`;
	await execa`systemctl enable ${serviceName}`;
	await execa`systemctl start ${serviceName}`;
}

export async function uninstallSystemdService(): Promise<void> {
	await requireElevatedPrivileges(
		"to uninstall the systemd service for the DeviceMonster agent",
	);

	const serviceName = "devicemonster-agent";
	await execa`systemctl stop ${serviceName}`;
	await execa`systemctl disable ${serviceName}`;
	await execa`rm -f /etc/systemd/system/${serviceName}.service`;
	await execa`systemctl daemon-reload`;
}
