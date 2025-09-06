import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import { config } from "./config/env";


const app = express()

app.use(express.json())
app.use(cors())

connectDatabase()


app.listen(config.port, () => {
    console.log("server running at port", config.port)
})

