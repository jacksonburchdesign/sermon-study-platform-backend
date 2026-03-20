module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
{
    name: 'strapi::body',
    config: {
      formLimit: '1024mb', // Increase form body size
      jsonLimit: '1024mb', // Increase JSON body size
      textLimit: '1024mb', // Increase text body size
      formidable: {
        maxFileSize: 1024 * 1024 * 1024, // Limit uploaded file size to 1GB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
