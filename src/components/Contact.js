import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { profile } from "./portfolioData";

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');
        setSubmitError('');

        const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_13kmb0r';
        const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_0g4516c';
        const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'o9FE-bOAjK7sOSzAZ';
        const templateParams = {
            name: name,
            email: email,
            from_name: name,
            from_email: email,
            reply_to: email,
            to_email: profile.email,
            to_name: profile.name,
            message: message,
        };

        try {
            const response = await emailjs.send(serviceId, templateId, templateParams, {
                publicKey,
            });
            console.log('Email sent successfully', response);
            setName('');
            setEmail('');
            setMessage('');
            setSubmitStatus('success');
        } catch (error) {
            console.error('Error sending email', error);
            setSubmitStatus('error');
            setSubmitError(error?.text || error?.message || 'EmailJS rejected this request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            className="section-shell contact-section"
            id="contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
        >
            <div className="contact-wrapper">
                <div className="section-heading">
                    <p className="eyebrow">Contact</p>
                    <h2>Let’s build useful systems.</h2>
                    <p>
                        Reach out for software, firmware, automation, manufacturing, or hybrid
                        engineering roles.
                    </p>
                </div>
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
                            Failed to send message. Email me directly at{' '}
                            <a href={`mailto:${profile.email}?subject=Portfolio%20contact%20from%20${encodeURIComponent(name || 'visitor')}&body=${encodeURIComponent(message)}`}>
                                {profile.email}
                            </a>
                            {submitError && <small>{submitError}</small>}
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
                    <a href={`mailto:${profile.email}`} className="text-link">
                        {profile.email}
                    </a>
                    <a 
                        href={profile.linkedin} 
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
                        href={profile.github} 
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
