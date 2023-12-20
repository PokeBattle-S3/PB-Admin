import React from "react";
import { Link, useNavigate} from "react-router-dom";

import { useEffect, useState } from 'react';
import '../App.css';

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getLocalUser();
  }, []);
  // If local user was found redirect to lamps page

  function logout() {
    localStorage.removeItem('user');
    navigate("/login")
  }

  function getLocalUser() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
    catch (e) {
      // Couldn't find user in localstorage
      console.log(e);
    }
  }

  return (
    <>
      <nav id="navbar" className="navbar">
        <p>PokeBattle</p>
        <Link className="link" to="/" >
          <p>Dashboard</p>
        </Link>
        {user ?
          <Link className="link" onClick={logout} >
            <p>Logout</p>
          </Link>
          :
          <Link className="link" to="/login" >
            <p>Login</p>
          </Link>
        }

      </nav>
    </>
  );
}

export default NavBar;
