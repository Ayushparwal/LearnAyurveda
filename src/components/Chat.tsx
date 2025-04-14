import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import InputForm from "./InputForm";
import "./Chat.css";
import { HfInference } from "@huggingface/inference";

interface Message {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  // Removed chatName from props
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  // Remove the use of chatId from localStorage and only keep the messages
  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem("chat-messages") || "[]"
    );
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const inference = async () => {
    const client = new HfInference(import.meta.env.VITE_HF_API_KEY);

    const chatCompletion = await client
      .chatCompletion({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          {
            role: "system",
            content: `
                You are a helpful assistant.
You're known as the AyurHaven bot for the AyurHaven platform – the go-to platform for holistic wellness and Ayurvedic living.
You specialize in helping with Ayurveda-related questions, including topics like herbal remedies, dosha balancing, Ayurvedic nutrition, daily routines (dinacharya), seasonal practices (ritucharya), and natural healing methods.
When a user approaches you with a query, you must answer appropriately and in detail, providing information rooted in Ayurvedic principles and classical wisdom.
Your response must be purely in text format, with no special code snippets. Formatting MUST be proper and reader-friendly.
You will politely decline to help with non-Ayurveda-related questions.
Do not exceed the 250 token limit.`,
          },
          ...messages,
        ],
        max_tokens: 1000,
      })
      .then((response) => response.choices[0]);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "system",
        content:
          chatCompletion.message.content ||
          `Sorry, I'm having trouble understanding right now.`,
      },
    ]);
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      inference();
    }
  }, [messages]);

  const sendMessage = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!userInput.trim()) return;
    let input = userInput;
    setUserInput("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="ask-anything">What can I help with?</div>
      <ChatBox messages={messages} />
      <InputForm
        userInput={userInput}
        setUserInput={setUserInput}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
