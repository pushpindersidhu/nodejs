const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../../middlewares/auth");

describe("auth middleware", () => {
    it("should return 401 if no token", () => {
        const req = {
            header: () => {
                return null;
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            "No token, authorization denied."
        );
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 if invalid token", () => {
        const req = {
            header: () => {
                return "sidhu";
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Invalid token.");
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if token is valid", () => {
        const req = {
            header: () => {
                return jwt.sign({ _id: "007" }, config.get("jwtPrivateKey"));
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        auth(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
