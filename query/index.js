const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    if (type === 'PostCreated') {
        posts[data.id] = {
            id: data.id,
            title: data.title,
            comments: []
        }
    }
    if (type === 'CommentCreated') {
        const post = posts[data.postId]
        post.comments.push({
            id: data.id,
            content: data.content
        });
    }
    console.log(posts);
    res.send({});
});



app.listen('4002', () => {
    console.log("Listening on 4002")
});