import 'dotenv/config';
import { setupApp } from './setup-app';
import express, { type Express } from 'express';
import { runDB } from './core/db/mongo.db';
import { settings } from './core/settings/settings';
const PORT: string | number = process.env.PORT || 3000;

const bootstrap = async () => {
  const app: Express = express();
  setupApp(app);

  await runDB(settings.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  return app;
};

bootstrap();
