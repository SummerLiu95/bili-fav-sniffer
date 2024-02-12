const fs = require('fs');

const apiEndpoint = 'http://localhost:3000/api/job';

// Check if the Config file exists
if (fs.existsSync(`/app/config.json`)) {
  console.log('Configuration file found. Start making a request to trigger the sniffing task...');

  // Read and parse the JSON content from the file
  const configData = JSON.parse(fs.readFileSync(`/app/config.json`, 'utf8'));

  // Extracting parameters from the configData object
  const {
    telegram_bot_token,
    telegram_chat_id,
    uid,
    fid,
    rss_domain,
    cron
  } = configData;

  // Create the JSON data for the POST request
  const jsonData = JSON.stringify({
    telegram_bot_token,
    telegram_chat_id,
    fav_url: `https://space.bilibili.com/${uid}/favlist?fid=${fid}&ftype=create`,
    rss_domain,
    cron
  });

  // Use Fetch API for making the POST request
  setTimeout(() => {
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('POST request sent successfully.');
    }).catch(error => {
      console.error('Error sending POST request:', error.message);
    });
  }, 5000)

} else {
  console.log('Configuration file not found means that the sniffing task was never started');
}
