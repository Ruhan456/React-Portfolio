const projects = [
    {
        id: 1,
        title: "Rescue Bot",
        description: "The Rescue Robot project focused on designing and developing a robot capable of navigating challenging environments to assist in search-and-rescue operations. The robot is designed to deliver life-saving equipment efficiently, allowing first responders to focus on severe cases and critical tasks. This project required the integration of mechanical, electronic, and software components to achieve precise movement, efficient obstacle detection, and effective task execution.",
        image:"../images/RescueBot.jpg", // Replace with your image link or local image path
        link: "https://github.com/AumkarMali/RescueRobot",
        video: "",//"https://youtu.be/a9XtQMIU3xk?si=E_rvKfYtnuDnJD4z", // Add video URL if you have one
        skills:["C++", "LegoEV3", "RobotC", "AutoCAD", "SolidWorks"]
    },
    {
        id: 2,
        title: "Arduino Emergency Responder Bot ",
        description: "This web application which interacts with an Arduino microcontroller using PySerial to display crimes/emergencies reported through the form on the application. The reported crimes are ranked in order of severity, which is determined through an algorithm that evaluates factors such as, the number of victims, the condition of the victims, and the type of Crime. This system ensures critical situations are prioritized for faster response times, offering an efficient and reliable emergency response solution.",
        image: "../images/CrimeResponder.png", 
        link: "https://github.com/Ruhan456/Emergency-Responder",
        video: "",  
        skills:["Python", "Flask", "Arduino IDE", "HTML", "CSS", "JavaScript", "PySerial"]
    },
    {
        id: 3,
        title: "Natural Disaster Severity Mapping and Prediction System",
        description: "I developed an interactive React-based map application integrated with a custom-trained deep learning model to assess earthquake severity from user-uploaded images. The system enables users to: Upload images of the aftermath of natural disasters, which are analyzed by an AI model to rank the severity of the disaster. Mark geolocations of earthquakes on a map for visualization and tracking. Log in and securely interact with the platform using a robust backend with user authentication.",
        image: "../images/MapPhoto.jpg", 
        link: "https://github.com/Ruhan456/Natural-Disaster-Severity-Mapping",
        video: "", 
        skills:["Python", "React", "Flask", "MongoDB", "Mapbox"]
    },
    {
        id: 4,
        title: "Arduino Synthesizer",
        description: "This project is focused on creating a digital interactive Synthesizer using an Arduino microcontroller. This device was made by utilizing a single piano note and implementing pitch scaling, the program was able to generate the full range of the piano. This system allowed for a compact synthesizer capable of playing pre-programmed songs where users are able to control aspects of the sound such as, attack, decay, sustain and release, with knobs on the Arduino.",
        image: "../images/Synth.jpg", 
        link: "https://github.com/Ruhan456/Arduino-Synthesizer",
        video: "",
        skills:["Arduino", "C++", ] 
    },

];

export default projects;
