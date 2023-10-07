const http = require('http');
const fs = require('fs');

let visitorCount = 0;
let yesCount = 0;
let noCount = 0;
let lastAnswer = null; // To track the last answer

// Load visitor counts from a file if it exists
fs.readFile('visitorCounts.json', 'utf8', (err, data) => {
  if (!err) {
    const counts = JSON.parse(data);
    visitorCount = counts.visitorCount || 0;
    yesCount = counts.yesCount || 0;
    noCount = counts.noCount || 0;
  }
});

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    if (req.method === 'POST') {
      const answer = req.headers['answer'];

      // Check if this answer is different from the last answer
      if (answer === 'yes' && lastAnswer !== 'yes') {
        yesCount++;
      } else if (answer === 'no' && lastAnswer !== 'no') {
        noCount++;
      }

      // Update the last answer
      lastAnswer = answer;

      // Increment the overall visitor count
      visitorCount++;

      // Save the updated counts to the file
      const counts = {
        visitorCount,
        yesCount,
        noCount,
      };

      fs.writeFile('visitorCounts.json', JSON.stringify(counts), (err) => {
        if (err) {
          console.error('Error saving counts:', err);
        }
      });
    }

    // Respond with the current visitor and answer counts
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const counts = {
      visitorCount,
      yesCount,
      noCount,
    };
    res.end(JSON.stringify(counts));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
