/**
 * @fileOverview The intent is to run the aggregate.js
 * and test the aggregated value at output/output.json
 * @author Nishant Jain
 */
const fs = require('fs');
const path = require('path');
const should = require('should');

const aggregate = require('../aggregate');

describe('Aggregate GDP & Population', () => {
  it('Should be able to aggregate GDP & Population', async () => {
    const filePath = path.join(process.cwd(), 'data/datafile.csv');
    await aggregate(filePath);
    const absActualOutputPath = path.join(process.cwd(), 'output/output.json');
    const absExpectedOutputPath = path.join(process.cwd(), 'test/expected-output.json');
    const expectedOutput = JSON.parse(fs.readFileSync(absExpectedOutputPath));
    should(fs.existsSync(absActualOutputPath)).be.exactly(true, 'Expected the file output/output.json to be present');
    const actualOutput = JSON.parse(fs.readFileSync(absActualOutputPath, 'utf8'));
    console.log(expectedOutput);
    console.log(actualOutput);
    should.exist(actualOutput, 'Actual output cannot be null');
    actualOutput.should.be.an.instanceOf(Object, 'Expected output to be of type object');
    // Actual Output should not be empty
    // TODO: Have to find a way to give descriptive messages
    // for objects which are empty
    actualOutput.should.not.be.empty('Expected output cannot be empty');
    actualOutput.should.eql(expectedOutput, 'The actual output doesn\'t matches with the expected output');
  });
});
