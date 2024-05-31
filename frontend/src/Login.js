import React, { useState } from 'react';
import axios from 'axios';

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
        <div class="container">
        <form  onSubmit={handleSubmit}>
            <div class="row">
                <h2>Login</h2>
            </div>
            <div class="row">
                <div class="col">   
                    <input  class="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div class="col">
                    <input class="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="col">
                    <button class="btn btn-primary" type="submit">Login</button>
                </div>
           
            </div>
        </form>
        </div>
    );
};

export default Login;
