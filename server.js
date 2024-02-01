import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3001 } = process.env;

mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
        console.log(`Server running. Use our on port: ${PORT}`)
    })
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1)
})