import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import InputForm from "./InputForm";
import "./Chat.css";
import axios from "axios";

interface Message {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem("chat-messages") || "[]"
    );
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const inference = async (latestUserInput: string) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    };

    try {
      const chatCompletion = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
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
              `,
            },
            {
              role: "user",
              content: latestUserInput,
            },
          ],
          max_tokens: 1000,
        },
        { headers }
      );

      const reply = chatCompletion.data.choices[0].message.content;

      // Replace "Thinking..." with actual response
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1] = {
          role: "system",
          content: reply || "Sorry, Server is Busy.",
        };
        return updated;
      });
    } catch (err) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1] = {
          role: "system",
          content: "Server is under Maintainence, Please try again later!",
        };
        return updated;
      });
    }
  };

  const sendMessage = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!userInput.trim()) return;

    const input = userInput;
    setUserInput("");

    // Add user message and placeholder
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
      { role: "system", content: "Thinking..." },
    ]);

    await inference(input);
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