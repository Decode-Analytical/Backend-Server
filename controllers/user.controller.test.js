const request = require('supertest');
const app = require('../app'); 
const bcrypt = require('bcryptjs');
const User = require('../src/models/user.model'); 
const Token = require('../src/models/token.model'); 
const sendEmail = require('../src/emails/email'); 

jest.mock('../src/models/user.model');
jest.mock('../src/models/token.model');
jest.mock('../src/emails/email');

describe('POST /signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and send a verification email', async () => {
    User.findOne.mockResolvedValue(null); 
    User.create.mockResolvedValue({ _id: 'userId', email: 'test@example.com', firstName: 'Kunle', lastName: 'Ajayi' });
    Token.create.mockResolvedValue({ token: 'jwtoken', userId: 'userId' });

    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'Kunle',
        lastName: 'Ajayi',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123@'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(Token.create).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' }); // Mock existing user

    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123@'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should return 400 if phone number already exists', async () => {
    User.findOne
      .mockResolvedValueOnce(null) 
      .mockResolvedValueOnce({ phoneNumber: '1234567890' });

    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123@'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Phone number already exists');
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should return 400 if password does not meet criteria', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'password'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password must contain at least one capital letter and one number and special character');
    expect(User.findOne).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should return 500 on server error', async () => {
    User.findOne.mockRejectedValue(new Error('Server error'));

    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123!'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
