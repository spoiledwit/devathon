import dotenv from "dotenv";
import {
  ComprehendClient,
  DetectSentimentCommand,
} from "@aws-sdk/client-comprehend";

dotenv.config();

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_BUCKET_REGION,
};

const comprehend = new ComprehendClient(config);

export const moderateContent = async (text) => {
  const input = {
    Text: text,
    LanguageCode:
      "en" ||
      "es" ||
      "fr" ||
      "de" ||
      "it" ||
      "pt" ||
      "ar" ||
      "hi" ||
      "ja" ||
      "ko" ||
      "zh" ||
      "zh-TW",
  };

  const command = new DetectSentimentCommand(input);
  const response = await comprehend.send(command);

  if (response.SentimentScore.Negative > 0.5) {
    return false;
  }
  return true;
};
