const express  = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const port = 2369;
const app = express();

// enable Cross Origin Resource Sharing
app.use(cors());

// enable file uploads. Stores the files in the default temp directory
const upload = multer();

// enable logging
app.use(morgan('dev'));

// enable parsing form data
app.use(express.urlencoded({ extended: true }));

// ping endpoint for server existence check
app.get('/ping', (_, res) => {
    res.send('200');
});

// upload endpoint
const imageFieldNames = upload.fields([{name: 'image'}, {name: 'image2'}]);
app.post('/upload', imageFieldNames, async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    
    const category = req.body.category;
    const title = req.body.title;
    const image = req.files.image;
    const image2 = req.files?.image2;

    // set up tesseract worker
    const worker = await createWorker('eng');
    const image1Text = await worker.recognize(image.buffer);
    console.log(image1Text);

    res.send(image1Text);
    await worker.terminate();
});

/*
// create https server
const httpsServer = https.createServer({
    key: fs.readFileSync('selfsigned.key'),
    cert: fs.readFileSync('selfsigned.crt')
}, app);*/

app.listen(port, () => {
    console.log(`listening on port ${port}`);
    //console.log(networkInterfaces());
});
