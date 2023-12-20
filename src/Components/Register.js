import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import '../App.css';
import io from 'socket.io-client';
import WebSocketConfig from './WebSocketConfig';

const socket = io.connect(WebSocketConfig.url);

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        // Prevent page refresh on submit
        e.preventDefault();
        setError('');
        if (username == "" || password == "") {
            setError("Fill in each field");
            return;
        }
        if (password != password2) {
            setError("Passwords do not match");
            return;
        }
        socket.emit('register_user', {
            username: username,
            email: email,
            password: password
        }, cb => {
            console.log(cb)
            if (cb == 0) {
                setError("Create user failed");
            }
            else{
                navigate('/login');
            }
        });
    }

    return (
        <>
            <div className="registerscreen">
                <div className='registerscreen-container'>
                    <form onSubmit={handleSubmit} className='form'>
                        <h2 className="form-title">register</h2>
                        <p className="form-text">Register to play the game</p>
                        {error && (
                            <p className='error'>{error}</p>
                        )}
                        <div className="form-input-wrapper">
                            <input className='form-input' type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="form-input-wrapper">
                            <input className='form-input' type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-input-wrapper">
                            <input className='form-input' type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-input-wrapper">
                            <input className='form-input' type="password2" placeholder="re-type password" onChange={(e) => setPassword2(e.target.value)} />
                        </div>
                        <input type="submit" className='form-submit' value={"register"} />
                        <Link className='form-link' to="/login">Login</Link>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;