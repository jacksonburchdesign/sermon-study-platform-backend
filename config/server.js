module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // 1. Tell Strapi its live web address (Fixes the yellow warning)
  url: env('PUBLIC_URL', ''), 
  // 2. Tell Strapi to trust Render's HTTPS front door (Fixes the red crash error)
  proxy: true, 
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});