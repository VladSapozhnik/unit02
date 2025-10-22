export const settings = {
  PORT: Number(process.env.PORT) || 5000,
  // DB_URL: process.env.MANGO_URI || 'mongodb://127.0.0.1:27017/blogs',
  DB_URL:
    process.env.MANGO_URI ||
    'mongodb+srv://vladbars2:vlad34299@cluster0.jgd7edn.mongodb.net/',

  // DB_URL_TESTING: 'mongodb://127.0.0.1:27017/testing',
  DB_URL_TESTING:
    'mongodb+srv://vladbars2:vlad34299@cluster0.jgd7edn.mongodb.net/testing',

  DB_NAME: process.env.DB_NAME || 'blog-it-incubator',
};
