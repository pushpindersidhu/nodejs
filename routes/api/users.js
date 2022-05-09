const express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { User, validate } = require("../../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user;
    user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send("User already registered.");
    }

    user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send("Username already taken.");
    }

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    await user.hashPassword();

    const result = await user.save();
    res.status(201).send(_.pick(result, ["_id", "username", "email"]));
});

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        return res.status(404).send("User not found.");
    }

    res.send(_.pick(user, ["_id", "username", "email"]));
});

module.exports = router;
