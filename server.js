require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login App</title>
      <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
        h1 { color: #333; }
        .section { margin: 20px 0; }
        .btn { padding: 10px 20px; margin: 5px; cursor: pointer; border: none; border-radius: 5px; }
        .register { background: #4CAF50; color: white; }
        .login { background: #2196F3; color: white; }
        .health { background: #FF9800; color: white; }
        a { text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Login API</h1>
        <p>Welcome to the Login Application</p>
        
        <div class="section">
          <h2>API Endpoints:</h2>
          <p><strong>POST</strong> /api/auth/register - Create new account</p>
          <p><strong>POST</strong> /api/auth/login - Login to account</p>
          <p><strong>GET</strong> /health - Check server status</p>
        </div>

        <div class="section">
          <h2>Quick Test:</h2>
          <a href="/health"><button class="btn health">Health Check</button></a>
        </div>

        <div class="section">
          <p style="color: #666; font-size: 12px;">Use Postman or curl to test POST endpoints</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
