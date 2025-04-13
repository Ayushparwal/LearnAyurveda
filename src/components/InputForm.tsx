import React from 'react';
import './InputForm.css';

interface InputFormProps {
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event: React.FormEvent) => void;
}

const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, sendMessage }) => {
  return (
    <form className="input-container" onSubmit={sendMessage}>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        autoComplete="on"
        placeholder='Ask anything...'
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default InputForm;