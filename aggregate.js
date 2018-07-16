/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const readDataFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, readCSV) => {
    resolve(readCSV);
    if (err) reject(err);
  });
});
const readMapFile = () => new Promise((resolve1, reject1) => {
  const extractMap = new Map();
  fs.readFile('data.txt', 'utf8', (err, readTXT) => {
    const formatReadTXT = readTXT.split('\n');
    for (let i = 0; i < formatReadTXT.length - 1; i += 1) {
      const splitData = formatReadTXT[i].split(',');
      extractMap.set(splitData[0], splitData[1]);
    }
    resolve1(extractMap);
    if (err) reject1(err);
  });
});
const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readDataFile(filePath), readMapFile()]).then((values) => {
    const extractedRows = values[0].replace(/["']+/g, '').split('\n');
    const headers = extractedRows[0].split(',');
    const arrayOfObjects = [];
    let obj;
    for (let i = 1; i < extractedRows.length - 2; i += 1) {
      obj = {};
      const splitExtractedRows = extractedRows[i].split(',');
      for (let j = 0; j < headers.length; j += 1) {
        if (j === 0) obj[headers[j]] = splitExtractedRows[j];
        else obj[headers[j]] = parseFloat(splitExtractedRows[j]);
      }
      obj.Continent = values[1].get(splitExtractedRows[0]);
      arrayOfObjects.push(obj);
    }
    const creatingResultObject = {};
    arrayOfObjects.forEach((object) => {
      try {
        creatingResultObject[object.Continent].GDP_2012 += object['GDP Billions (US Dollar) - 2012'];
        creatingResultObject[object.Continent].POPULATION_2012 += object['Population (Millions) - 2012'];
      } catch (e) {
        creatingResultObject[object.Continent] = {
          GDP_2012: object['GDP Billions (US Dollar) - 2012'],
          POPULATION_2012: object['Population (Millions) - 2012'],
        };
      }
    });
    const outputfile = 'output/output.json';
    fs.writeFile(outputfile, JSON.stringify(creatingResultObject), () => resolve());
  }, err => reject(err));
});
module.exports = aggregate;
