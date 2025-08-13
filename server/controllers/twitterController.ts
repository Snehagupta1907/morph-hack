import { Request, Response } from "express";
import dotenv from "dotenv";
import { getTweetById, getUserByUsername } from "../helper/utils";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.HYPERBOLIC_API_KEY,
  baseURL: "https://api.hyperbolic.xyz/v1",
});

/**
 * Generates prediction-style questions using OpenAI API.
 * @param postData - Twitter post engagement data.
 * @param predictionType - Binary or Range-Based Prediction.
 * @param metric - The selected engagement metric (likes, shares, etc.).
 */
async function generatePredictionQuestion(
  postData: any,
  predictionType: string,
  metric: string
): Promise<string> {
  const prompt = `
        You are an expert in prediction markets. Based on the given Twitter post engagement data,
        craft a ${predictionType.toLowerCase()} prediction-style question that is engaging and aligns with prediction market principles.
        The engagement data suggests that if the current ${metric} is ${
    postData[metric]
  },
        then future engagements (likes, retweets, and shares) will follow a similar pattern.
        Structure the question so that users can make an informed guess about future engagement trends. give total 5 questions suggestions
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in crafting prediction questions for engagement metrics.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    return (
      response.choices[0]?.message?.content || "Could not generate a question."
    );
  } catch (error) {
    console.error("Error generating question with OpenAI:", error);
    throw error;
  }
}

/**
 * Express Controller: Generates a prediction question based on tweet engagement.
 */
export const getPredictionQuestion = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  try {
    const { metric, postId, username, predictionType } = req.body;

    if (!metric || !postId || !predictionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let postData: any;

    // Fetch tweet engagement data
    if (metric?.toLowerCase() === "followers") {
      if (!username)
        return res
          .status(400)
          .json({ error: "Username is required for followers" });
      postData = await getUserByUsername(username);
    } else {
      postData = await getTweetById(postId);
    }

    if (!postData) {
      return res.status(500).json({ error: "Failed to fetch Twitter data" });
    }

    console.log(postData, "postData");
    // Generate prediction-style question
    const question = await generatePredictionQuestion(
      postData,
      predictionType,
      metric
    );

    res.status(200).json({
      message: "Prediction question generated successfully",
      postData,
      question,
    });
  } catch (error) {
    console.error("Error in getPredictionQuestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
