"use client";
import './style1.css';
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";


// connecion with web server and io=client
const socket = io("http://localhost:5000", {autoConnect:false});

export default function Home() {
  const chatContainerRef = useRef(null); 

 
// useStates to manage states fro messages, input, username, usreid
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

 
  // User effect is applied
  useEffect(() => {

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;       // use chatcontainer ref to scroll to bottom when message updates
    }
    socket.connect(); // socket connect only once whenever useEffect used 

    // use localstorage to store userName, userID
    const savedName = localStorage.getItem("userName");
    const savedId = localStorage.getItem("userId");

    if (savedName && savedId) {
      setUserName(savedName);
      setUserId(savedId);
    } else {
      const name = prompt("Enter your name:");
      if (name) {
        const id = uuidv4();
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", id);
        socket.on("chatHistory", (messages) => setMessages((prev)=>[...prev, ...messages]));
        setUserName(name);
        setUserId(id);
      }
    }

    // socket event listner to retrieve chatHistory
    socket.on("chatHistory", (messages) => {
      setMessages(messages);
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect(); 
      socket.off("message");
      socket.off("chatHistory");
    };
  }, []);

  // funciton to send message & save in both messages.json and MongoDB and trigger socket newMessage event to send data to other sockets also
  const sendMessage = () => {
    if (input.trim()) {
      const messageData = {
        user: userId, 
        username: userName, 
        text: input,  
        timeStamp: new Date()
      };
      socket.emit("newMessage", messageData);
      setInput("");
    }
  };


  // Logout funciton to remove that userName and userId from localStorage
  const logout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* NavBar For our project */}
      <header className="p-4 bg-gray-800 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold">Group Chat  </h1>
        <h3> {userName}</h3>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </header>

    {/* Main chat container to show || view chats */}
      <div ref={chatContainerRef} className="chat-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.user === userId ? "sent" : "received"}`}
          >
          <ul>
            {
            msg.user === userId
            ? null
            : <li style={{fontSize:'1rem'}}> From: <strong><u>{msg.username} </u></strong></li>
            }
            <li>{msg.text}</li>
          </ul>
          </div>
        ))}
      </div>

{/*  Input box container to manage input  */}
      <div className="input-container">
        <input
          className="input-box"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
}
