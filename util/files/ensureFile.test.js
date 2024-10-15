import path from 'path';
import fs from 'fs';

describe('ensureFile', () => {
    it('should create a file if it does not exist', async () => {
        const filePath = path.join(__dirname, 'test.txt');
        await ensureFile(filePath);
        expect(fs.existsSync(filePath)).toBe(true)
    });
    it('should not overwrite a file if it exists', async () => {
        const filePath = path.join(__dirname, 'test.txt');
        await ensureFile(filePath);
        const firstModifiedTime = fs.statSync(filePath).mtimeMs;
        await ensureFile(filePath);
        const secondModifiedTime = fs.statSync(filePath).mtimeMs;
        expect(firstModifiedTime).toBe(secondModifiedTime);
    });
    it('should create a file with the correct content', async () => {
        const filePath = path.join(__dirname, 'test.txt');
        await ensureFile(filePath, 'test content');
        const content = fs.readFileSync(filePath).toString();
        expect(content).toBe('test content');
    });
    it('should ensure the file\'s folder exists', async () => {
        const filePath = path.join(__dirname, 'folder', 'test.txt');
        await ensureFile(filePath, '');
        expect(fs.existsSync(path.join(__dirname, 'folder'))).toBe(true);
    });
    it('should throw if file has different headers', async () => {
        const filePath = path.join(__dirname, 'test.txt');
        await ensureFile(filePath, 'test content');
        expect(() => ensureFile(filePath, 'different, content')).toThrow();
    })

});