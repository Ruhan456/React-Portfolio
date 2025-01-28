import React from 'react';
import './Home.css';


const Home = ({ darkMode }) => {
    return (
        <section id="home" className="home-section">
            <div className="home-content">
                <h2
                    className={`home-title ${darkMode ? "dark-title" : "light-title"
                        }`}
                >
                    Welcome to My Portfolio
                </h2>
                <a href="https://www.linkedin.com/in/ruhan-bhavsar-43a074292/" target="_blank" rel="noopener noreferrer"><img src="../images/linkedin.png" alt="Linkedin" style={{ width: '20px', height: '20px', transition: 'transform 0.3s ease', marginRight: '5px', paddingBottom:'10px'}} /> </a>
                <a href="https://github.com/Ruhan456" target="_blank" rel="noopener noreferrer"><img src="../images/github.png" alt="github" style={{ width: '22px', height: '22px', transition: 'transform 0.3s ease', paddingBottom:'8px' }} /></a>
                <p className={`home-description ${darkMode ? "dark-text" : "light-text"}`} >
                    Hi, I'm Ruhan. This is my portfolio, where I have displayed my technical projects and skills, as well as many ways to contact me. <br /> <br /> I am currently an undergraduate student at the University of Waterloo studying Mechatronics Engineering, with great interest in learning more about machine learning and embedded systems.
                </p>
            </div>
        </section>
    );
};

export default Home;