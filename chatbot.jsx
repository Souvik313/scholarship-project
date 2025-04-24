import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react'; // optional icon
import './Chatbot.css'; // if you want additional styles

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState([]);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch(process.env.REACT_APP_GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botReply = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botReply]);
      setContext(data.context);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={toggleChat}
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white border shadow-xl rounded-lg flex flex-col z-50">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold">
            Chat with Groq AI
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {messages.map((msg, i) => (
              <div key={i} className={`my-1 ${msg.sender === 'user' ? 'text-right text-blue-600' : 'text-left text-green-600'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-2 py-1 border rounded text-sm"
              placeholder="Type your message"
            />
            <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;