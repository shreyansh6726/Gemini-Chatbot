const express = require('express');
const chatHandler = require('../api/chat');

module.exports = function setupProxy(app) {
  app.use('/api/chat', express.json({ limit: '10mb' }));
  app.all('/api/chat', chatHandler);
};