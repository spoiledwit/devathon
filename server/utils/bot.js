import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getName = async (email) => {
  return "John Doe";
};

const getOrderStatus = async (orderId) => {
  return "In transit";
};

const getDeliveryDate = async (orderId) => {
  return "2024-09-15";
};

const tools = [
  {
    type: "function",
    function: {
      name: "getName",
      description: "Get the name of a customer using their email address",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "The email address of the customer",
          },
        },
        required: ["email"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getOrderStatus",
      description: "Get the current status of a customer's order",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The unique identifier for the order",
          },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getDeliveryDate",
      description: "Get the expected delivery date for a customer's order",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The unique identifier for the order",
          },
        },
        required: ["orderId"],
      },
    },
  },
];

// Chat messages
const messages = [
  { 
    role: "system", 
    content: "You are a helpful customer support assistant. Use the supplied tools to assist the user." 
  },
  { 
    role: "user", 
    content: "Hi, can you tell me the delivery date of order id? 123123? and also a poem" 
  },
];

async function handleCustomerQuery() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      tools: tools,
    });

    console.log("AI Response:", response.choices[0].message.content);

    if (response.choices[0].message.tool_calls) {
      for (const toolCall of response.choices[0].message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        let result;
        switch (functionName) {
          case "getName":
            result = await getName(args.email);
            break;
          case "getOrderStatus":
            result = await getOrderStatus(args.orderId);
            break;
          case "getDeliveryDate":
            result = await getDeliveryDate(args.orderId);
            break;
          default:
            console.log(`Unknown function: ${functionName}`);
            continue;
        }

        console.log(`${functionName} result:`, result);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

handleCustomerQuery();