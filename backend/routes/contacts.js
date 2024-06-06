const express = require('express');
const verifyToken = require('../middleware/auth');
const Contact = require('../models/Contact');
const { Sequelize, Op, fn, col } = require('sequelize'); // Add Sequelize to require statement
const sequelize = require('../config/db'); // Ensure sequelize instance is required

const router = express.Router();

// Create a contact
router.post('/', verifyToken, async (req, res) => {
    try {
        const { first_name, last_name, phone, email, address, notes, birthday } = req.body;
        const newContact = await Contact.create({ first_name, last_name, phone, email, address, notes, birthday });
        res.json(newContact);
    } catch (err) {
        console.error('Error creating contact:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get all contacts or filtered contacts
router.get('/', async (req, res) => {
    try {
        const { fname, lname, dobmonth } = req.query;
        let query = 'SELECT * FROM contacts WHERE 1=1';
        const replacements = {};

        if (fname) {
            query += ' AND first_name LIKE :fname';
            replacements.fname = `%${fname}%`;
        }

        if (lname) {
            query += ' AND last_name LIKE :lname';
            replacements.lname = `%${lname}%`;
        }

        if (dobmonth) {
            query += ' AND MONTH(birthday) = :dobmonth';
            replacements.dobmonth = dobmonth;
        }

        const contacts = await sequelize.query(query, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        res.json(contacts);
    } catch (error) {
        console.error('Error retrieving contacts:', error.message);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
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
        const { first_name, last_name, phone, email, address, notes, birthday } = req.body;
        await contact.update({ first_name, last_name, phone, email, address, notes, birthday });
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
