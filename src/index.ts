import 'dotenv/config';
import { setupApp } from './setup-app';
import express from 'express';
const PORT: string | number = process.env.PORT || 3000;

const app = express();

setupApp(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
