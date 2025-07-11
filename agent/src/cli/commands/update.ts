import { rename, rm, writeFile } from "node:fs/promises";
import chalk from "chalk";
import packageJson from "../../../package.json";
import { getOsConfig } from "../../config/os";

class LatestPackageJsonUnavailableError extends Error {
	constructor(response: Response) {
		super(
			`Failed to fetch latest package.json: ${response.status} ${response.statusText}`,
		);
		this.name = "LatestPackageJsonUnavailableError";
	}
}

class LatestPackageJsonInvalidError extends Error {
	constructor(contents?: unknown) {
		super(`Latest package.json is invalid: ${JSON.stringify(contents)}`);
		this.name = "LatestPackageJsonInvalidError";
	}
}

class LatestBinaryUnavailableError extends Error {
	constructor(response: Response) {
		super(
			`Failed to fetch latest binary: ${response.status} ${response.statusText}`,
		);
		this.name = "LatestBinaryUnavailableError";
	}
}

export async function updateCommand(): Promise<void> {
	const latestPackageJsonResponse = await fetch(
		"https://raw.githubusercontent.com/tiltcamp/devicemonster/refs/heads/main/agent/package.json",
	);
	if (!latestPackageJsonResponse.ok)
		throw new LatestPackageJsonUnavailableError(latestPackageJsonResponse);

	const latestPackageJson = await latestPackageJsonResponse.json();
	if (
		!latestPackageJson ||
		typeof latestPackageJson !== "object" ||
		!("version" in latestPackageJson) ||
		typeof latestPackageJson.version !== "string"
	)
		throw new LatestPackageJsonInvalidError(latestPackageJson);

	const latestVersion = latestPackageJson.version;
	const currentVersion = packageJson.version;
	if (currentVersion === latestVersion) {
		console.warn(
			chalk.green("You are already using the latest version: ") +
				chalk.bold(currentVersion),
		);
		return;
	}

	console.warn(
		chalk.blue("New version available: ") +
			chalk.bold(`${currentVersion} → ${latestVersion}`),
	);

	await getOsConfig().requireElevatedPrivileges(
		"to update the DeviceMonster agent",
	);
	console.warn(`Downloading new version...`);
	const binaryFetchResponse = await fetch(
		`https://github.com/tiltcamp/devicemonster/releases/download/agent%40v${latestVersion}/devicemonster-agent-${process.platform}-${process.arch}`,
	);
	if (!binaryFetchResponse.ok)
		throw new LatestBinaryUnavailableError(binaryFetchResponse);

	console.warn(chalk.blue("Installing new version..."));
	const binaryContents = await binaryFetchResponse.arrayBuffer();
	const binaryPath = process.execPath;
	await rm(`${binaryPath}.old`, { force: true });
	await rename(binaryPath, `${binaryPath}.old`);
	await writeFile(binaryPath, Buffer.from(binaryContents), { mode: 0o755 });
	console.warn(chalk.blue("Update downloaded; restarting agent..."));
	await getOsConfig().uninstallDaemonService();
	await getOsConfig().installDaemonService();

	console.warn(chalk.green("Update complete!"));
}
