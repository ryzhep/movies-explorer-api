const {
  PORT = 3000,
  DB = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  JWT_SECRET = 'd285e3dceed844f902650f40',
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT_SECRET,
};
