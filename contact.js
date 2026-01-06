const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// @route   POST api/contact
// @desc    Send a message
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save to database
        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: 'lokeshjhuria7@gmail.com',
            subject: 'New Contact Form Submission',
            text: `
                You have a new contact form submission:
                
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
