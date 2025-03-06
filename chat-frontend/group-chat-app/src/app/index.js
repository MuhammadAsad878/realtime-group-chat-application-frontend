// import { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import { v4 as uuidv4 } from 'uuid';

// const socket = io('http://localhost:5000'); 

// export default function Home() {
//     const [messages, setMessages] = useState([]);
//     const [text, settext] = useState('');
//     const [username, setUsername] = useState('');
//     const [userid, setUserid] = useState('');
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         const savedName = localStorage.getItem('userName');
//         const savedId = localStorage.getItem('userId');
//         if (savedName && savedId) {
//             setUsername(savedName);
//             setUserid(savedId);
//         } else {
//             const name = prompt('Enter your name:');
//             if (name) {
//                 const id = uuidv4();
//                 localStorage.setItem('userName', name);
//                 localStorage.setItem('userId', id);
//                 setUsername(name);
//                 setUserid(id);
//             }
//         }

//         socket.on('chatHistory', (messages) => {
//           console.log(messages);
//             setMessages(messages);
//         });

//         socket.on('newMessage', (message) => {
//           console.log(messages);
//             setMessages(prev => [...prev, message]);
//         });

//         return () => {
//             socket.off('message');
//             socket.off('chatHistory');
//         };
//     }, [socket]);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     const sendMessage = () => {
//             const messageData = {
//                 user: userid, 
//                 username: username, 
//                 text: text,  
//                 timeStamp: new Date()
//             }
//             socket.emit('newMessage', messageData);
//             setInput('');
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('userName');
//         localStorage.removeItem('userId');
//         window.location.reload();
//     };

//     return (
//         <div>
//             <h1>Group Chat</h1>
//             <button onClick={logout}>Log Out</button>
//             <div>
//                 {messages.map((msg, idx) => (
//                     <p key={idx}><strong>{msg.userName}:</strong> {msg.text}</p>
//                 ))}
//                 <div ref={messagesEndRef}></div> 
//             </div>
//             <input 
//                 value={input} 
//                 onChange={(e) => setInput(e.target.value)} 
//                 placeholder="Type a message..." 
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
