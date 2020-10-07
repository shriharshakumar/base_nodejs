const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsById = {}

app.get('/posts/:id/comments', (req, res) => {
    const comments = commentsById[req.params.id] || [];
    res.send(200, comments);
})

app.post('/posts/:id/comments', async (req, res) => {

    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;

    const comments = commentsById[req.params.id] || [];

    comments.push({ id: commentId, content });

    commentsById[req.params.id] = comments;

    await axios('http://localhost:4005/events', {
        type: "CommentCreated",
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    res.send(201, commentsById[req.params.id] || []);

});

app.post('/events', (req, res) => {
    console.log('Event received', req.body);
    res.send(200, 'OK');
})

app.listen(4001, () => {
    console.log("Comments service listening on 4001 ");
});
