const path = require("path");
const yaml = require('js-yaml')
const fs = require('fs')
const envDir= path.join(__dirname, '../config')
var dotenv = require('dotenv').config({path: envDir + '/.env'})
const Joi = require('joi');

var dbYAMLSidweb5  = null
var dbYAMLSidweb4  = null

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  PORT: Joi.number()
    .default(9000)
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Faltan datos en el archivo .env: ${error.message}`);
}

try {
  dbYAMLSidweb5= yaml.safeLoad(fs.readFileSync(`${envDir}/database.yml`, 'utf-8'))
  dbYAMLSidweb4= yaml.safeLoad(fs.readFileSync(`${envDir}/database-origin.yml`, 'utf-8'))
} catch(e) {
  console.error("Error cargando los archivos de configuracion yaml", e)
  process.exit()
}

const config = {
  env: envVars.NODE_ENV,
  pgDestino: dbYAMLSidweb5[envVars.NODE_ENV],
  pgOrigen: dbYAMLSidweb4[envVars.NODE_ENV]
}

module.exports = config;
