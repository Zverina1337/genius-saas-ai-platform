import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "1024x1024" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const apiToken = process.env.HUGGINGFACE_API_KEY;

    if (!apiToken) {
      return new NextResponse("Hugging Face API token not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const [width, height] = resolution.split("x").map(Number);
    const images = [];

    for (let i = 0; i < Math.min(amount, 4); i++) {
      try {
        // Новый формат URL: router.huggingface.co/{provider}/models/{model}
        const response = await fetch(
          "https://router.huggingface.co/fal-ai/models/black-forest-labs/FLUX.1-schnell",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                width: width || 1024,
                height: height || 1024,
                num_inference_steps: 4, // FLUX.1-schnell быстрый, 4 шага достаточно
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[HF_ERROR] ${response.status}:`, errorText);
          
          // Проверяем специфичные ошибки
          if (response.status === 402) {
            return new NextResponse("Insufficient credits", { status: 402 });
          }
          if (response.status === 503) {
            return new NextResponse("Model is loading, try again", { status: 503 });
          }
          
          throw new Error(errorText);
        }

        // HF возвращает бинарные данные изображения
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        
        // Определяем MIME type из заголовков
        const contentType = response.headers.get("content-type") || "image/png";
        const dataUrl = `data:${contentType};base64,${base64}`;

        images.push({ url: dataUrl });

      } catch (imgError: any) {
        console.error(`[HF_IMAGE_ERROR] Image ${i + 1}:`, imgError.message);
      }
    }

    if (images.length === 0) {
      return new NextResponse("Failed to generate images", { status: 500 });
    }

    return NextResponse.json(images);

  } catch (error: any) {
    console.error("[IMAGE_ERROR]", error);
    return new NextResponse(error?.message || "Internal error", {
      status: 500,
    });
  }
}