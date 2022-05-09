const { User } = require("../../../../models/user");
const request = require("supertest");

let server;

describe("/api/users", () => {
    beforeEach(async () => {
        server = require("../../../../index");
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
        server.close();
    });

    describe("POST /", () => {
        it("should create a user", async () => {
            const res = await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            expect(res.status).toBe(201);
            expect(res.body.username).toBe("sidhu");
            expect(res.body.email).toBe("sidhu@sidhu.com");
            expect(res.body.password).toBeUndefined();
            expect(res.body._id).toBeDefined();
        });

        it("should return 400 if data is invalid", async () => {
            const res = await request(server).post("/api/users").send({
                username: "",
                email: "",
                password: "",
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 if username is already taken", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const res = await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu1@sidhu.com",
                password: "123456",
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 if email is already taken", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const res = await request(server).post("/api/users").send({
                username: "sidhu1",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            expect(res.status).toBe(400);
        });
    });

    describe("/me", () => {
        it("should return 401 if no token is provided", async () => {
            const res = await request(server).get("/api/users/me");
            expect(res.status).toBe(401);
        });

        it("should return 200 if valid token is provided", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const token = (
                await request(server).post("/api/auth").send({
                    username: "sidhu",
                    password: "123456",
                })
            ).get("x-auth-token");

            const res = await request(server)
                .get("/api/users/me")
                .set("x-auth-token", token);

            expect(res.status).toBe(200);
        });

        it("should return 404 if user does not exist", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const token = (
                await request(server).post("/api/auth").send({
                    username: "sidhu",
                    password: "123456",
                })
            ).get("x-auth-token");

            await User.deleteOne({ username: "sidhu" });

            const res = await request(server)
                .get("/api/users/me")
                .set("x-auth-token", token);

            expect(res.status).toBe(404);
        });

        it("should return user data", async () => {
            await request(server).post("/api/users").send({
                username: "sidhu",
                email: "sidhu@sidhu.com",
                password: "123456",
            });

            const token = (
                await request(server).post("/api/auth").send({
                    username: "sidhu",
                    password: "123456",
                })
            ).get("x-auth-token");

            const res = await request(server).get("/api/users/me").set({
                "x-auth-token": token,
            });

            expect(res.body.username).toBe("sidhu");
            expect(res.body.email).toBe("sidhu@sidhu.com");
            expect(res.body.password).toBeUndefined();
            expect(res.body._id).toBeDefined();
        });
    });
});
