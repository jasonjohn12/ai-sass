import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { increaseAPILimit, checkAPILimit } from "@/lib/api-limit";

// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

import Replicate from "replicate";
import { checkSubscription } from "@/lib/subscription";
// console.log("MY TOKEN", process.env.REPLICATE_API_TOKEN);
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // if (!configuration.apiKey) {
    //   return new NextResponse("OpenAI API Key not configured", { status: 500 });
    // }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages,
    // });

    const freeTrial = await checkAPILimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );
    if (!isPro) {
      await increaseAPILimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
