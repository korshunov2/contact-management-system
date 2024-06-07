const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/query', async (req, res) => {
    try {
        const { query, contacts } = req.body;
        console.log('Received query:', query);
        console.log('Contacts:', contacts);

        const apiKey = process.env.OPENAI_API_KEY;
        console.log('Using OpenAI API Key:', apiKey);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: `Contacts: ${JSON.stringify(contacts)}\n\nQuestion: ${query}`
                }
            ],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // Set timeout to 30 seconds
        });

        console.log('OpenAI API response:', response.data);

        res.json(response.data);
    } catch (error) {
        console.error('Error processing AI query:', error.message || error);

        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // No response was received
            console.error('Request data:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error message:', error.message);
        }

        res.status(500).json({ error: 'Failed to process AI query' });
    }
});

module.exports = router;