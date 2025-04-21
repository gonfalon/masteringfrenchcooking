const express  = require('express');
const morgan = require('morgan');

const port = 2369;
const app = express();

// expose files in public on root.
app.use(express.static('public'));

// enable logging
app.use(morgan('dev'));

// enable parsing form data
app.use(express.urlencoded({ extended: true }));

// ping endpoint for server existence check
app.get('/ping', (_, res) => {
    res.send('200');
});

// upload endpoint
app.post('/api/add', imageFieldNames, async (req, res) => {
    console.log(req.body);

    const title = req.body.title;
    const category = req.body.category;
    
    res.send("yay!");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
    //console.log(networkInterfaces());
});
