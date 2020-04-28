const express = require("express");
const index = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");

index.use(bodyparser.urlencoded({ extended: true }))

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidideas-dev', {
    useMongoClient: true,

})
    .then(() => console.log('MongoDB Connected..........'))
    .catch(err => console.log(err));
require('./models/Idea');
const Idea = mongoose.model('ideas');
index.engine('handlebars', exphbs());
index.set('view engine', 'handlebars');
index.get("/home", (req, res) => {
    res.render('home');
})
index.get("/", (req, res) => {
    res.render('home');
})
index.get("/about", (req, res) => {
    res.render('about');
})

index.get("/add", (req, res) => {
    res.render('ideas/add');
})

index.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'please enter title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'please enter details' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });

    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(() => {
                res.redirect('/ideas');
            })

    }
});

index.get("/ideas", (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
  res.render('ideas/index', {
                ideas: ideas
            });

        });
});

const port = 4000;
index.listen(port, () => {
    console.log(`server on port ${port}`);

});