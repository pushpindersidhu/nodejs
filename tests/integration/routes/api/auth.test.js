const { User } = require("../../../../models/user");
const request = require("supertest");

let server;

describe("/api/auth", () => {
    beforeEach(async () => {
        server = require("../../../../index");
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
        server.close();
    });

    describe("POST /", () => {
        it("should return 400 if data is invalid", async () => {
            const res = await request(server).post("/api/auth").send({
                username: "",
                password: "",
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 if user does not exist", async () => {
            const res = await request(server).post("/api/auth").send({
                username: "sidhu",
                password: "123456",
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 if password is incorrect", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const res = await request(server).post("/api/auth").send({
                username: "sidhu",
                password: "1234567",
            });

            expect(res.status).toBe(400);
        });

        it("should return 200 if user exists and password is correct", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const res = await request(server).post("/api/auth").send({
                username: "sidhu",
                password: "123456",
            });

            expect(res.status).toBe(200);
        });
    });
});
