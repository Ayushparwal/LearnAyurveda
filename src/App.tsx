import './App.css';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ChatData {
  id: string;
  name: string;
}

const App = () => {
  const [chats, setChats] = useState<ChatData[]>([]);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChats(savedChats);

    if (savedChats.length === 0) {
      createNewChat();
    }
  }, []);

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

  const selectedChat = chats[0];

  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        {selectedChat && <Chat />}
      </div>
      <br>
      </br>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AyurvedaBot. All rights reserved.</p>
        <p className="footer-note">
          Ayurveda is a traditional Indian system of medicine that focuses on balance within the body, mind, and spirit. It utilizes natural remedies, lifestyle changes, and dietary practices based on the individual's dosha type: Vata, Pitta, or Kapha.
        </p>
        
        <p className="made-by">Made by <b>Ayush Parwal</b> with lots of ❤️.</p>
      </footer>
    </div>
  );
};

export default App;