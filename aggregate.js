/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const readDataFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, resultFile) => {
    resolve(resultFile);
    if (err) reject(err);
  });
});
const aggregate = filePath => new Promise((resolve) => {
  Promise.all([readDataFile(filePath), readDataFile('./country-continent-map.json')]).then((values) => {
    const headers = values[0].replace(/["']+/g, '').split('\n')[0];
    const headersIndex = headers.split(',');
    const countryIndex = headersIndex.indexOf('Country Name');
    const gdpIndex = headersIndex.indexOf('GDP Billions (US Dollar) - 2012');
    const populationIndex = headersIndex.indexOf('Population (Millions) - 2012');
    const completeDataSplit = (values[0].split('\n'));
    const jsonFormat = JSON.parse(values[1]);
    const finalResultObject = {};
    completeDataSplit.forEach((element) => {
      const splitEle = element.replace(/["']+/g, '').split(',');
      const continentName = jsonFormat[splitEle[countryIndex]];
      try {
        if (continentName !== undefined) {
          finalResultObject[continentName].GDP_2012 += parseFloat(splitEle[gdpIndex]);
          finalResultObject[continentName].POPULATION_2012 += parseFloat(splitEle[populationIndex]);
        }
      } catch (e) {
        if (continentName !== undefined) {
          finalResultObject[continentName] = {
            GDP_2012: parseFloat(splitEle[gdpIndex]),
            POPULATION_2012: parseFloat(splitEle[populationIndex]),
          };
        }
      }
    });
    const outputfile = 'output/output.json';
    fs.writeFile(outputfile, JSON.stringify(finalResultObject), () => resolve());
  });
});
module.exports = aggregate;
