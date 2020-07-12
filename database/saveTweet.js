function saveTweet(tweet) {
  const query = `INSERT INTO 
                tweets(
                  tweet_id, 
                  text, 
                  timestamp, 
                  id_str, 
                  created_at, 
                  lang,
                  user_id,
                  user_name,
                  user_profile_image_url,
                  user_id_str
                ) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`;
  const values = [
    tweet.id, 
    tweet.text, 
    tweet.timestamp_ms, 
    tweet.id_str, 
    tweet.created_at, 
    tweet.lang, 
    tweet.user.id, 
    tweet.user.name,
    tweet.user.profile_image_url,
    tweet.user.id_str
  ];

  // const query = `INSERT INTO 
  //               tweets(
  //                 tweet_id, 
  //                 text, 
  //                 timestamp, 
  //                 id_str, 
  //                 created_at, 
  //                 lang,
  //                 user_id,
  //                 user_name,
  //                 user_profile_image_url,
  //                 user_profile_banner_url,
  //                 user_id_str
  //               ) 
  //               VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
  // const values = [
  //   '1280575384384352300', 
  //   "RT @AlexBerenson: Yep, #COVID deaths have soared all the way to an average of 35 a day, where they were in mid-May, when the state had abou…", 
  //   "1594147938234", 
  //   "1280575384384352263", 
  //   "Tue Jul 07 18:52:18 +0000 2020", 
  //   "en", 
  //   '434108263', 
  //   "Kate G",
  //   "http://pbs.twimg.com/profile_images/1268287767966072834/HdqRqVJR_normal.jpg",
  //   "https://pbs.twimg.com/profile_banners/434108263/1591218343",
  //   "434108263"
  // ];
  global.db.pgClient
    .query(query, values)
    .then(res => {
      console.log(res.rows[0]);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    })
    .catch(e => console.log('Error in saving tweet:: ', e.stack))
}

module.exports = saveTweet;