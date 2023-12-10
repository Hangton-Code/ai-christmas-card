import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic"; // defaults to force-static

const ReqObj = z.object({
  name: z.string().min(3),
});

export async function POST(request: NextRequest) {
  const data = await request.json();
  const zodResult = await ReqObj.safeParseAsync(data);

  if (!zodResult.success) {
    const { path, message } = zodResult.error.errors[0];
    return NextResponse.json({
      error: `${path}: ${message}`,
    });
  }

  if (process.env.NODE_ENV === "production") {
    const ip = request.ip ?? "127.0.0.1";
    const ipLimit = await kv.get(`ip-limit|${ip}`);
    if (ipLimit && ipLimit !== zodResult.data.name) {
      return NextResponse.json({
        error: `${ipLimit}, 都話只能夠睇一次!`,
      });
    }

    await kv.set(`ip-limit|${ip}`, zodResult.data.name);
  }

  const generatedContent = await kv.get(`card|${zodResult.data.name}`);
  if (generatedContent)
    return NextResponse.json({
      content: generatedContent,
    });

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `我的名字是Hangton 聖誕節就嚟到 我而家寫緊聖誕卡俾我的同學${zodResult.data.name} 你可唔可以幫我寫聖誕卡嘅內容?
盡量用廣東話詞語 不多於200字 主題可以同新年、過去一年、聖誕氣氛、食物、運動、遊戲、聖誕歌、考試有關`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const content = chatCompletion.choices[0].message.content;

  await kv.set(`card|${zodResult.data.name}`, content);

  return NextResponse.json({
    content,
  });
}
