import { app } from "./setup-app";
import { runDb } from './repositories/db';


// порт приложения
const PORT = process.env.PORT || 5001;
 
// запуск приложения
const startApp = async () => {
    await runDb()
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}

startApp()