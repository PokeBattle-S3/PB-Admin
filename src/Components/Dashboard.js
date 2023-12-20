import '../App.css';
import React from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from 'react';
import WebSocketConfig from './WebSocketConfig';

const socket = io.connect(WebSocketConfig.url);


function Dashboard() {
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState("");
  const [userId, setUserId] = useState('');
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');

  const localuser = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (localuser == null) {
        navigate('login');
    }
  }, [localuser]);
  
  
  const sendMessage = () => {
    console.log('Sending Message...');
    socket.emit("send_message", { message, roomId, userId: localuser.id });
  }

  const getRooms = () => {
    socket.emit("get_rooms", rooms => {
      setRooms(rooms);
    });
  }

  const closeRoom = (roomId) => {
    socket.emit("close_room", roomId);
  }


  useEffect(() => {
    // Get the initial rooms data when the component mounts
    getRooms();

    // Set up a listener for the "rooms_updated" event
    socket.on("rooms_updated", (newRooms) => {
        setRooms(newRooms);
    });

    // Clean up the listener when the component unmounts
    return () => {
        socket.off("rooms_updated");
    };
}, []);


  useEffect(() => {
    
    socket.on('receive_message', (message) => {
      setMessageReceived(message);
    });
  });

  useEffect(() => {
    socket.on('connect', () => {
      const savedId = localStorage.getItem('userId');
      if (savedId) {
        setUserId(savedId);
        socket.emit('set-id', savedId);
      }
      else {
        setUserId(savedId);
        localStorage.setItem('userId', socket.id);
      }
    });
  });

  return (
    <div className='dashboard'>
      <div register='title'>
        Hello, {localuser.username}!

        {/* Table under the hello but above the privacy policy */}
        <div className="rooms-table">
            <table>
                <thead>
                    <tr>
                        <th>Room</th>
                        <th>User1</th>
                        <th>User2</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room, index) => (
                        <tr key={index}>
                            <td>{room.id}</td>
                            <td>{room.users[0] ? room.users[0].username : 'Waiting...'}</td>
                            <td>{room.users[1] ? room.users[1].username : 'Waiting...'}</td>
                            <td><button onClick={() => closeRoom(room.id)}>Close Room</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="dashboard-container">
          <h2>Privacy Policy</h2>
          <p>At our core, we believe in maintaining simplicity and respecting your privacy. The only pieces of information we gather are essential for the smooth operation of our website. This includes Cookies, which help us personalize your gaming experience, and your username and password, ensuring secure access to our platform.</p>
        </div>
      </div>
    </div>
);

}

export default Dashboard;
