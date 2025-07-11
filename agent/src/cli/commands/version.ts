import packageJson from "../../../package.json";

export function versionCommand(): void {
	console.log(`${packageJson.version}`);
}
