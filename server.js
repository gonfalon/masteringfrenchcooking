//#region imports
const interfaces = require('os').networkInterfaces();
const express  = require('express');
const morgan = require('morgan');
const nocache = require('nocache');
const sqlite = require('sqlite3');
const axios = require('axios');
require('dotenv').config(); // Load environment variables
const database = new sqlite.Database('./recipes.db');
//#endregion

//#region setup
// create database table if not exists
database.run(`
    CREATE TABLE IF NOT EXISTS recipes (
        slug TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        ingredients TEXT,
        instructions TEXT,
        imageUrl TEXT
    );
`);

const port = 2369;
const app = express();

// disable caching
app.use(nocache());

// expose files in src/public on root.
app.use(express.static('public'));

// enable logging
app.use(morgan('dev'));

// enable parsing form data
app.use(express.urlencoded({ extended: true }));

// set up ejs templating
app.set('view engine', 'ejs');
//#endregion

// Helper function to run a Google Image Search
async function findRecipeImage(query) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.CSE_ID;
    const searchType = 'image';
    // Add terms to make the search more specific to food images
    const searchQuery = `${query} food recipe`;

    if (!apiKey || !cseId) {
        console.warn("Missing one or both GOOGLE_API_KEY and CSE_ID; no images will be retrieved");
        return null;
    }

    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
        const response = await axios.get(url, {
            params: {
                key: apiKey,
                cx: cseId,
                q: searchQuery,
                searchType: searchType,
                num: 1 // Get only the first result
            }
        });

        if (response.data && response.data.items && response.data.items.length > 0) {
            // Take the first result
            const imageItem = response.data.items[0];
            return imageItem.link; // This is the direct URL to the image
        } else {
            console.warn(`No image found for query: ${searchQuery}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching image from Google Custom Search API:", error.response ? error.response.data : error.message);
        return null;
    }
}


//#region endpoints

// upload endpoint
app.post('/add/text', async (req, res) => { // Make the handler async

    console.log(req.body);
    const title = req.body.title;
    const category = req.body.category;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;

    // generate a slug converting title to kebab case
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''); // Avoid trailing hyphen

    // --- Find the image ---
    let imageUrl = await findRecipeImage(title);
    if (!imageUrl) {
        // Optional: Set a default placeholder image if none found
        // imageUrl = '/images/default-placeholder.jpg';
        imageUrl = null; // Or store null in the DB
    }
    // --- End Image Finding ---

    database.run(
        `INSERT INTO recipes (slug, title, category, ingredients, instructions, imageUrl) VALUES (?, ?, ?, ?, ?, ?)`,
        [slug, title, category, ingredients, instructions, imageUrl], // Add imageUrl here
        (err) => {
            if (err) {
                console.error("Database insert error:", err);

                res.status(500).send("Error saving recipe.");
                return;
            }

            res.redirect(`/${slug}`);
        }
    );
});

// slug endpoint
app.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    database.get(`SELECT * FROM recipes WHERE slug = ?`, [slug], (err, recipe) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500); // Return early
        }

        if (!recipe) {
            return res.redirect('/404.html'); // Return early
        }

        // Split only if they exist and are strings
        recipe.ingredients = typeof recipe.ingredients === 'string' ? recipe.ingredients.split('\n') : [];
        recipe.instructions = typeof recipe.instructions === 'string' ? recipe.instructions.split('\n') : [];

        res.render('recipe', recipe);
    });
});

// index endpoint
app.get('/', async (req, res) => {
    database.all(`SELECT slug, title, category, imageUrl FROM recipes`, (err, recipes) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        res.render('index', { recipes });
    });
});

//#endregion

app.listen(port, '0.0.0.0', () => {
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`Server started at http://${iface.address}:${port}`);
            }
        }
    }
}).on('error', (err) => {
    console.error(err);
});
