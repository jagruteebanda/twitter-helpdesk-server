function findUser(user, cb) {
  const query = `SELECT * FROM agent WHERE username='${user.username}' AND password='${user.password}'`;
  global.db.pgClient
    .query(query)
    .then(res => {
      console.log(res.rows[0]);
      cb(null, res.rows[0]);
    })
    .catch(e => {
      console.log('User does not exist:: ', e.stack);
      cb(e.stack, null);
    });
}

module.exports = findUser;