export const settings = {
  PORT: Number(process.env.PORT) || 5000,
  DB_URL: process.env.MANGO_URI || 'mongodb://127.0.0.1:27017/blogs',
  DB_NAME: process.env.DB_NAME || 'blogs',
};
