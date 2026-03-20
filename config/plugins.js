// backend/config/plugins.js
module.exports = () => ({
  upload: {
    config: {
      sizeLimit: 1024 * 1024 * 1024 // 1GB in bytes
    }
  }
});