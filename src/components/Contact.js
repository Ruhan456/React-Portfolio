import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser'

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const serviceId = 'service_13kmb0r';
        const templateId = 'template_0g4516c';
        const publicKey = 'o9FE-bOAjK7sOSzAZ';
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
        };

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully', response);
                setName('');
                setEmail('');
                setMessage('');
            })
            .catch((error) => {
                console.error('Error sending email', error)
            });
        alert('Message sent!');
    };



    return (
        <motion.div
            className="contact container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <h2>Contact Me</h2>
            <form onSubmit={handleSubmit} className="emailForm">
                <input type="text" name="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" name="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <textarea name="message" rows="4" placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                <p></p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                >
                    Send Message
                </motion.button>
                <p></p>
                
                <a href="https://www.linkedin.com/in/ruhan-bhavsar-43a074292/" target="_blank" rel="noopener noreferrer"><img src="../images/linkedin.png" alt="Linkedin" style={{ width: '30px', height: '30px', transition: 'transform 0.3s ease', marginRight: '5px', paddingBottom:'10px'}} /> </a>
                <a href="https://github.com/Ruhan456" target="_blank" rel="noopener noreferrer"><img src="../images/github.png" alt="github" style={{ width: '35px', height: '35px', transition: 'transform 0.3s ease', paddingBottom:'8px' }} /></a>
                
            </form>
        </motion.div>
    );
}

export default Contact;
