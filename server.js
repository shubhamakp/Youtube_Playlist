const express = require('express');
const server = express();
const path = require('path')
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const playlist = require('./db');
require('dotenv').config();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.static(__dirname + '/views/'));
server.use(cors())

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
});


server.post('/search', (req, res) => {
    let query = req.body.string;
    console.log(query)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&&maxResults=20&q=${query}&type=video`;

    fetch(`${url}&key=${process.env.GOOGLE_API_KEY}`)
        .then(response => response.json())
        .then(json => {
            var obj = [];
            obj = JSON.parse(JSON.stringify(json));
            res.render('search.ejs', { obj });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        })
});

server.post('/remplaylist', (req, res) => {
    let id = req.body.id;
    console.log(id)
    playlist.destroy({
        where: { id: id }
    }).then((list) => {
        res.sendStatus(201)
    }).catch((err) => {
        res.sendStatus(501)
    })
})

server.post('/playlist', (req, res) => {
    let desc = req.body.desc;
    let title = req.body.title;
    let imageurl = req.body.imageurl;
    let vidid = req.body.vidid;
    console.log(desc);
    console.log(title);
    console.log(imageurl);
    console.log(vidid);


    playlist.create({
        vidid : vidid,
        desc: desc,
        title: title,
        imageurl: imageurl,
    }).then((list) => {
        res.status(201).send(list)
    }).catch((err) => {
        res.status(501).send({
            error: "error adding products"
        })
    })
})

server.get('/playlist', (req, res) => {
    playlist.findAll({ raw: true })
        .then((list) => {
            res.status(200).render('playlist.ejs', { list })
        })
        .catch((err) => {
            res.status(500).send({
                error: "could not retrieve products"
            })
        })
})


server.listen(3000)