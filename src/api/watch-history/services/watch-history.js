'use strict';

/**
 * watch-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::watch-history.watch-history');
