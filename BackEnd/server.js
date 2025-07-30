const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

//LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', username);

  if (username === 'admin' && password === '1234') {
    console.log('Login success for', username);
    res.json({ success: true, message: 'Login success!' });
  } else {
    console.log('Login failed for', username);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});