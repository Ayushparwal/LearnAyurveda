import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatBox.css';

interface Message {
  role: string;
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;