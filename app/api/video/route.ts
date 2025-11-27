import {NextResponse} from "next/server";
import { auth } from "@clerk/nextjs/server";

import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function POST(
    req: Request
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {prompt} = body

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!prompt) {
            return new NextResponse("Prompt are required", { status: 400 })
        }

        const response = await client.textToImage({
            provider: "nscale",
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            inputs: "Astronaut riding a horse",
            parameters: { num_inference_steps: 5 },
        });

        return NextResponse.json(response)

    } catch (error) {
        console.log("[VIDEO_ERROR]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}