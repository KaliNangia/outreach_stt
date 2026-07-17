const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.render('index', { rows: null, error: null });
});

app.post('/upload', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
        return res.render('index', { rows: null, error: 'Please select a valid tester CSV log file.' });
    }

    const rows = [];
    
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            const cleanedRow = {};
            for (let key in data) {
                // Ensure absolute cleaning of trailing line breaks or spaces from column keys
                cleanedRow[key.trim()] = data[key] ? data[key].trim() : '';
            }
            rows.push(cleanedRow);
        })
        .on('end', () => {
            fs.unlinkSync(req.file.path);

            if (rows.length === 0) {
                return res.render('index', { rows: null, error: 'The uploaded file does not contain any data rows.' });
            }

            res.render('index', {
                error: null,
                rows: rows
            });
        })
        .on('error', (err) => {
            console.error(err);
            res.render('index', { rows: null, error: 'Failed to process CSV layout structure.' });
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});