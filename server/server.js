import express from 'express';
import tesseract from 'tesseract.js';

const port = 75;
const app = express();

app.get('/ping', (_, res) => {
    res.sendStatus(200);
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

console.log('Server running');