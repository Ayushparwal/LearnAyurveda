import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatBox.css';

interface Message {
  role: string;
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  loading?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, loading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages or loading changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className='chat-box'>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}-message`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
      {loading && (
        <div className='message system'>Thinking...</div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBox;
