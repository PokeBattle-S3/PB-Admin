import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';	
import '../App.css';
import io from 'socket.io-client';
import WebSocketConfig from './WebSocketConfig';

const socket = io.connect(WebSocketConfig.url);

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        // Prevent page refresh on submit
        e.preventDefault();
        setError('');
        if (username == "" || password == "") {
            setError("Vul alle velden in");
            return;
        }
        socket.emit('login_user', {
          username: username,
          password: password
        }, cb => {
            if (cb == 0) {
                setError("Gebruikersnaam of wachtwoord is onjuist");
            }
            else{
                localStorage.setItem("user", JSON.stringify(cb));
                navigate('/dashboard');
            }
        });
    }

    return (
        <>
            <div className="loginscreen">
                <div className='loginscreen-container'>
                    <form onSubmit={handleSubmit} className='form'>
                        <h2 className="form-title">Login</h2>
                        <p className="form-text">Login to access the admin dashboard</p>
                        {error && (
                            <p className='error'>{error}</p>
                        )}
                        <div className="form-input-wrapper">
                            <input className='form-input' type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-input-wrapper">
                            <input className='form-input' type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <input type="submit" className='form-submit' value={"Login"} />
                        <p className="form-text">Forgot password <a className='form-link' href="mailto:i493302@fhict.nl?subject=Wachtwoord aanvragen&body=Ik ben mijn wachtwoord vergeten, mijn gebruikersnaam is:">Recover</a></p>
                        <Link className='form-link' to="/register">Register</Link>
                    </form>
                </div>
            </div>
        </>
        );
    }

export default Login;