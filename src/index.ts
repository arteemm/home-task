import express, { Express } from 'express';
import { setupApp } from "./setup-app";
 
// создание приложения
const app: Express = express();
setupApp(app);
 
// порт приложения
const PORT = process.env.PORT || 5001;
 
// запуск приложения
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});