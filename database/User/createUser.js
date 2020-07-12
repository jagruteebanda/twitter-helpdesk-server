function create(user, cb) {
  const query = `INSERT INTO agent(username, password) VALUES($1, $2) RETURNING *`;
  const values = [
    user.username,
    user.password
  ];
  global.db.pgClient
    .query(query, values)
    .then(res => {
      console.log(res.rows[0]);
      cb(null, res.rows[0]);
    })
    .catch(e => {
      console.log('Error in creating user:: ', e.stack);
      cb(e.stack, null);
    });
}

module.exports = create;