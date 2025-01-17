import express from 'express';
import pool from '../db.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Get all wishlists for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const wishlists = await pool.query('SELECT * FROM wishlists WHERE user_id = $1', [req.userId]);
    res.json(wishlists.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new wishlist
router.post('/', authenticate, async (req, res) => {
  const { text } = req.body;

  try {
    const newWishlist = await pool.query(
      'INSERT INTO wishlists (user_id, text) VALUES ($1, $2) RETURNING *',
      [req.userId, text]
    );
    res.json(newWishlist.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a wishlist
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedWishlist = await pool.query(
      'UPDATE wishlists SET text = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [text, id, req.userId]
    );
    res.json(updatedWishlist.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a wishlist
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM wishlists WHERE id = $1 AND user_id = $2', [id, req.userId]);
    res.json({ message: 'Wishlist deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;