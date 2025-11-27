import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openrouter } from "@/hooks/useOpenRouter";


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }


    const response = await openrouter.chat.send({
      model: "x-ai/grok-4.1-fast:free",
      messages: messages,
      temperature: 0.7,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error: any) {
    console.log("[OPENROUTER_ERROR]", error);
    return new NextResponse(
      error.message || "Internal error",
      { status: 500 }
    );
  }
}