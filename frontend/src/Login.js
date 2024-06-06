import React, { useState } from 'react';
import axios from 'axios';
import { Form, FormGroup, Col, Row, Button } from 'reactstrap';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://p3s3b72sx9.execute-api.us-east-2.amazonaws.com/auth/login', { username, password });
            setToken(response.data.token);
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed!');
        }
    };

    return (
     <div>
        <Form  onSubmit={handleSubmit}>
            <Row>
                <h2>Login</h2>
            </Row>
            <Row className="row-cols-lg-auto g-3">
            <FormGroup>
                <Col md={6}>   
                    <input   type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    {' '}
                    <input  type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                </Col>           
            </FormGroup>

            </Row>
            <Button color="primary" outline  type="submit">Login</Button>

        </Form>
       </div> 
    );
};

export default Login;
