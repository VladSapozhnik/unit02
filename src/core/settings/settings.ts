export const settings = {
  PORT: Number(process.env.PORT) || 5000,

  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/',

  MONGO_URI_TESTING:
    process.env.MONGO_URI_TESTING ||
    'mongodb+srv://vladbars2:vlad34299@cluster0.jgd7edn.mongodb.net/testing',

  DB_NAME: process.env.DB_NAME || 'dto-it-incubator',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secretkey',
};
