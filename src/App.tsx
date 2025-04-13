import './App.css';
import Chat from './components/Chat';
import Navbar from './components/NavBar';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ChatData {
  id: string;
  name: string;
}

const App = () => {
  const [chats, setChats] = useState<ChatData[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChats(savedChats);

    if (savedChats.length === 0) {
      createNewChat();
    }
  }, []);

  // Persist to localStorage
  const saveChats = (updatedChats: ChatData[]) => {
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
  };

  const createNewChat = () => {
    const newChat: ChatData = {
      id: uuidv4(),
      name: `Chat ${chats.length + 1}`,
    };
    const updatedChats = [...chats, newChat];
    saveChats(updatedChats);
  };

  const selectedChat = chats[0];  // Automatically select the first chat

  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        {selectedChat && <Chat />}  {/* No need to pass chatName anymore */}
      </div>
    </div>
  );
};

export default App;
