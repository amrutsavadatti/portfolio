// AI Chatbot JavaScript
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.apiEndpoint = 'YOUR_API_ENDPOINT_HERE'; // Replace with your actual API endpoint
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showWelcomeNotification();
        this.addEntranceAnimation();
    }
    
    bindEvents() {
        // Chat toggle
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatContainer = document.getElementById('chat-container');
        
        chatToggle.addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Add touch events for better mobile interaction
        chatToggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            chatToggle.style.transform = 'scale(0.95)';
        });
        
        chatToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            chatToggle.style.transform = '';
            this.toggleChat();
        });
        
        chatClose.addEventListener('click', () => {
            this.closeChat();
        });
        
        // Send message
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        
        chatSend.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Add touch events for send button
        chatSend.addEventListener('touchstart', (e) => {
            e.preventDefault();
            chatSend.style.transform = 'scale(0.95)';
        });
        
        chatSend.addEventListener('touchend', (e) => {
            e.preventDefault();
            chatSend.style.transform = '';
            this.sendMessage();
        });
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize input
        chatInput.addEventListener('input', () => {
            this.autoResizeInput(chatInput);
        });
        
        // Handle input focus on mobile
        chatInput.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                // Scroll to input on mobile
                setTimeout(() => {
                    chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chat-widget') && this.isOpen) {
                this.closeChat();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.isOpen && window.innerWidth > 768) {
                document.body.classList.remove('chat-open');
            }
        });
        
        // Prevent zoom on double tap for mobile
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    toggleChat() {
        const chatContainer = document.getElementById('chat-container');
        const notificationDot = document.getElementById('notification-dot');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
            notificationDot.style.display = 'none';
        }
    }
    
    openChat() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.classList.add('active');
        this.isOpen = true;
        
        // Prevent body scroll on mobile when chat is open
        if (window.innerWidth <= 768) {
            document.body.classList.add('chat-open');
        }
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    closeChat() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.classList.remove('active');
        this.isOpen = false;
        
        // Re-enable body scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.classList.remove('chat-open');
        }
    }
    
    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        chatInput.value = '';
        this.autoResizeInput(chatInput);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Call your API
            const response = await this.callAPI(message);
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(response, 'bot');
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
            console.error('Chatbot API error:', error);
        }
    }
    
    async callAPI(message) {
        // Replace this with your actual API call
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: this.messageHistory
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return data.response || data.message || 'I received your message but couldn\'t process it properly.';
    }
    
    addMessage(content, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const icon = document.createElement('i');
        icon.className = sender === 'bot' ? 'bx bx-bot' : 'bx bx-user';
        avatar.appendChild(icon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        messageContent.appendChild(messageText);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        
        // Store in history
        this.messageHistory.push({
            role: sender,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 messages for context
        if (this.messageHistory.length > 20) {
            this.messageHistory = this.messageHistory.slice(-20);
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingIndicator = document.getElementById('chat-typing');
        typingIndicator.style.display = 'flex';
        this.isTyping = true;
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('chat-typing');
        typingIndicator.style.display = 'none';
        this.isTyping = false;
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }
    
    showWelcomeNotification() {
        // Show notification dot after 3 seconds
        setTimeout(() => {
            const notificationDot = document.getElementById('notification-dot');
            notificationDot.style.display = 'block';
            
            // Add a subtle shake animation to the chat toggle
            const chatToggle = document.getElementById('chat-toggle');
            chatToggle.style.animation = 'chatShake 0.5s ease-in-out';
            
            // Remove the shake animation after it completes
            setTimeout(() => {
                chatToggle.style.animation = '';
            }, 500);
        }, 3000);
    }
    
    addEntranceAnimation() {
        const chatToggle = document.getElementById('chat-toggle');
        
        // Start with the button slightly hidden
        chatToggle.style.opacity = '0';
        chatToggle.style.transform = 'scale(0.5) translateY(50px)';
        
        // Animate it in after a short delay
        setTimeout(() => {
            chatToggle.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            chatToggle.style.opacity = '1';
            chatToggle.style.transform = 'scale(1) translateY(0)';
            
            // Reset transition after animation
            setTimeout(() => {
                chatToggle.style.transition = 'all 0.3s ease';
            }, 800);
        }, 1000);
    }
    
    // Method to handle demo responses (for testing without API)
    getDemoResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Sample responses based on common questions
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! I\'m Amrut\'s AI assistant. How can I help you learn more about him today?';
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
            return 'Amrut has extensive experience as a Web Applications Developer at Media.net (2021-2024), where he built tools for ad campaigns, developed centralized data processors, and worked with technologies like Kafka, Elasticsearch, and Druid. He also has freelance experience in mobile app development and full-stack development.';
        }
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
            return 'Amrut is skilled in multiple technologies including JavaScript, React, Node.js, Python, Flutter, and various databases. He has experience with cloud platforms, DevOps tools, and modern web development frameworks. His expertise spans from frontend design to backend architecture.';
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return 'You can contact Amrut via email at amrutsavadatti+careers@gmail.com or connect with him on LinkedIn. He\'s always open to discussing new opportunities and collaborations!';
        }
        
        if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
            return 'Amrut\'s resume is available for download on this portfolio. You can view it in the resume section or download it directly. It contains detailed information about his experience, skills, and projects.';
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            return 'Amrut has worked on various projects including ad campaign tools, mobile applications for milk subscription services, e-commerce platforms, and healthcare logistics systems. Each project demonstrates his ability to solve complex problems and deliver scalable solutions.';
        }
        
        return 'That\'s an interesting question! Amrut is a passionate software developer with expertise in web development, mobile apps, and system architecture. Feel free to ask me about his experience, skills, or any specific aspect of his work.';
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
    
    // For demo purposes, override the API call with demo responses
    chatbot.callAPI = async function(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        return this.getDemoResponse(message);
    };
    
    // Make chatbot globally accessible for debugging
    window.chatbot = chatbot;
});

// Add some helpful console messages
console.log('🤖 AI Chatbot loaded! Ask me about Amrut\'s experience, skills, or projects.');
console.log('💡 Tip: You can customize the API endpoint in chatbot.js to connect to your actual AI service.'); 