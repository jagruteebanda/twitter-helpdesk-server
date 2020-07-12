function saveCustomer(customer) {
  const query = `INSERT INTO 
                customer(
                  customer_id, 
                  id_str, 
                  name, 
                  profile_image_url, 
                  profile_banner_url, 
                  screen_name,
                  created_at,
                  description
                ) 
                VALUES(
                  ${customer.id}, 
                  ${customer.id_str}, 
                  ${customer.name}, 
                  ${customer.profile_image_url}, 
                  ${customer.profile_banner_url}, 
                  ${customer.screen_name},
                  ${customer.created_at},
                  ${customer.description}
                )
                RETURNING *`;
  global.pgClient
    .query(text, values)
    .then(res => {
      console.log(res.rows[0])
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    })
    .catch(e => console.error('Error while saving customer:: ', e.stack))
}

module.exports = saveCustomer;