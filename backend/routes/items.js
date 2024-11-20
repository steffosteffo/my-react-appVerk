const express = require('express');
const router = express.Router();
const Item = require('../models/Item');



  



// Borrow an item
router.post('/borrow/:id', async (req, res) => {
  const { borrower } = req.body;
  const date = new Date().toLocaleDateString();

  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.borrower = borrower;
    item.borrowed = true;
    item.dateBorrowed = date;
    item.history.push({ borrower, dateBorrowed: date });

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error borrowing item', error });
  }
});

// Return an item
router.post('/return/:id', async (req, res) => {
  const date = new Date().toLocaleDateString();

  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.borrower = '';
    item.borrowed = false;
    item.dateBorrowed = '';
    item.history[item.history.length - 1].dateReturned = date;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error returning item', error });
  }
});

// Get all items


router.get('/', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      if (error.name === 'CastError') {
        res.status(400).json({ message: 'Invalid ObjectId format' });
      } else {
        res.status(500).json({ message: 'Error fetching items', error });
      }
    }
  });


// Add new item
router.post('/', async (req, res) => {
    try {
      const newItem = new Item({
        name: req.body.name,
        borrower: req.body.borrower || '',
        borrowed: req.body.borrowed || false,
        dateBorrowed: req.body.dateBorrowed || '',
        history: req.body.history || [],
        type: req.body.type,
      });
  
      const savedItem = await newItem.save();
      res.status(201).json(savedItem); // Send the saved item back in the response
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ message: 'Error adding item', error });
    }
  });

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully', item });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Error deleting item', error });
    }
  });
  
module.exports = router;
