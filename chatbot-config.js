// Chatbot Configuration
// Update these settings to customize your AI chatbot

const CHATBOT_CONFIG = {
    // Your AI API endpoint - replace with your actual API URL
    API_ENDPOINT: 'YOUR_API_ENDPOINT_HERE',
    
    // API request configuration
    API_CONFIG: {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any additional headers your API requires
            // 'Authorization': 'Bearer YOUR_API_KEY',
        }
    },
    
    // Chatbot appearance settings
    APPEARANCE: {
        // Welcome message
        WELCOME_MESSAGE: "Hi! I'm Amrut's AI assistant. I can help you learn more about his skills, experience, or answer any questions you might have. What would you like to know?",
        
        // Bot name
        BOT_NAME: "Clarice AI",
        
        // Bot description
        BOT_DESCRIPTION: "Ask me anything about Amrut!",
        
        // Notification delay (in milliseconds)
        NOTIFICATION_DELAY: 3000,
        
        // Typing animation delay range (min, max in milliseconds)
        TYPING_DELAY: {
            MIN: 1000,
            MAX: 3000
        }
    },
    
    // Message history settings
    MESSAGE_HISTORY: {
        // Maximum number of messages to keep in context
        MAX_MESSAGES: 20,
        
        // Whether to include message history in API calls
        INCLUDE_CONTEXT: true
    },
    
    // Demo mode settings (for testing without API)
    DEMO_MODE: {
        // Enable demo mode (set to false when using real API)
        ENABLED: true,
        
        // Demo responses for common questions
        RESPONSES: {
            greeting: "Hello! I'm Amrut's AI assistant Clarice. How can I help you learn more about him today?",
            experience: "Amrut has extensive experience as a Web Applications Developer at Media.net (2021-2024), where he built tools for ad campaigns, developed centralized data processors, and worked with technologies like Kafka, Elasticsearch, and Druid. He also has freelance experience in mobile app development and full-stack development.",
            skills: "Amrut is skilled in multiple technologies including JavaScript, React, Node.js, Python, Flutter, and various databases. He has experience with cloud platforms, DevOps tools, and modern web development frameworks. His expertise spans from frontend design to backend architecture.",
            contact: "You can contact Amrut via email at amrutsavadatti+careers@gmail.com or connect with him on LinkedIn. He's always open to discussing new opportunities and collaborations!",
            resume: "Amrut's resume is available for download on this portfolio. You can view it in the resume section or download it directly. It contains detailed information about his experience, skills, and projects.",
            projects: "Amrut has worked on various projects including ad campaign tools, mobile applications for milk subscription services, e-commerce platforms, and healthcare logistics systems. Each project demonstrates his ability to solve complex problems and deliver scalable solutions.",
            default: "That's an interesting question! Amrut is a passionate software developer with expertise in web development, mobile apps, and system architecture. Feel free to ask me about his experience, skills, or any specific aspect of his work."
        }
    }
};

// Export configuration for use in chatbot.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_CONFIG;
} else {
    window.CHATBOT_CONFIG = CHATBOT_CONFIG;
} 