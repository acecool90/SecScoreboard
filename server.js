const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path')
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/games', async (req, res) => {
    try {
      const { team, week } = req.query;
      const response = await axios.get(`https://api.collegefootballdata.com/games?year=2023&team=${team}&week=${week}`, {
        headers: {
          Authorization: `Bearer zoo75HscMPg+YrPMcybxkeWBUOcqx43WPfxMcKd510qhsT4b6Z/KspFZif9sd8Om`
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
  });
  
  const PORT = 3008;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });