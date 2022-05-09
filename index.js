const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const debug = require("debug")("app:server");

const app = express();

app.use(express.json());

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

mongoose
    .connect(config.get("mongoURI"))
    .then(() => debug(`Connected to MongoDB at ${config.get("mongoURI")}`))
    .catch((err) => debug(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    debug(`Server started on port ${port}`);
});

module.exports = server;
