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
    const [countryInfo, populationData] = await Promise.all([
      axios.get(`https://date.nager.at/api/v3/CountryInfo/${code}`),
      axios.get(`https://countriesnow.space/api/v0.1/countries/population`)
    ]);

    const countryData = countryInfo.data || {};
    const countryFlag = countryData.flagUrl || "URL_EXAMPLE_NO_FLAG";
    
    const population = populationData.data.data
      .find(c => c.country === countryData.commonName)?.populationCounts || [];

    res.json({
      commonName: countryData.commonName || 'Common name not available',
      officialName: countryData.officialName || 'Official name not available',
      countryCode: countryData.countryCode || 'Code not available',
      region: countryData.region || 'Region not available',
      borders: countryData.borders || [],
      population,
      flag: countryFlag
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching country information' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
