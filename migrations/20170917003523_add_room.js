
exports.up = function(knex, Promise) {
  return knex.schema.createTable('room', t => {
    t.increments()
    t.string('title').notNullable().unique() // 구별하기 위해 사용
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('room')
};
