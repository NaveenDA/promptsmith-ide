import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	scryptSync,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM recommended

function getKey() {
	const key = process.env.ENCRYPTION_KEY;
	if (!key) throw new Error("ENCRYPTION_KEY env variable not set");
	// Derive a 32-byte key
	return scryptSync(key, "salt", 32);
}

export function encrypt(text: string): string {
	const iv = randomBytes(IV_LENGTH);
	const key = getKey();
	const cipher = createCipheriv(ALGORITHM, key, iv);
	const encrypted = Buffer.concat([
		cipher.update(text, "utf8"),
		cipher.final(),
	]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encrypted: string): string {
	const data = Buffer.from(encrypted, "base64");
	const iv = data.slice(0, IV_LENGTH);
	const tag = data.slice(IV_LENGTH, IV_LENGTH + 16);
	const text = data.slice(IV_LENGTH + 16);
	const key = getKey();
	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(tag);
	return Buffer.concat([decipher.update(text), decipher.final()]).toString(
		"utf8",
	);
}
