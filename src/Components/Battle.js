import '../App.css';
import React from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import WebSocketConfig from './WebSocketConfig';
const socket = io.connect(WebSocketConfig.url);


function Battle() {
  const { roomId } = useParams();

  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const localuser = JSON.parse(localStorage.getItem('user'));

  const findRooms = () => {
    socket.emit("get_rooms", cb => {
      console.log(cb)
    });
  }

  // When you get to this page, get all users in the room
  useEffect(() => {
    socket.emit("get_room_users", roomId, users => {
      //check each user, if it's not you, set it as opponent

      if(users.length == 1){
        setUser1(localuser.username);
        setUser2("Waiting for opponent");
      }
      else if (users[0].id != localuser.id){
        setUser1(users[0].username);
        setUser2(localuser.username)
      }
    });
  }, [roomId]);


  // When socket detects a new user, set it as opponent
  useEffect(() => {
    socket.on('user_joined', (user) => {
      if (localuser.id !== user.id) {
        console.log("user joined")
        setUser2(user.username);
      }
    });
  }, [socket]);

  const findBattle = () => {
    console.log("find battle")
    socket.emit("get_rooms", cb => {
      console.log(cb)
    });
  }

  return (
    <div className='Battlescreen'>
      <div className='BattlescreenLeft'>
        <h2>Room id: {roomId}</h2>
        <div className='users'>
          <p>{user1}</p> <h1>vs</h1> <p>{user2}</p>
        </div>
        <div className='Battle'>
          <div className='sprites'></div>
          <div className='moves'></div>
        </div>
      </div>

      <div className='BattlescreenRight'>
      <button onClick={findBattle}>New Battle</button>
      <button onClick={findRooms}>rooms</button>
        <button>Private battle</button>
        <button>Leaderboard</button>
      </div>
    </div>
  );
}

export default Battle;
