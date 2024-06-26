import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Form, Col, Row, Button, Container, Input } from 'reactstrap';

const ContactManagement = ({ token }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newContact, setNewContact] = useState(null);
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');

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

    const handleAiQueryChange = (e) => {
        setAiQuery(e.target.value);
    };

    const handleAiQuerySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/ai/query', 
            { 
                query: aiQuery, 
                contacts: contacts 
            }, 
            {
                headers: { 'x-auth-token': token }
            });
            setAiResponse(response.data.choices[0].message.content.trim());
        } catch (error) {
            console.error('Error making AI query:', error);
        }
    };

    return (
        <div>
            <Container>
            <h2>Contacts</h2>
            <Row className="row-cols-lg-auto">
                <Col>
                    <Input className="form-control"
                        type="text"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={handleSearch}
                    />
            </Col>
            <Col>
                <Button color="primary" outline onClick={handleAddNewContact}>Add New Contact</Button>
                </Col>
            </Row>
            <Form onSubmit={handleAiQuerySubmit} >
            <Row className="row-cols-lg-auto g-3 mt-3">
                <Col xs={10}>
                    <Input className="form-control"
                        type="text"
                        placeholder="Ask AI about contacts..."
                        value={aiQuery}
                        onChange={handleAiQueryChange}
                    />
                </Col>
                <Col xs={2}>
                    <Button color="primary" outline type="submit">Ask AI</Button>
                </Col>          
            </Row>
            </Form>
            <Row>
            {aiResponse && <div><strong>AI Response:</strong> {aiResponse}</div>}

            </Row>
            <Row className="row-cols-lg-auto g-3 mt-3">
            <table className="table table-bordered table-striped table-hover">
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
                                <Button color="primary" outline type="button" onClick={() => setSelectedContact(contact)}>Edit</Button>{' '}
                                <Button  color="danger" type="button" onClick={() => handleDelete(contact.id)}>Delete</Button>
                            </td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
            </Row>
            {(selectedContact || newContact) && (
                <Form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(6, auto)' }}>
                    <h2 style={{ gridColumn: 'span 2' }}>{selectedContact ? 'Edit Contact' : 'Add New Contact'}</h2>
                    <Input className="form-control" type="text" name="first_name" placeholder="First Name" value={selectedContact ? selectedContact.first_name : newContact.first_name} onChange={handleChange} />
                    <Input className="form-control" type="text" name="last_name" placeholder="Last Name" value={selectedContact ? selectedContact.last_name : newContact.last_name} onChange={handleChange} />
                    <Input className="form-control" type="text" name="phone" placeholder="Phone" value={selectedContact ? selectedContact.phone : newContact.phone} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <Input className="form-control" type="email" name="email" placeholder="Email" value={selectedContact ? selectedContact.email : newContact.email} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <Input className="form-control" type="text" name="address" placeholder="Address" value={selectedContact ? selectedContact.address : newContact.address} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <textarea className="form-control" name="notes" placeholder="Notes" value={selectedContact ? selectedContact.notes : newContact.notes} onChange={handleChange} rows="4" cols="50" style={{ gridColumn: 'span 2' }}></textarea>
                    <Input className="form-control" type="date" name="birthday" value={selectedContact ? selectedContact.birthday : newContact.birthday} onChange={handleChange} style={{ gridColumn: 'span 2' }} />
                    <Button color="primary" outline type="submit" style={{ gridColumn: 'span 1' }}>{selectedContact ? 'Save' : 'Add Contact'}</Button>
                    {(selectedContact || newContact) && <Button color="primary" outline type="button" onClick={handleCancel} style={{ gridColumn: 'span 1' }}>Cancel</Button>}
                </Form>
            )}
            </Container>
        </div>
    );
};

ContactManagement.propTypes = {
    token: PropTypes.string.isRequired
};

export default ContactManagement;