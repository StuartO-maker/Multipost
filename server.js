require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { BskyAgent } = require('@atproto/api');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/post/bluesky', async (req, res) => {
    try {
        const { identifier, password, content } = req.body;
        
        const agent = new BskyAgent({
            service: 'https://bsky.social'
        });

        await agent.login({
            identifier: identifier,
            password: atob(password)
        });

        await agent.post({
            text: content
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Bluesky posting error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to post to Bluesky'
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});