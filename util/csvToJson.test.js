import parseCsv from './csvToJson.js';

const csv = `Nom,Prénom,Email
Alice,Bob,alice.bob@domain
Charlie,Delta,charlie.delta@domain`;

describe('parseCsv function', () => {
    it('should return an array of objects', () => {

        expect.assertions(1);

        const expected = [
            { Nom: 'Alice', Prénom: 'Bob', Email: 'alice.bob@domain' },
            { Nom: 'Charlie', Prénom: 'Delta', Email: 'charlie.delta@domain' }
        ];
        expect(parseCsv(csv)).toStrictEqual(expected);
    });

    it('should throw an error if given anything but a string', () => {
        expect.assertions(1);
        expect(() => parseCsv(123)).toThrow('csv must be a string');
    });

})