const express = require('express');
const server = express();
const path = require('path')
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const Sequelize = require('sequelize')
const session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const playlist = require('./db').playlist;
const bcrypt = require('bcryptjs')
const user = require('./db').user;
require('dotenv').config();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.static(__dirname + '/views/'));
server.use(cors())

var sequelize = new Sequelize(
    "practice",
    "root",
    "mypass", {
        dialect: "mysql",
        storage: "./session.mysql"
    });

var myStore = new SequelizeStore({
    db: sequelize,
});
server.use(
    session({
        secret: "keyboard cat",
        store: myStore,
        resave: false,
        proxy: true,
        saveUninitialized: false
    })
);

myStore.sync();

const redirecthome = (req,res,next) =>{
    if(!req.session.isLoggedIn){
        res.redirect('/login');
    }else{
        next();
    }
}

server.use((req, res, next) => {
    console.log(req);
    console.log(req.session.isLoggedIn);
    console.log(req.session.kid, "hi");
    user.findByPk(req.session.kid)
        .then(user => {
            // console.log(user, "hello");
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

user.hasMany(playlist);
playlist.belongsToMany(user, { through: 'usplay' });



server.get('/', redirecthome, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
});


server.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'))
})

server.post('/signup', (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    const name = req.body.name;
    console.log("hello")
    user.findAll({ where: { email: email } })
        .then(userdoc => {
            let len = userdoc.length;
            if (len > 0)
                return res.redirect('/signup');
            return bcrypt.hash(pass, 10)
                .then(hashedpass => {
                    user.create({
                        Name: name,
                        email: email,
                        password: hashedpass
                    });
            })
            .then(result =>{
                res.redirect('/login');
            })
        })
        .catch(err => console.log(err))

})
server.post('/logout',(req,res)=>{
    req.session.destroy(err =>{
        console.log(err);
        res.redirect('/login');
    })
})

server.get('/login', (req, res) => {

    // console.log(req.user.id);
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

server.post('/login', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    user.findOne({ where: { name: name, email: email } })
        .then(user => {
            if (!user)
                res.redirect('/login');

            req.session.kid = user.id;
            console.log(user.id);
            req.session.isLoggedIn = true;
            console.log(req.session);
            console.log(req.session.kid);
            console.log("hi");
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })

    // user.findByPk(1)
    // .then(user =>{
    //     req.session.kid=user.id;
    //     console.log(user.id);
    //     req.session.isLoggedIn = true;
    //     console.log(req.session);
    //     console.log(req.session.kid);
    //     console.log("hi");
    //     res.redirect('/');
    // }).catch(err=>{
    //     console.log(err);
    // })
})
server.post('/search', redirecthome,(req, res) => {
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

server.post('/remplaylist', redirecthome,(req, res) => {
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

server.post('/playlist', redirecthome,(req, res) => {
    let desc = req.body.desc;
    let title = req.body.title;
    let imageurl = req.body.imageurl;
    let vidid = req.body.vidid;

    // console.log(req.session.user.id);
    // console.log(req.session.id);

    playlist.create({
        vidid: vidid,
        desc: desc,
        title: title,
        imageurl: imageurl,
        userId: req.session.kid
        // userId : req.user.id
    }).then((list) => {
        res.status(201).send(list)
    }).catch((err) => {
        res.status(501).send({
            error: "error adding products"
        })
    })
})

server.get('/playlist', redirecthome,(req, res) => {
    console.log("hi");
    // { raw: true }
    playlist.findAll({ where: { userId: req.session.kid } })
        .then((list) => {
            res.status(200).render('playlist.ejs', { list })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                error: "could not retrieve products"
            })
        })
})

server.listen(3000)
