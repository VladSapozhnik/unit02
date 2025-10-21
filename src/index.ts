import 'dotenv/config';
import { setupApp } from './setup-app';
import express, { type Express } from 'express';
import { runDB } from './db/mango.db';
import { settings } from './settings/settings';
const PORT: string | number = process.env.PORT || 3000;

const bootstrap = async () => {
  const app: Express = express();
  setupApp(app);

  await runDB(settings.DB_URL);
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  return app;
};

bootstrap();
