import React, { useState } from 'react';

const Wishlist = ({ wishlists, onAdd, onUpdate, onDelete }) => {
  const [wishlist, setWishlist] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setWishlist(event.target.value);
    setError(''); // Clear any previous error
  };

  const handleSend = () => {
    if (wishlist.trim() === '') {
      setError('Wishlist cannot be empty');
      return;
    }

    onAdd(wishlist); // Call the onAdd function passed from App.js
    setWishlist(''); // Clear the input field
  };

  const handleUpdate = (id, newText) => {
    if (newText === null || newText.trim() === '') {
      return; // Do nothing if the user cancels or enters an empty string
    }
    onUpdate(id, newText); // Call the onUpdate function passed from App.js
  };

  return (
    <div>
      <div className="wishlist-input">
        <input
          type="text"
          value={wishlist}
          onChange={handleInputChange}
          placeholder="Input your wishlist here"
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="wishlists">
        {wishlists.map((item) => (
          <div key={item.id} className="wishlist-item">
            <span>{item.text}</span>
            <div>
              <button onClick={() => handleUpdate(item.id, prompt('Update your wish:', item.text))}>
                Update
              </button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;