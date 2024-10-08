import AutoIncrement from './autoincrement';
import { existsSync, unlinkSync } from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url))
beforeEach(() => {
    if (existsSync(`${__dirname}/incrementers/test.txt`)) {
        unlinkSync(`${__dirname}/incrementers/test.txt`);
    }
})

describe('autoIncrement class', () => {
    it('should return an object with an autoincrement method', () => {
        expect.assertions(1);
        const autoIncrement = new AutoIncrement('test');
        expect(autoIncrement).toHaveProperty('increment');
    });
    it('should throw an error if the incrementerName is not a string', () => {
        expect.assertions(2);
        expect(() => new AutoIncrement(123)).toThrow('incrementerName must be a string');
        expect(() => new AutoIncrement()).toThrow('incrementerName must be a string');
    });
    it('should increment the value', () => {
        expect.assertions(1);
        const autoIncrement = new AutoIncrement('test');
        expect(autoIncrement.increment()).toBe(1);
    });

    it('should not conflict if same filename is used twice', () => {
        expect.assertions(6);
        const autoIncrement1 = new AutoIncrement('test');
        const autoIncrement2 = new AutoIncrement('test');
        expect(autoIncrement1.increment()).toBe(1);
        expect(autoIncrement2.increment()).toBe(2);
        expect(autoIncrement1.increment()).toBe(3);
        expect(autoIncrement2.increment()).toBe(4);
        expect(autoIncrement1.increment()).toBe(5);
        expect(autoIncrement2.increment()).toBe(6);
    });
});