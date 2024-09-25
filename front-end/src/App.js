import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3306')
      .then(response => setMessage(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <Button variant="contained" color="primary">
        Shop Now
      </Button>
    </div>
  );
}
 
export default App;