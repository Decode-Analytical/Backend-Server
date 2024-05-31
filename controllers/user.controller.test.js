const { signUp, userLogin } = require('../src/controllers/user.controller'); 
const bcrypt = require('bcryptjs');
const User = require('../src/models/user.model');
const Token = require('../src/models/token.model');
const sendEmail = require('../src/emails/email');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const httpMocks = require('node-mocks-http');


jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/models/user.model');
jest.mock('../src/models/token.model');
jest.mock('../src/emails/email');

describe('POST /signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and send a verification email', async () => {
    const req = mockRequest({
      body: {
        firstName: 'Kunle',
        lastName: 'Ajayi',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123@'
      }
    });
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'userId', email: 'test@example.com', firstName: 'Kunle', lastName: 'Ajayi' });
    Token.create.mockResolvedValue({ token: 'jwtoken', userId: 'userId' });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User created'
    }));
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(Token.create).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if user already exists', async () => {
    const req = mockRequest({
      body: {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123@'
      }
    });
    const res = mockResponse();

    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User already exists'
    }));
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should return 400 if phone number already exists', async () => {
    const req = mockRequest({
      body: {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123@'
      }
    });
    const res = mockResponse();

    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ phoneNumber: '1234567890' });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Phone number already exists'
    }));
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should return 400 if password does not meet criteria', async () => {
    const req = mockRequest({
      body: {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'password'
      }
    });
    const res = mockResponse();

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Password must contain at least one capital letter and one number and special character'
    }));
    expect(User.findOne).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should return 500 on server error', async () => {
    const req = mockRequest({
      body: {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'Password123!'
      }
    });
    const res = mockResponse();

    User.findOne.mockRejectedValue(new Error('Server error'));

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Internal server error'
    }));
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.create).not.toHaveBeenCalled();
    expect(Token.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});





// describe('userLogin', () => {
//     let req, res;

//     beforeEach(() => {
//         req = httpMocks.createRequest();
//         res = httpMocks.createResponse();
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should return 400 if user does not exist', async () => {
//         User.findOne.mockResolvedValue(null);
//         req.body = { email: 'test@example.com', password: 'Password123@' };

//         await userLogin(req, res);

//         expect(res.statusCode).toBe(400);
//         expect(res._getJSONData()).toEqual({ message: 'User does not exist' });
//     });

//     it('should return 400 if password is incorrect', async () => {
//         const user = { email: 'test@example.com', password: 'hashedPassword' };
//         User.findOne.mockResolvedValue(user);
//         bcrypt.compare.mockResolvedValue(false);
//         req.body = { email: 'test@example.com', password: 'Password123@' };

//         await userLogin(req, res);

//         expect(res.statusCode).toBe(400);
//         expect(res._getJSONData()).toEqual({ message: 'Incorrect credentials' });
//     });

//     it('should return 400 if email is not verified', async () => {
//         const user = { email: 'test@example.com', password: 'hashedPassword', isEmailActive: false };
//         User.findOne.mockResolvedValue(user);
//         bcrypt.compare.mockResolvedValue(true);
//         req.body = { email: 'test@example.com', password: 'Password123@' };

//         await userLogin(req, res);

//         expect(res.statusCode).toBe(400);
//         expect(res._getJSONData()).toEqual({ message: 'Your account is pending. kindly check your email inbox and verify it' });
//     });

//     it('should return 200 and token if login is successful', async () => {
//         const user = { _id: 'userId', email: 'test@example.com', password: 'hashedPassword', isEmailActive: true };
//         User.findOne.mockResolvedValue(user);
//         bcrypt.compare.mockResolvedValue(true);
//         Token.mockReturnValue('mockToken');
//         req.body = { email: 'test@example.com', password: 'Password123@' };

//         await userLogin(req, res);

//         expect(res.statusCode).toBe(200);
//         expect(res._getJSONData()).toEqual({
//             message: 'User logged in successfully',
//             token: 'mockToken',
//             user
//         });
//     });

//     it('should return 500 if there is a server error', async () => {
//         User.findOne.mockRejectedValue(new Error('Server error'));
//         req.body = { email: 'test@example.com', password: 'Password123@' };

//         await userLogin(req, res);

//         expect(res.statusCode).toBe(500);
//         expect(res._getJSONData()).toEqual({
//             message: 'Error while logging in',
//             error: 'Server error'
//         });
//     });
// });
