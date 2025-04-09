import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { networkInterfaces } from 'os';
//import tesseract from 'tesseract.js';

const port = 2369;
const app = express();

// enable Cross Origin Resource Sharing
app.use(cors());

// enable logging
app.use(morgan('dev'));

// enable parsing form data
app.use(express.urlencoded({ extended: true }));

// ping endpoint for server existence check
app.get('/ping', (_, res) => {
    res.send('200');
});

// upload endpoint
app.post('/upload', async (req, res) => {
    res.send("yay!")
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(networkInterfaces());
});