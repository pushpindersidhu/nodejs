const { validate } = require("../../../models/user");

describe("validate", () => {
    it("should return an error if the username is less than 3 characters", () => {
        const user = {
            username: "",
            email: "sidhu@sidhu.com",
            password: "123456",
        };
        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return an error if the username is more than 20 characters", () => {
        const user = {
            username: new Array(22).join("a"),
            email: "sidhu@sidhu.com",
            password: "123456",
        };
        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return an error if the email is less than 3 characters", () => {
        const user = {
            username: "sidhu",
            email: "",
            password: "123456",
        };
        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return an error if the email is more than 50 characters", () => {
        const user = {
            username: "sidhu",
            email: new Array(51).join("a"),
            password: "123456",
        };
        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return an error if the password is less than 6 characters", () => {
        const user = {
            username: "sidhu",
            email: "sidhu@sidhu.com",
            password: "",
        };

        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return an error if the password is more than 255 characters", () => {
        const user = {
            username: "sidhu",
            email: "sidhu@sidhu.com",
            password: new Array(257).join("a"),
        };

        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return no error if the user is valid", () => {
        const user = {
            username: "sidhu",
            email: "sidhu@sidhu.com",
            password: "123456",
        };

        const { error } = validate(user);
        expect(error).toBeUndefined();
    });

    it("should return an error if the user is not valid", () => {
        const user = {
            username: "",
            email: "",
            password: "",
        };

        const { error } = validate(user);
        expect(error).toBeDefined();
    });

    it("should return an error if the email is not valid", () => {
        const user = {
            username: "sidhu",
            email: "sidhu",
            password: "123456",
        };

        const { error } = validate(user);
        expect(error).toBeDefined();
    });
});
