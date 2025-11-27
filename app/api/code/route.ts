import Configuration, {OpenAI} from "openai"
import {NextResponse} from "next/server";
import { auth } from "@clerk/nextjs/server";
import {ChatCompletionMessage} from "openai/resources/chat/index.mjs";
import { openrouter } from "@/hooks/useOpenRouter";

const instructionMessage: ChatCompletionMessage = {
    role: "system",
    content: "You are a code generator." +
        " You must answer only in markdown code snippets." +
        " Use code comments for explanations."
}

export async function POST(
    req: Request
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {messages} = body

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 })
        }

        const response = await openrouter.chat.send({
            model: "x-ai/grok-4.1-fast:free",
            messages: [instructionMessage, ...messages]
        })

        return NextResponse.json(response.choices[0].message)

    } catch (error) {
        console.log("[CODE_ERROR]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}