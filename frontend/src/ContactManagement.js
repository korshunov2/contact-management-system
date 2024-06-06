import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManagement = ({ token }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newContact, setNewContact] = useState(null);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/contacts', {
                headers: { 'x-auth-token': token }
            });
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [token]);

    useEffect(() => {
        const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
        setFilteredContacts(
            contacts.filter(contact => {
                const month = new Date(contact.birthday).getMonth() + 1;
                return month === currentMonth;
            })
        );
    }, [contacts]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setFilteredContacts(
            contacts.filter(contact => 
                `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(e.target.value.toLowerCase()) ||
                contact.email.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (selectedContact) {
            setSelectedContact({ ...selectedContact, [name]: value });
        } else if (newContact) {
            setNewContact({ ...newContact, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedContact) {
            try {
                await axios.put(`https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/contacts/${selectedContact.id}`, selectedContact, {
                    headers: { 'x-auth-token': token }
                });
                setContacts(contacts.map(contact => contact.id === selectedContact.id ? selectedContact : contact));
                setSelectedContact(null);
            } catch (error) {
                console.error('Error updating contact:', error);
            }
        } else if (newContact) {
            try {
                const response = await axios.post('https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/contacts', newContact, {
                    headers: { 'x-auth-token': token }
                });
                setContacts([...contacts, response.data]);
                setNewContact(null);
            } catch (error) {
                console.error('Error creating contact:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/contacts/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setContacts(contacts.filter(contact => contact.id !== id));
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleCancel = () => {
        setSelectedContact(null);
        setNewContact(null);
    };

    const handleAddNewContact = () => {
        setSelectedContact(null);
        setNewContact({
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            address: '',
            notes: '',
            birthday: ''
        });
    };

    return (
        <div>
            <h2>Contacts</h2>
            <input class="form-control"
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={handleSearch}
            />
            <button onClick={handleAddNewContact}>Add New Contact</button>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Birthday</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.first_name}</td>
                            <td>{contact.last_name}</td>
                            <td>{contact.birthday}</td>
                            <td>
                                <button class="btn btn-outline-secondary mr-3" type="button" onClick={() => setSelectedContact(contact)}>Edit</button>
                                <button class="btn btn-outline-secondary" type="button" onClick={() => handleDelete(contact.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(selectedContact || newContact) && (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(6, auto)' }}>
                    <h2 style={{ gridColumn: 'span 2' }}>{selectedContact ? 'Edit Contact' : 'Add New Contact'}</h2>
                    <input type="text" name="first_name" placeholder="First Name" value={selectedContact ? selectedContact.first_name : newContact.first_name} onChange={handleChange} />
                    <input type="text" name="last_name" placeholder="Last Name" value={selectedContact ? selectedContact.last_name : newContact.last_name} onChange={handleChange} />
                    <input type="text" name="phone" placeholder="Phone" value={selectedContact ? selectedContact.phone : newContact.phone} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <input type="email" name="email" placeholder="Email" value={selectedContact ? selectedContact.email : newContact.email} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <input type="text" name="address" placeholder="Address" value={selectedContact ? selectedContact.address : newContact.address} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <textarea name="notes" placeholder="Notes" value={selectedContact ? selectedContact.notes : newContact.notes} onChange={handleChange} rows="4" cols="50" style={{ gridColumn: 'span 2' }}></textarea>
                    <input type="date" name="birthday" value={selectedContact ? selectedContact.birthday : newContact.birthday} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <button type="submit" style={{ gridColumn: 'span 1' }}>{selectedContact ? 'Save' : 'Add Contact'}</button>
                    {(selectedContact || newContact) && <button type="button" onClick={handleCancel} style={{ gridColumn: 'span 1' }}>Cancel</button>}
                </form>
            )}
        </div>
    );
};

export default ContactManagement;