import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import { config } from "./config/env";
import { redisClient } from "./config/redis";


const app = express()

app.use(express.json())
app.use(cors())

connectDatabase()

async function testRedis() {
  try {
    const pong = await redisClient.getClient().ping();
    console.log('Redis PING response:', pong); // should print "PONG"
  } catch (err) {
    console.error('Redis ping failed:', err);
  }
}

testRedis();


app.listen(config.port, () => {
    console.log("server running at port", config.port)
})

