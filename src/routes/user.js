const express = require("express");
const router = new express.Router();
const User = require("../model/User");
const Functions = require("../utils/function");

// USER REGISTRATION
router.post("/api/user-signup", async (req, res) => {
  const userData = req.body;
  try {
    const code = Functions.generateVoteId();
    userData.voteId = code;
    const user = new User(userData);
    await user.save();
    res.status(201).send({ message: "Signed up successfully", voteId: code });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// SIGNING IN USER
router.post("/api/user-login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.voteId);
    if (!user) throw new Error("Can not find Credential");
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Invalid Login Details" });
  }
});

// GET LIST OF ALL USERS
router.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) throw new Error("Can not get the list of all users");
    return res.status(200).json({ users });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.delete("/api/delete-users", async (req, res) => {
  try {
    const users = await User.deleteMany({});
    if (!users) throw new Error("Can not get the list of all users");
    return res
      .status(200)
      .json({ message: `All voters have been successfully deleted` });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// GET A SINGLE USER
router.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("Can not Find user");
    return res.status(200).json({ user });
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
});

// UPDATE A USER
router.put("/api/edit-user/:id", async (req, res) => {
  try {
    const userData = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userData },
      { new: true, runValidators: true }
    );
    if (!user) throw new Error(`can not find user`);
    await user.save();
    return res.status(201).json({ user, message: "success" });
  } catch (error) {
    res.status(403).send(error);
    console.log(error, `Invalid user id`);
  }
});

// DELETE A USER
router.delete("/api/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) throw new Error("Can not Find user");
    return res
      .status(200)
      .json({ message: `Voter with ${req.params.id} has been removed` });
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
});

// SIGNING IN USER
router.post("/api/user-login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.voteId);
    if (!user) throw new Error("Can not find Credential");
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Invalid Login Details" });
  }
});

module.exports = router;
