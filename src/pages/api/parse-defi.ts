import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ParsedResult = Array<{
  address: string;
  amount: string;
  token: string;
}>;

type Data = 
  | { result: ParsedResult }
  | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const { prompt }: { prompt: string } = req.body;

  const messages = [
    {
      role: "system" as const,
      content:
        `You are a DeFi assistant. Convert user natural language instructions for batch token transfers into a JSON array with address, amount, and token fields. Example output: [{address:'0x...', amount:'0.005', token:'tRTBC'}]. Only output the array.
        Accept minor spelling errors or variations for token names, and infer closest valid tokens.`
    },
    { role: "user" as const, content: prompt },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    const aiText = completion.choices[0].message?.content ?? "[]";

    const parsedResult = JSON.parse(aiText.replace(/``````/g, "")) as ParsedResult;

    res.status(200).json({ result: parsedResult });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
