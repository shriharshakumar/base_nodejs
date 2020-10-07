const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/posts', async (req, res) => {
    let id = randomBytes(4).toString('hex');
    let title = req.body;
    posts[id] = {
        id, title
    }

    await axios.post('http://localhost:4005/events', {
        type: "PostCreated",
        data: {
            id, title
        }
    })

    res.send(201, posts[id]);
})

app.post('/events', (req, res) => {
    console.log('Event received', req.body);
    res.send(200, 'OK');
})

app.listen(4000, () => {
    console.log('Listening on 4000');
})