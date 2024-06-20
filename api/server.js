const express = require('express');
const cors = require('cors');

const app = express();

const API_URL = 'https://www.ic.gc.ca/app/scr/cc/CorporationsCanada/api/corporations/';
const DIRECTORS_API_URL = 'https://apigateway-passerelledapi.ised-isde.canada.ca/corporations/api/v2/corporations/';
const USER_KEY = '2ee9da16b9c71e00f37c2f74f8ffb4f8';

app.use(cors());
app.use(express.json());

app.get('/api/corporation/:id', async (req, res) => {
    const corporationId = req.params.id;
    const lang = req.query.lang || 'eng';
    const url = `${API_URL}${corporationId}.json?lang=${lang}`;

    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/directors/:id', async (req, res) => {
    const corporationId = req.params.id;
    const url = `${DIRECTORS_API_URL}${corporationId}/directors`;

    try {
        const response = await fetch(url, {
            headers: {
                'user-key': USER_KEY
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok on Directors');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
