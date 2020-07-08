const herokuPGConfig = {
  host: 'ec2-34-197-188-147.compute-1.amazonaws.com',
  database: 'd9v15uthun2j6',
  user: 'rkqiihdqtlfssr',
  port: 5432,
  password: '45b7f5e5d06caab32e1ba9262b06fecdd3eb66022bae23af72f9bcf9c5e47a15',
  uri: 'postgres://rkqiihdqtlfssr:45b7f5e5d06caab32e1ba9262b06fecdd3eb66022bae23af72f9bcf9c5e47a15@ec2-34-197-188-147.compute-1.amazonaws.com:5432/d9v15uthun2j6',
}

const localPGConfig = {
  user: 'twitter',
  host: '127.0.0.1',
  database: 'twitterdb',
  password: 'root@123',
  port: 5432,
}

module.exports = {
  herokuPGConfig,
  localPGConfig
}