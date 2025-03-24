import express, { RequestHandler, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import OpenAI from "openai";
config();

const client = new OpenAI();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN
}));

const completion: RequestHandler<unknown, unknown, {
    messages: {
        role: "user" | "assistant" | "developer",
        content: { type: "text", text: string }[]
    }[]
}, unknown> = async (req, res) => {
    try {
        const { messages } = req.body;
        const response = await client.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo",
        })
        res.status(200).send(response.choices[0].message.content);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
};

app.post("/completion", completion);

function start() {
    try {
        app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();