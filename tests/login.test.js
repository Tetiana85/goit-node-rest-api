import controllers from "../controllers/authControllers.js";
import User from "../models/users";
import HttpError from "../helpers/HttpError";
import jwt from "jsonwebtoken";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const login = ctrlWrapper(controllers.login);

jest.mock("../models/users");
jest.mock("jsonwebtoken");

describe("login controller", () => {
  it("should respond with status code 200", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockUser = {
      _id: "1",
      email: req.body.email,
      password: "$2b$10$7EvDt53YfRivDgE4ev0Beu6xOZpk/0wQTVIFQDQvuO5h0t6I7Ureu", // bcrypt hash for 'password123'
      subscription: "starter",
    };

    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue("fakeToken");
    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    await login(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(User.findOne()).resolves.toEqual(mockUser);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
      user: {
        email: req.body.email,
        subscription: "starter",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw HttpError(401, "Email or password is wrong") if user not found', async () => {
    const req = {
      body: {
        email: "notfound@example.com",
        password: "password123",
      },
    };
    const res = {
      json: jest.fn(),
    };
    const next = jest.fn();

    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      HttpError(401, "Email or password is wrong")
    );
  });

  it('should throw HttpError(401, "Email or password is wrong") if password does not match', async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "wrongpassword",
      },
    };
    const res = {
      json: jest.fn(),
    };
    const next = jest.fn();

    User.findOne.mockResolvedValue({
      _id: "1",
      email: req.body.email,
      password: "password123",
      password: "$2b$10$7EvDt53YfRivDgE4ev0Beu6xOZpk/0wQTVIFQDQvuO5h0t6I7Ureu", // bcrypt hash for 'password123'
      subscription: "starter",
    });

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      HttpError(401, "Email or password is wrong")
    );
  });
});
