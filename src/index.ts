import { setupApp } from "./setup-app";
 
// создание приложения
export const app = setupApp();
 
// порт приложения
const PORT = process.env.PORT || 5001;
 
// запуск приложения
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});