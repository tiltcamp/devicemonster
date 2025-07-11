export class PrivilegesError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PermissionError";
	}
}
