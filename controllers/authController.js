
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

const register = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { id: Date.now().toString(), email, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: 'User registered successfully', userId: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const getUserById = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) {
      if (users.find(u => u.email === email && u.id !== id)) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    res.json({ message: 'User updated successfully', userId: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const getUsers = () => users;

module.exports = { register, login, getUserById, updateUser, getUsers };
