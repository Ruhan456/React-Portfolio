import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

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
                setSubmitStatus('success');
                
                setTimeout(() => {
                    setSubmitStatus('');
                    setIsSubmitting(false);
                }, 3000);
            })
            .catch((error) => {
                console.error('Error sending email', error);
                setSubmitStatus('error');
                
                setTimeout(() => {
                    setSubmitStatus('');
                    setIsSubmitting(false);
                }, 3000);
            });
    };

    return (
        <motion.div 
            className="contact container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="contact-wrapper">
                <h2 className="contact-title">Contact Me</h2>
                
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Your Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Your Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <textarea 
                            name="message" 
                            rows="4" 
                            placeholder="Your Message" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            required 
                            className="form-textarea"
                        />
                    </div>

                    {submitStatus === 'success' && (
                        <div className="submit-message success">
                            Message sent successfully!
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="submit-message error">
                            Failed to send message. Please try again.
                        </div>
                    )}
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-button"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                </form>

                <div className="social-links">
                    <a 
                        href="https://www.linkedin.com/in/ruhan-bhavsar-43a074292/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <img 
                            src="../images/linkedin.png" 
                            alt="LinkedIn" 
                            className="social-icon" 
                        />
                    </a>
                    <a 
                        href="https://github.com/Ruhan456" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <img 
                            src="../images/github.png" 
                            alt="GitHub" 
                            className="social-icon" 
                        />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

export default Contact;