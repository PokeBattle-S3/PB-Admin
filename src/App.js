import './App.css';
import React from 'react';
import io from 'socket.io-client';
import {useEffect, useState} from 'react';

import { Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Battle from './Components/Battle';
import NavBar from './Components/NavBar';
import Login from './Components/Login';
import Register from './Components/Register';
const socket = io.connect('http://localhost:3001');


function App() {
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState("");

  const [room, setRoom] = useState('');

  const sendMessage = () => {
    console.log('Sending Message...');
    socket.emit("send_message", {message, room, userId: socket.id});
  }

  const navigateToBattle = (roomId) => {
    window.location.href = `/battle/${roomId}`
  }

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessageReceived(message);
    });
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <Routes>
          {/* Error route */}
          {/* <Route path='*' exact={true} element={<PageDoesNotExist />} /> */}
          {/* public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/battle/:roomId" element={<Battle/>} />
      </Routes>
    </>
  );
}

export default App;
