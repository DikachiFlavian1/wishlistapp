import React, { useState, useEffect } from 'react';
import './App.css';
import Wishlist from './components/wishlist';
import Login from './components/login';
import Register from './components/Register';

function App() {
  const [wishlists, setWishlists] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Store token in local storage
  const [showRegister, setShowRegister] = useState(false); // Toggle between login and register forms

  // Fetch wishlists when the user logs in or the token changes
  useEffect(() => {
    if (token) {
      const fetchWishlists = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/wishlist', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch wishlists');
          }
  
          const data = await response.json();
          setWishlists(data); // Update local state with wishlists from the backend
        } catch (error) {
          console.error('Error fetching wishlists:', error);
        }
      };
  
      fetchWishlists();
    }
  }, [token]); // Add `token` as a dependency

  // Add a new wishlist
  const handleAdd = async (newWishlist) => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newWishlist }),
      });

      if (!response.ok) {
        throw new Error('Failed to add wishlist');
      }

      const data = await response.json();
      setWishlists([...wishlists, data]); // Update local state with the new wishlist from the backend
    } catch (error) {
      console.error('Error adding wishlist:', error);
    }
  };

  // Update a wishlist
  const handleUpdate = async (id, newText) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      const data = await response.json();
      const updatedWishlists = wishlists.map((item) =>
        item.id === id ? { ...item, text: data.text } : item
      );
      setWishlists(updatedWishlists); // Update local state with the updated wishlist from the backend
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Delete a wishlist
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete wishlist');
      }

      const filteredWishlists = wishlists.filter((item) => item.id !== id);
      setWishlists(filteredWishlists); // Update local state by removing the deleted wishlist
    } catch (error) {
      console.error('Error deleting wishlist:', error);
    }
  };

  // Handle user login
  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Store token in local storage
    setToken(token);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken('');
    setWishlists([]); // Clear wishlists on logout
  };

  return (
    <div className="App">
      <h1>Wishlist App</h1>
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Wishlist
            wishlists={wishlists}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <>
          {showRegister ? (
            <Register onRegister={() => setShowRegister(false)} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;

/*import React, { useState } from 'react';
import './App.css';
import Wishlist from './components/wishlist';
import Login from './components/login';
import Register from './components/Register';

function App() {
  const [wishlists, setWishlists] = useState([
    { id: 1, text: 'I wish to be forever' },
    { id: 2, text: 'wishlist2' },
    { id: 3, text: 'wishlist3' },
  ]);
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Store token in local storage
  const [showRegister, setShowRegister] = useState(false); // Toggle between login and register forms

  const handleAdd = (newWishlist) => {
    const newWishlistItem = {
      id: Date.now(),
      text: newWishlist,
    };
    setWishlists([...wishlists, newWishlistItem]);
  };

  const handleUpdate = (id, newText) => {
    const updatedWishlists = wishlists.map((item) =>
      item.id === id ? { ...item, text: newText } : item
    );
    setWishlists(updatedWishlists);
  };

  const handleDelete = (id) => {
    const filteredWishlists = wishlists.filter((item) => item.id !== id);
    setWishlists(filteredWishlists);
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Store token in local storage
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken('');
  };

  return (
    <div className="App">
      <h1>Wishlist App</h1>
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Wishlist
            wishlists={wishlists}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <>
          {showRegister ? (
            <Register onRegister={() => setShowRegister(false)} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;*/