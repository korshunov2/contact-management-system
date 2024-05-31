import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManagement = ({ token }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newContact, setNewContact] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        birthday: ''
    });

    useEffect(() => {
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

        fetchContacts();
    }, [token]);

    useEffect(() => {
        setFilteredContacts(
            contacts.filter(contact => 
                `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
                contact.email.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, contacts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (selectedContact) {
            setSelectedContact({ ...selectedContact, [name]: value });
        } else {
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
        } else {
            try {
                const response = await axios.post('https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/contacts', newContact, {
                    headers: { 'x-auth-token': token }
                });
                setContacts([...contacts, response.data]);
                setNewContact({ first_name: '', last_name: '', phone: '', email: '', address: '', notes: '', birthday: '' });
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
    };

    return (
        <div>
            <h2>Contacts</h2>
            <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.first_name}</td>
                            <td>{contact.last_name}</td>
                            <td>{contact.email}</td>
                            <td>
                                <button onClick={() => setSelectedContact(contact)}>Edit</button>
                                <button onClick={() => handleDelete(contact.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedContact ? (
                <form onSubmit={handleSubmit}>
                    <h2>Edit Contact</h2>
                    <input type="text" name="first_name" placeholder="First Name" value={selectedContact.first_name} onChange={handleChange} />
                    <input type="text" name="last_name" placeholder="Last Name" value={selectedContact.last_name} onChange={handleChange} />
                    <input type="text" name="phone" placeholder="Phone" value={selectedContact.phone} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" value={selectedContact.email} onChange={handleChange} />
                    <input type="text" name="address" placeholder="Address" value={selectedContact.address} onChange={handleChange} />
                    <input type="text" name="notes" placeholder="Notes" value={selectedContact.notes} onChange={handleChange} />
                    <input type="date" name="birthday" value={selectedContact.birthday} onChange={handleChange} />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2>Add New Contact</h2>
                    <input type="text" name="first_name" placeholder="First Name" value={newContact.first_name} onChange={handleChange} />
                    <input type="text" name="last_name" placeholder="Last Name" value={newContact.last_name} onChange={handleChange} />
                    <input type="text" name="phone" placeholder="Phone" value={newContact.phone} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" value={newContact.email} onChange={handleChange} />
                    <input type="text" name="address" placeholder="Address" value={newContact.address} onChange={handleChange} />
                    <input type="text" name="notes" placeholder="Notes" value={newContact.notes} onChange={handleChange} />
                    <input type="date" name="birthday" value={newContact.birthday} onChange={handleChange} />
                    <button type="submit">Add Contact</button>
                </form>
            )}
        </div>
    );
};

export default ContactManagement;
