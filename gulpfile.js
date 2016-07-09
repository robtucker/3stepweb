process.env['NODE_PATH'] = process.env.NODE_PATH || __dirname;
global.isProd = false;
global.rootDir = __dirname;
require('./gulp');
