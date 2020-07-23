const express = require('express');
const router = new express.Router();
const Admin = require('../model/Admin');

// ADMIN REGISTRATION
router.post('/api/admin-signup',  async (req, res)=>{
    const adminData = req.body;
    try {
        const admin = new Admin(adminData);
        await admin.save()
        res.status(201).send({message: 'Signed up successfully'});
    } catch (error) {
        res.status(400).send(error);
    }
});

// SIGNING IN ADMIN
router.post('/api/admin-login', async(req, res)=>{
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        res.send({ admin, token});
    } catch (error) {
        res.status(400).send({ message: 'Something is wrong'});
    }
});

module.exports = router;