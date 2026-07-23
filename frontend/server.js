const express = require('express');
const chatHandler = require('./api/chat');

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json({ limit: '10mb' }));
app.all('/api/chat', chatHandler);

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});