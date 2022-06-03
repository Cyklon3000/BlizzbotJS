import { appendFileSync } from "fs";

export function ensureFile(filePath) {
    try {
        appendFileSync(filePath, "");
    } catch (e) {
        if (e.code !== "ENOENT") {
            throw e;
        }
    }
}