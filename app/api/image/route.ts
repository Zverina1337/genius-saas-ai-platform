import Configuration, {OpenAI} from "openai"
import {NextResponse} from "next/server";
import { auth } from "@clerk/nextjs";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAI({...configuration})

export async function POST(
    req: Request
) {
    try {
        const {userId} = auth()
        const body = await req.json()
        const {
            prompt,
            amount = 1,
            resolution
        } = body

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAI Api key not configured", { status: 500 })
        }

        if (!prompt) {
            return new NextResponse("Prompt are required", { status: 400 })
        }

        if (!amount) {
            return new NextResponse("Amount are required", { status: 400 })
        }

        if (!resolution) {
            return new NextResponse("Resolution are required", { status: 400 })
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        })

        return NextResponse.json(response.data)

    } catch (error) {
        console.log("[IMAGE_ERROR]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}