import { existsSync, mkdirSync, writeFileSync } from 'fs';

export default function ensureFileExists(path, headers) {
    if (!existsSync(path)) {
        const folder = path.split('/').slice(0, -1).join('/');
        if (!existsSync(folder)) {
            mkdirSync(folder, { recursive: true });
        }
        writeFileSync(path, headers);
    }
    return true;
}