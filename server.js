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

app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Login API</title>
      <style>
        body { font-family: Arial; max-width: 600px; margin: 30px auto; background: #f5f5f5; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; color: #555; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        button { padding: 10px 20px; margin-top: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; }
        .register-btn { background: #4CAF50; }
        .login-btn { background: #2196F3; }
        .result { margin-top: 20px; padding: 15px; border-radius: 4px; display: none; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .token { word-break: break-all; font-family: monospace; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Login API Test</h1>
        
        <h2>Register</h2>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" id="regEmail" placeholder="test@example.com">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" id="regPassword" placeholder="password123">
        </div>
        <button class="register-btn" onclick="register()">Register</button>

        <h2 style="margin-top: 30px;">Login</h2>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" id="loginEmail" placeholder="test@example.com">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" id="loginPassword" placeholder="password123">
        </div>
        <button class="login-btn" onclick="login()">Login</button>

        <div id="result" class="result"></div>
      </div>

      <script>
        async function register() {
          const email = document.getElementById('regEmail').value;
          const password = document.getElementById('regPassword').value;
          
          if (!email || !password) {
            showResult('Please fill all fields', false);
            return;
          }

          try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            showResult(JSON.stringify(data, null, 2), response.ok);
          } catch (err) {
            showResult('Error: ' + err.message, false);
          }
        }

        async function login() {
          const email = document.getElementById('loginEmail').value;
          const password = document.getElementById('loginPassword').value;
          
          if (!email || !password) {
            showResult('Please fill all fields', false);
            return;
          }

          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            showResult(JSON.stringify(data, null, 2), response.ok);
          } catch (err) {
            showResult('Error: ' + err.message, false);
          }
        }

        function showResult(message, success) {
          const resultDiv = document.getElementById('result');
          resultDiv.className = 'result ' + (success ? 'success' : 'error');
          resultDiv.innerHTML = '<strong>' + (success ? '✓ Success' : '✗ Error') + ':</strong><br><div class="token">' + message + '</div>';
          resultDiv.style.display = 'block';
        }
      </script>
    </body>
    </html>
  `);
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
