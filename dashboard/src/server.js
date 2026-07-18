const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { Readable } = require('stream');

const app = express();
const PORT = 3000;

// Set upload storage to save uploaded files as updated.csv
const uploadDir = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'temp_upload.csv');
  }
});
const upload = multer({ storage: storage });

let parsedRecords = [];
const DEFAULT_CSV = path.join(__dirname, '..', 'data', 'processed', 'updated.csv');

// Parse CSV file function
function parseCSV(filePath, callback) {
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    // Find the header row starting with "Test ID"
    const headerIndex = fileContent.indexOf("Test ID,");
    if (headerIndex !== -1) {
      fileContent = fileContent.substring(headerIndex);
    }

    const results = [];
    const stream = Readable.from([fileContent]);

    stream
      .pipe(csv())
      .on('data', (data) => {
        // Only keep valid rows that have a Test ID and are not boilerplate
        const testId = data['Test ID'] ? data['Test ID'].trim() : '';
        if (testId && !testId.startsWith('Project:') && !testId.startsWith('Test ID')) {
          results.push(data);
        }
      })
      .on('end', () => {
        callback(null, results);
      })
      .on('error', (err) => {
        callback(err);
      });
  } catch (err) {
    callback(err);
  }
}

// Initial parse of default updated.csv
function loadInitialData() {
  if (fs.existsSync(DEFAULT_CSV)) {
    console.log(`Parsing default file: ${DEFAULT_CSV}`);
    parseCSV(DEFAULT_CSV, (err, data) => {
      if (err) {
        console.error('Error parsing initial CSV:', err);
      } else {
        parsedRecords = data;
        console.log(`Loaded ${parsedRecords.length} records successfully.`);
      }
    });
  } else {
    console.log('No default updated.csv found yet.');
  }
}

loadInitialData();

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// API: Get parsed records
app.use('/api/data', (req, res) => {
  res.json({
    success: true,
    totalRecords: parsedRecords.length,
    records: parsedRecords
  });
});

// API: Upload CSV
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  const uploadedPath = req.file.path;
  
  // Verify if it parses correctly
  parseCSV(uploadedPath, (err, data) => {
    if (err) {
      console.error('Failed to parse uploaded CSV:', err);
      fs.unlinkSync(uploadedPath); // delete temp file
      return res.status(400).json({ success: false, error: 'Uploaded file is not a valid CSV or has incorrect columns.' });
    }

    // Save and overwrite the default updated.csv
    try {
      fs.copyFileSync(uploadedPath, DEFAULT_CSV);
      fs.unlinkSync(uploadedPath); // clean up temp upload
      parsedRecords = data;
      console.log(`Overwrote updated.csv. Loaded ${parsedRecords.length} new records.`);
      return res.json({ success: true, totalRecords: parsedRecords.length });
    } catch (fsErr) {
      console.error('Failed to save CSV:', fsErr);
      return res.status(500).json({ success: false, error: 'Internal server error saving the CSV file.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Dashboard backend running at http://localhost:${PORT}`);
});
