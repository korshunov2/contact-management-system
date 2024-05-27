const express = require('express');
const verifyToken = require('../middleware/auth');
const Contact = require('../models/Contact');

const router = express.Router();

// Create a contact
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, phone, email, address, notes, birthday } = req.body;
        const newContact = await Contact.create({ name, phone, email, address, notes, birthday });
        res.json(newContact);
    } catch (err) {
        console.error('Error creating contact:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message, request_body: req.body });
    }
});

// Get all contacts
router.get('/', verifyToken, async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (err) {
        console.error('Error retrieving contacts:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get a specific contact by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        console.error('Error retrieving contact:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update a contact
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        const { name, phone, email, address, notes, birthday } = req.body;
        await contact.update({ name, phone, email, address, notes, birthday });
        res.json(contact);
    } catch (err) {
        console.error('Error updating contact:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete a contact
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        await contact.destroy();
        res.json({ msg: 'Contact removed' });
    } catch (err) {
        console.error('Error deleting contact:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
