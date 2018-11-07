const path = require("path");
const envDir = path.join(__dirname, '../../..')
var dotenv = require('dotenv').config({path: envDir + '/.env'})
const configurationDBs = require('../../../src/config');
const { convertDateToUTCTimestamp } = require('./date-utils.js');

const configDestino = {
  client: 'pg'
};

const configOrigen = {
  client: 'pg'
};

const customDateTimeTypecaster = (field, next) => {
  // cast DATETIME to timestamp number
  if (field.type === 'DATETIME') {
    const date = new Date(field.string());
    return convertDateToUTCTimestamp(date);
  }
  return next();
};

const pgDestino = configurationDBs.pgDestino
configDestino.connection = {
    host: pgDestino.host || '127.0.0.1',
    user: pgDestino.username || 'postgres',
    password: pgDestino.password || '123',
    database: pgDestino.database || 'canvas_development',
    timezone: 'UTC',
    typeCast: customDateTimeTypecaster
}

const pgOrigen = configurationDBs.pgOrigen
configOrigen.connection = {
    host: pgOrigen.host || '127.0.0.1',
    user: pgOrigen.username || 'postgres',
    password: pgOrigen.password || '123',
    database: pgOrigen.database || 'canvas_development',
    timezone: 'UTC',
    typeCast: customDateTimeTypecaster
}

//module.exports = require('knex')(config);
module.exports = {knexOrigen: require('knex')(configOrigen), knexDestino:require('knex')(configDestino) };
