import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export default class AutoIncrementer {
    constructor(incrementerName, initialValue = 0) {
        if (typeof incrementerName !== 'string') throw new Error('incrementerName must be a string');
        this.incrementerName = incrementerName;
        if (!existsSync(`${__dirname}/incrementers`))
            mkdirSync(`${__dirname}/incrementers`);
        if (!existsSync(`${__dirname}/incrementers/${incrementerName}.txt`))
            writeFileSync(`${__dirname}/incrementers/${incrementerName}.txt`, initialValue.toString());
        this.currentValue = parseInt(readFileSync(`${__dirname}/incrementers/${incrementerName}.txt`).toString());
        this.increment = this.increment.bind(this);
    }

    increment() {
        this.currentValue = parseInt(readFileSync(`${__dirname}/incrementers/${this.incrementerName}.txt`).toString());
        this.currentValue++;
        writeFileSync(`${__dirname}/incrementers/${this.incrementerName}.txt`, this.currentValue.toString());
        return this.currentValue;
    }
}