const PORT: number = Number(process.env.PORT) || 5000;

export const settings = {
  PORT,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/',

  MONGO_URI_TESTING:
    process.env.MONGO_URI_TESTING ||
    'mongodb+srv://vladbars2:vlad34299@cluster0.jgd7edn.mongodb.net/testing',

  DB_NAME: process.env.DB_NAME || 'dto-it-incubator',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secretkey',
  JWT_REFRESH_SECRET_KEY:
    process.env.JWT_REFRESH_SECRET_KEY || 'secretRefreshKey',
  USER_GMAIL: process.env.USER_GMAIL || 'example@gmail.com',
  USER_GMAIL_PASSWORD: process.env.USER_GMAIL_PASSWORD || 'example_password',
  BASE_URL: process.env.BASE_URL || `http://localhost:${PORT}`,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
