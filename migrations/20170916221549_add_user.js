
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', t => {
    t.increments() // 식별자 사용할 때 이렇게 편하게 사용가능
    t.string('username').unique().notNullable()
    t.string('hashed_password').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user')
};
