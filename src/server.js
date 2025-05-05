//#region imports
const express  = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const sqlite = require('sqlite3');
const axios = require('axios'); // Import axios
require('dotenv').config(); // Load environment variables
const database = new sqlite.Database('./recipes.db');
//#endregion

//#region setup
// create database table if not exists - ADD an imageUrl column
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

// expose files in ./public on root.
app.use(express.static('public'));

// enable logging
app.use(morgan('dev'));

// enable parsing form data
app.use(express.urlencoded({ extended: true }));

// set up ejs templating
app.set('view engine', 'ejs');
//#endregion

// --- Helper function to search for an image ---
async function findRecipeImage(query) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.CSE_ID;
    const searchType = 'image';
    // Add terms to make the search more specific to food images
    const searchQuery = `${query} food recipe`;

    if (!apiKey || !cseId) {
        console.error("Missing Google API Key or CSE ID in environment variables.");
        return null; // Or return a default placeholder URL
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
            // Prioritize higher resolution images if available, otherwise take the first link
            const imageItem = response.data.items[0];
            return imageItem.link; // This is the direct URL to the image
        } else {
            console.warn(`No image found for query: ${searchQuery}`);
            return null; // Or return a default placeholder URL
        }
    } catch (error) {
        console.error("Error fetching image from Google Custom Search API:", error.response ? error.response.data : error.message);
        return null; // Or return a default placeholder URL
    }
}
// --- End Helper Function ---


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
        // Update INSERT statement to include imageUrl
        `INSERT INTO recipes (slug, title, category, ingredients, instructions, imageUrl) VALUES (?, ?, ?, ?, ?, ?)`,
        [slug, title, category, ingredients, instructions, imageUrl], // Add imageUrl here
        (err) => { // Add error handling for the insert
            if (err) {
                console.error("Database insert error:", err);
                // Handle duplicate slug or other errors
                // Maybe render an error page or redirect back with a message
                res.status(500).send("Error saving recipe.");
                return;
            }
             //redirect to slug only on success
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

        // The imageUrl is already in the recipe object from the DB
        res.render('recipe', recipe);
    });
});

// index endpoint (no changes needed here unless you want thumbnails)
app.get('/', async (req, res) => {
    database.all(`SELECT slug, title, category, imageUrl FROM recipes`, (err, recipes) => { // Select imageUrl too if needed for index
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        // You might want to group recipes here if needed
        res.render('index', { recipes });
    });
});

//#endregion

app.listen(port, '0.0.0.0', () => {
    console.log(`listening on port ${port}`);
}).on('error', (err) => {
    console.error(err);
});
