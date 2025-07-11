import { writeFile } from "node:fs/promises";
import { execa } from "execa";
import { requireElevatedPrivileges } from "../privileges/posix";

/**
 *  Installs a LaunchAgent on macOS to run the DeviceMonster Agent at startup.
 *
 * @param serviceName The name of the LaunchAgent service. Defaults to "monster.device.agent".
 */
export async function installLaunchAgent(
	serviceName = "monster.device.agent",
): Promise<void> {
	await requireElevatedPrivileges(
		"to install the LaunchAgent for the DeviceMonster agent",
	);

	const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${serviceName}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${process.execPath}</string>
        <string>daemon</string>
    </array>
    <key>ProcessType</key>
    <string>Background</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <dict>
      <key>SuccessfulExit</key>
      <false/>
      </dict>
  </dict>
</plist>
`;

	const plistPath = `/Library/LaunchAgents/${serviceName}.plist`;
	await writeFile(plistPath, plistContent, { mode: 0o644 });
	await execa`launchctl load -w ${plistPath}`;
}

/**
 * Uninstalls the LaunchAgent on macOS.
 */
export async function uninstallLaunchAgent(
	serviceName = "monster.device.agent",
): Promise<void> {
	await requireElevatedPrivileges(
		"to uninstall the LaunchAgent for the DeviceMonster agent",
	);

	const plistPath = `/Library/LaunchAgents/${serviceName}.plist`;
	await execa`launchctl unload -w ${plistPath}`;
	await execa`rm -f ${plistPath}`;
}
