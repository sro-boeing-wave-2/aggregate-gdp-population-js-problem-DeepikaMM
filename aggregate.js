/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const readDataFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, readCSV) => {
    const mapData = new Map();
    const formatReadCSV = readCSV.split('\n');
    for (let i = 1; i < formatReadCSV.length - 1; i += 1) {
      const data = formatReadCSV[i].split(',');
      mapData.set(data[0].split('"')[1], [data[4].split('"')[1], data[7].split('"')[1]]);
    }
    resolve(mapData);
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
    const continentMapper = new Map();
    values[1].forEach((value, key) => {
      const countryInfo = values[0].get(key);
      continentMapper.set(key, [countryInfo[0], countryInfo[1], value]);
    });
    const populationMap = new Map();
    const gdp = new Map();
    continentMapper.forEach((value) => {
      if (populationMap.has(value[2])) {
        populationMap.set(value[2], parseFloat(populationMap.get(value[2])) + parseFloat(value[0]));
      } else {
        populationMap.set(value[2], value[0]);
      }
      if (gdp.has(value[2])) {
        gdp.set(value[2], (parseFloat(gdp.get(value[2])) + parseFloat(value[1])));
      } else {
        gdp.set(value[2], value[1]);
      }
    });
    const outputfile = 'output/output.json';
    const aggregatedData = {};
    gdp.forEach((value, key) => {
      aggregatedData[key] = {
        GDP_2012: parseFloat(value),
        POPULATION_2012: parseFloat(populationMap.get(key)),
      };
    });
    fs.writeFile(outputfile, JSON.stringify(aggregatedData), () => resolve());
  }, err => reject(err));
});
module.exports = aggregate;
