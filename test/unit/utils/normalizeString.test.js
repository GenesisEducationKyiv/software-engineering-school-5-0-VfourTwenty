const { expect } = require('chai');
const { normalizeString } = require('../../../src/utils/strings'); // Adjust path as needed

describe('normalizeString', () => 
{
    it('should trim spaces and lowercase', () => 
    {
        expect(normalizeString('  Kyiv  ')).to.equal('kyiv');
    });

    it('should replace spaces with underscores', () => 
    {
        expect(normalizeString('New York')).to.equal('new_york');
    });

    it('should remove special characters', () => 
    {
        expect(normalizeString('São Paulo!')).to.equal('sao_paulo');
        expect(normalizeString('Odesa-Mykolaiv')).to.equal('odesamykolaiv');
        expect(normalizeString('Paris#1')).to.equal('paris1');
    });

    it('should handle multiple spaces', () => 
    {
        expect(normalizeString('Los   Angeles')).to.equal('los_angeles');
    });

    it('should handle tabs and newlines', () => 
    {
        expect(normalizeString('\tLondon\n')).to.equal('london');
        expect(normalizeString('San\nFrancisco')).to.equal('san_francisco');
    });

    it('should handle only special characters', () => 
    {
        expect(normalizeString('!@#$')).to.equal('');
    });

    it('should handle empty string', () => 
    {
        expect(normalizeString('')).to.equal('');
    });

    it('should handle numbers in strings', () => 
    {
        expect(normalizeString('District 9')).to.equal('district_9');
    });
});
