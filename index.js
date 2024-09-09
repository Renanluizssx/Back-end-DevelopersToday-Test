const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Welcome to the Country Information API!');
});

app.get('/countries', async (req, res) => {
  try {
    const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching countries' });
  }
});

app.get('/country/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    const countryData = response.data[0];

    res.json({
      commonName: countryData.name?.common || 'Common name not available',
      officialName: countryData.name?.official || 'Official name not available',
      countryCode: countryData.cca2 || 'Code not available',
      region: countryData.region || 'Region not available',
      borders: countryData.borders || [],
      population: countryData.population ? [{
        year: new Date().getFullYear(), 
        value: countryData.population
      }] : 'Population data not available',
      flag: countryData.flags?.svg || 'URL_EXAMPLE_NO_FLAG'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching country information' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

