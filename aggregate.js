/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const aggregate = (filePath) => {
  const mapData = new Map();
  const readCSV = fs.readFileSync(filePath, 'utf8');
  const formatReadCSV = readCSV.split('\r\n');
  for (let i = 1; i < formatReadCSV.length - 1; i += 1) {
    const data = formatReadCSV[i].split(',');
    mapData.set(data[0].split('"')[1], [data[4].split('"')[1], data[7].split('"')[1]]);
  }
  const extractMap = new Map();
  const readTXT = fs.readFileSync('data.txt', 'utf8');
  console.log(readTXT);
  console.log('Listing Files', fs.readdirSync(__dirname));
  const formatReadTXT = readTXT.split('\r\n');
  for (let i = 0; i < formatReadTXT.length - 1; i += 1) {
    const splitData = formatReadTXT[i].split(',');
    extractMap.set(splitData[0], splitData[1]);
  }
  const continentMapper = new Map();
  extractMap.forEach((value, key) => {
    const countryInfo = mapData.get(key);
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
  const jasonFormatString = {};
  gdp.forEach((value, key) => {
    jasonFormatString[key] = {
      GDP_2012: parseFloat(value),
      POPULATION_2012: parseFloat(populationMap.get(key)),
    };
  });
  console.log('Writing JSON Data');
  console.log(jasonFormatString);
  fs.writeFileSync(outputfile, JSON.stringify(jasonFormatString, 2, 2));
};

module.exports = aggregate;
