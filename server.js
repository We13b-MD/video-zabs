const express = require('express')
const {join} = require('node:path');
const app = express()
const cors = require('cors')

let storedData = [];
app.use(cors())
app.use(express.json())

/*app.post('/api/upload', (req, res) => {
    try {
      const dailyData = req.body;
  
      // Validate the received data
      if (!dailyData || typeof dailyData !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
      }
  
      // Check if data for the same criteria (e.g., date) already exists
      const existingDataIndex = storedData.findIndex(
        (data) => data.date === dailyData.date // Replace `date` with a unique identifier key
      );
  
      if (existingDataIndex !== -1) {
        // Update the existing row
        storedData[existingDataIndex] = { ...storedData[existingDataIndex], ...dailyData };
      } else {
        // Add new row if no existing entry is found
        storedData.push(dailyData);
      }
  
      console.log('Updated stored data:', storedData);
  
      // Send success response
      res.status(200).json({ message: 'Data received and updated successfully' });
    } catch (error) {
      console.error('Error processing data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });*/


  app.post('/api/upload', (req, res) => {
    try {
      const dailyData = req.body;
      console.log('dailyData--server', dailyData)
  
      // Validate the received data
      if (!dailyData || typeof dailyData !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
      }
  
      // Check if data for the same date already exists
      const existingDataIndex = storedData.findIndex(
        (data) => data.date === dailyData.date
      );
  
      if (existingDataIndex !== -1) {
        // Aggregate counts instead of replacing the existing data
        const existingData = storedData[existingDataIndex];

        storedData[existingDataIndex] = {
        ...existingData,
        imp: existingData.imp + dailyData.imp,
        clicks: existingData.clicks + dailyData.clicks,
        ctr: ((existingData.clicks + dailyData.clicks) / (existingData.imp + dailyData.imp)),
        first: existingData.first + dailyData.first,
        sec: existingData.sec + dailyData.sec,
        videoStart: existingData.videoStart + dailyData.videoStart,
        completed: existingData.completed + dailyData.completed,
        vtr: ((existingData.completed + dailyData.completed) / (existingData.videoStart + dailyData.videoStart)) ,
        safari: existingData.safari + dailyData.safari,
        chrome: existingData.chrome + dailyData.chrome,
        edge: existingData.edge + dailyData.edge,
        desktop: existingData.desktop + dailyData.desktop,
        mobile: existingData.mobile + dailyData.mobile,
        tablet: existingData.tablet + dailyData.tablet,
        linux: existingData.linux + dailyData.linux,
        ios: existingData.ios + dailyData.ios,
        android: existingData.android + dailyData.android,
        macOS: existingData.macOS + dailyData.macOS,
        windows: existingData.windows + dailyData.windows,
        };
      } else {
        // Add new row if no existing entry is found
        storedData.push(dailyData);
      }
  
      //console.log('Updated stored data:', storedData);
  
      // Send success response
      res.status(200).json({ message: 'Data received and updated successfully' });
    } catch (error) {
      console.error('Error processing data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  // Serve dynamically created HTML table
  app.get('/', (req, res) => {
    try {
      // Generate HTML table
      const htmlTable = `
        <html>
        <head>
          <title>Digital Tribe Chivas Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            table {
              width: 80%;
              margin: 20px auto;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            h1 {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Digital Tribe table Chivas</h1>
          <table>
            <thead>
              <tr>
                ${Object.keys(storedData[0] || {}).map((key) => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${storedData
                .map(
                  (data) =>
                    `<tr>${Object.values(data).map((value) => `<td>${value}</td>`).join('')}</tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
  
      // Send the HTML table as the response
      res.send(htmlTable);
    } catch (error) {
      console.error('Error generating table:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  // Start the server
  app.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
  });
  
  
  