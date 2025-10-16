import 'dotenv/config';
import { app } from './setting';
const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
