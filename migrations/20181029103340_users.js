// contains prior code
exports.up = knex => knex.schema.createTable('users', (table) => {
  table.bigIncrements().primary();
  table.string('username').notNullable().unique();
  table.string('email').notNullable().unique();
  table.boolean('active').defaultTo(false).index().notNullable();
  table.timestamp('activated_at');
  table.timestamps();
});

exports.down = knex => knex.schema.dropTableIfExists('users');