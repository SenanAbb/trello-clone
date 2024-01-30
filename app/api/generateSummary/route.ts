import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { todos } = await request.json();

    // Communicate with openAI GPT
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
            {
                role: "system",
                content: "When responding, welcome the user always and say welcome to the Trello 2.0 App. Limit the response to 200 characters"
            },
            {
                role: "user",
                content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as Todo, in progress and done, then tell the user to have a productive day! Here's de data: ${JSON.stringify(todos)}`
            }
        ]
    })

    const { data } = response

    console.log("DATA IS:" + data);
    console.log(data.choices[0].message);

    return NextResponse.json(data.choices[0].message)
}