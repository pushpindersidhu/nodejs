const express = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");
const { validate } = require("../../models/auth");
const _ = require("lodash");

const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).send("Invalid username or password.");
    }

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword) {
        return res.status(400).send("Invalid username or password.");
    }

    const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "username", "email"])
    );
});

module.exports = router;
