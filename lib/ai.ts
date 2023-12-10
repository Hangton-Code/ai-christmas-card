import OpenAI from "openai";

const getOpenAIAPIKey = () => {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }

  throw new Error("OPENAI_API_KEY is not defined");
};

export const openai = new OpenAI({
  apiKey: getOpenAIAPIKey(),
});
