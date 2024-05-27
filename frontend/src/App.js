import React, { useState } from 'react';
import Login from './Login';
import ContactManagement from './ContactManagement';

function App() {
    const [token, setToken] = useState('');

    return (
        <div className="App">
            {token ? <ContactManagement token={token} /> : <Login setToken={setToken} />}
        </div>
    );
}

export default App;
