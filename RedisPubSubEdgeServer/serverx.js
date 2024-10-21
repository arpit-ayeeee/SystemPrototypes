import express from "express";
import bodyParser from "body-parser";
import RedisConfig from "./config.js";

const app = express();
const jsonParser = bodyParser.json();

const sendMessageToRedis = async (req, res) => {
    try {
        const message = req.body;

        console.log(message);
        const redisConfig = new RedisConfig();
        redisConfig.produce('channelHome', message);

        res.status(200).send({ message: "Message sent to Redis successfully" });

    } catch (err) {
        console.log(err);
    }
}

app.post("/send-to-redis", jsonParser, sendMessageToRedis);



// Consume too
const redisConfig = new RedisConfig();
redisConfig.consume('channelHome', (message) => {
    console.log("Message recieved: ", JSON.stringify(message.toString()));
})

app.listen(8080, () => {
    console.log("listening on 8080");
})