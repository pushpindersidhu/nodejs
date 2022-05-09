const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

let server;

describe("/api/users", () => {
    beforeEach(async () => {
        server = require("../../../index");
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
        server.close();
    });

    describe("User", () => {
        it("should create a user", async () => {
            const user = new User({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const result = await user.save();
            expect(result).toBeDefined();
            expect(result.username).toBe("sidhu");
            expect(result.email).toBe("sidhu@sidhu.com");
            expect(result.password).toBeDefined();
            expect(result._id).toBeDefined();
        });

        it("should return an error if the username is less than 3 characters", async () => {
            const user = new User({
                username: "",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            await expect(user.validate()).rejects.toThrow(
                mongoose.Error.ValidationError
            );
        });

        it("should return an error if the username is more than 20 characters", async () => {
            const user = new User({
                username: new Array(22).join("a"),
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            await expect(user.validate()).rejects.toThrow(
                mongoose.Error.ValidationError
            );
        });

        it("should return an error if the email is less than 3 characters", async () => {
            const user = new User({
                username: "sidhu",
                email: "",
                password: "123456",
            });

            await expect(user.validate()).rejects.toThrow(
                mongoose.Error.ValidationError
            );
        });

        it("should return an error if the email is more than 50 characters", async () => {
            const user = new User({
                username: "sidhu",
                email: new Array(52).join("a"),
                password: "123456",
            });

            await expect(user.validate()).rejects.toThrow(
                mongoose.Error.ValidationError
            );
        });

        it("should return an error if the password is less than 6 characters", async () => {
            const user = new User({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "",
            });

            await expect(user.validate()).rejects.toThrow(
                mongoose.Error.ValidationError
            );
        });

        it("should return an error if the password is more than 255 characters", async () => {
            const user = new User({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: new Array(257).join("a"),
            });

            await expect(user.validate()).rejects.toThrow(
                mongoose.Error.ValidationError
            );
        });

        it("should not create a user if the username is already taken", async () => {
            await new User({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            }).save();

            const user = new User({
                username: "sidhu",
                email: "sidhu2@sidhu.com",
                password: "123456",
            });

            await expect(user.save()).rejects.toThrow(
                mongoose.Error.MongoServerError
            );
        });

        it("should not create a user if the email is already taken", async () => {
            await new User({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            }).save();

            const user = new User({
                username: "sidhu2",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            await expect(user.save()).rejects.toThrow(
                mongoose.Error.MongoServerError
            );
        });

        describe("hashPassword", () => {
            it("should hash the password", async () => {
                const user = new User({
                    username: "sidhu",
                    email: "sidhu@sidhu.com",
                    password: "123456",
                });

                await user.hashPassword();
                expect(user.password).not.toBe("123456");
            });
        });

        describe("generateAuthToken", () => {
            it("should generate a token", async () => {
                const user = new User({
                    username: "sidhu",
                    email: "sidhu@sidhu.com",
                    password: "123456",
                });

                const token = user.generateAuthToken();
                expect(token).toBeDefined();
                expect(token.length).toBeGreaterThan(0);
            });

            it("should generate a token with the user id", async () => {
                const user = await new User({
                    username: "sidhu",
                    email: "sidhu@sidhu.com",
                    password: "123456",
                }).save();

                const token = user.generateAuthToken();
                const { _id } = jwt.verify(token, config.get("jwtPrivateKey"));
                expect(_id).toBe(user._id.toHexString());
            });
        });
    });
});
