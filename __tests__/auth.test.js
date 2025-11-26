
const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const uniqueEmail = `register${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.userId).toBeDefined();
    });

    it('should fail if email already exists', async () => {
      const duplicateEmail = `duplicate${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          email: duplicateEmail,
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: duplicateEmail,
          password: 'password456'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });

    it('should fail if email or password missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `missing${Date.now()}@example.com`
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });
  });

  describe('POST /api/auth/login', () => {
    let loginEmail;

    beforeEach(async () => {
      loginEmail = `user${Date.now()}@test.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          email: loginEmail,
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginEmail,
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginEmail,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should fail if user not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should fail if email or password missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginEmail
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });
  });

  describe('GET /api/auth/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const uniqueEmail = `getuser${Date.now()}@test.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123'
        });
      userId = res.body.userId;
    });

    it('should get user by id', async () => {
      const res = await request(app)
        .get(`/api/auth/users/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.userId).toBe(userId);
      expect(res.body.email).toBeDefined();
    });

    it('should fail if user not found', async () => {
      const res = await request(app)
        .get('/api/auth/users/999999');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should fail if id not provided', async () => {
      const res = await request(app)
        .get('/api/auth/users/');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/auth/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const uniqueEmail = `updateuser${Date.now()}@test.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123'
        });
      userId = res.body.userId;
    });

    it('should update user email', async () => {
      const res = await request(app)
        .put(`/api/auth/users/${userId}`)
        .send({
          email: 'newemail@test.com'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User updated successfully');
      expect(res.body.email).toBe('newemail@test.com');
    });

    it('should update user password', async () => {
      const res = await request(app)
        .put(`/api/auth/users/${userId}`)
        .send({
          password: 'newpassword123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User updated successfully');
    });

    it('should fail if user not found', async () => {
      const res = await request(app)
        .put('/api/auth/users/999999')
        .send({
          email: 'test@test.com'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should fail if email already in use', async () => {
      const existingEmail = `another${Date.now()}@test.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          email: existingEmail,
          password: 'password123'
        });

      const res = await request(app)
        .put(`/api/auth/users/${userId}`)
        .send({
          email: existingEmail
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email already in use');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
    });
  });
});
