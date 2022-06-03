import { existsSync, mkdirSync } from "fs";

export function ensureDirectory(directory) {
    if (!existsSync(directory)) {
        mkdirSync(directory);
    }
}