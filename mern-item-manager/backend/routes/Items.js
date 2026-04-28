const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
// GET all items
router.get('/', async (req, res) => {
try {
const items = await Item.find();
res.json(items);
} catch (err) {
res.status(500).json({ message: err.message });
}
});
// POST create item
router.post('/', async (req, res) => {
const item = new Item({
name: req.body.name,
description: req.body.description,
price: req.body.price,   
 // will work once you add price to the model
});
try {
const newItem = await item.save();
res.status(201).json(newItem);
} catch (err) {
res.status(400).json({ message: err.message });
}
});
// DELETE item
router.delete('/:id', async (req, res) => {
try {
await Item.findByIdAndDelete(req.params.id);
res.json({ message: 'Item deleted' });
} catch (err) {
res.status(500).json({ message: err.message });
}
});
// PUT update item
router.put('/:id', async (req, res) => {
try {
const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.status(200).json(updated);
} catch (err) {
res.status(400).json({ message: err.message });
}
});
module.exports = router;