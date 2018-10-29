// contains prior coded
const configureKnex = require('knex');
const objection = require('objection');
const objectionTimestamp = require('objection-timestamp');
const config = require('../knexfile.js');

const knex = configureKnex(config);

objectionTimestamp.register(objection, {
  create: 'created_at',
  update: 'updated_at',
});

objection.Model.knex(knex);

module.exports = {
  knex,
  Model: objection.Model,
};