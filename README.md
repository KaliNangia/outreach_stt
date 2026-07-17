# ACE Executive Health Dashboard

A Node.js and Express web application that allows users to upload automated QA testing log sheets (in CSV format) and automatically generates real-time, interactive performance metrics, KPIs, and charts.

## Features

- **CSV Upload & Parsing:** Easily upload your QA log sheets to instantly generate insights.
- **Executive Scorecard:** High-level metrics including ACE Trust Score, Farmer Experience Score, and Release Health.
- **Dynamic Filtering:** Filter data dynamically by Date Range (including Custom Date Ranges), Build/Version, Sprint/Cycle, Channel, Language, and Question Category.
- **Time Period Analysis:** Visualize trends over time (Pass Rate, Accuracy, Response Time, Defects) using integrated Chart.js graphs.
- **Component Failure Analysis:** Deep dive into the failure rates of specific pipeline modules (Translation Engine, Answer Quality, Workflow SLAs, etc.).
- **Modern UI:** Responsive, glassmorphism-inspired design with sleek micro-animations for an elevated user experience.

## Tech Stack

- **Backend:** Node.js, Express.js
- **File Upload & Parsing:** Multer, csv-parser
- **Frontend Template:** EJS (Embedded JavaScript templating)
- **Frontend Styling:** Vanilla CSS (Outfit font, Glassmorphism aesthetics)
- **Data Visualization:** Chart.js

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   # or
   node app.js
   ```

4. **View in Browser:**
   Open your web browser and navigate to `http://localhost:3000`.

## Usage

1. Open the dashboard in your web browser.
2. Click **Choose File** and select a valid QA testing log sheet in `.csv` format.
3. Click **Parse Logs** to upload the data.
4. Once the data is processed, use the filter dropdowns at the top of the dashboard to narrow down the dataset and observe how the real-time charts and KPIs react.
# outreach_stt
Repo for test log data dashboard 
