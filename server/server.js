//#region imports
const express  = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const sqlite = require('sqlite3');
const database = new sqlite.Database('./recipies.db');
//#endregion

//#region setup
// create database table if not exists
database.run(`
    CREATE TABLE IF NOT EXISTS recipies (
        slug TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        ingredients TEXT,
        instructions TEXT
    )
`);

const port = 2369;
const app = express();

// expose files in ./public on root.
app.use(express.static('public'));

// enable logging
app.use(morgan('dev'));

// enable parsing form data
app.use(express.urlencoded({ extended: true }));

// set up ejs templating
app.set('view engine', 'ejs');
//#endregion

//#region endpoints

// upload endpoint
app.post('/api/add', async (req, res) => {

    console.log(req.body);
    const title = req.body.title;
    const category = req.body.category;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;

    // generate a slug converting title to kebab case
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    database.run(
        `INSERT INTO recipies (slug, title, category, ingredients, instructions) VALUES (?, ?, ?, ?, ?)`,
        [slug, title, category, ingredients, instructions]
    );

    //redirect to slug
    res.redirect(`/${slug}`);
});

// slug endpoint
app.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    database.get(`SELECT * FROM recipies WHERE slug = ?`, [slug], (err, recipie) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }

        if (!recipie) {
            res.redirect('404.html');
            return;
        }
        recipie.ingredients = recipie.ingredients.split('\n');
        recipie.instructions = recipie.instructions.split('\n');
        
        res.render('recipie', recipie);
    });
});

// index endpoint
app.get('/', async (req, res) => {
    database.all(`SELECT * FROM recipies`, (err, recipies) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }
        res.render('index', { recipies });
    });
});

//#endregion

app.listen(port, () => {
    console.log(`listening on port ${port}`);
}).on('error', (err) => {
    console.error(err);
});
