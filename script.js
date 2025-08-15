var tl = gsap.timeline();

gsap.from("header", {
    y: -100,
    duration: 1,
})

gsap.from("nav", {
    y: -100,
    duration: 1,
    stagger: 3
})

tl.from(".home-img", {
    x: "-150vw",
    duration: 2,
    scale: 2
})

tl.from(".home-content h1", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

tl.from(".home-content h3", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

tl.from(".home-content p", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

tl.from(".home-content div", {
    opacity: 0,
    y: 30,
    duration: 0.5
})


document.addEventListener('DOMContentLoaded', function() {
    // Joke section animations when in viewport
    const jokeSection = document.querySelector('#joke');
    if (jokeSection) {
        // Create an observer for the joke section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation classes when in viewport
                    document.querySelector('.joke-setup').classList.add('animate');
                    
                    // Animate punchline after a delay
                    setTimeout(() => {
                        document.querySelector('.joke-punchline').classList.add('animate');
                    }, 800);
                    
                    // Animate tagline after another delay
                    setTimeout(() => {
                        document.querySelector('.joke-tagline').classList.add('animate');
                    }, 1600);
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        // Start observing the joke section
        observer.observe(jokeSection);
    }

    // Resume frame overlay functionality
    const frameOverlay = document.querySelector('.frame-overlay');
    if (frameOverlay) {
        frameOverlay.addEventListener('click', function() {
            window.open('./Amrut_CV.pdf', '_blank');
        });
    }
});



// Mobile Menu Toggle
document.querySelector('#menu-icon').addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('active');
});

// Hide menu when clicking a nav link on mobile
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.navbar').classList.remove('active');
    });
});

// Handle responsiveness for GSAP animations
const mediaQuery = window.matchMedia('(max-width: 768px)');

function handleMediaChange(e) {
    if (e.matches) {
        // Mobile view - disable certain animations
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.add('gsap-scroll-trigger');
        });
        document.querySelector('.all_skills').classList.add('gsap-scroll-trigger');
    } else {
        // Desktop view - enable animations
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('gsap-scroll-trigger');
        });
        document.querySelector('.all_skills').classList.remove('gsap-scroll-trigger');
    }
}

// Initial check
handleMediaChange(mediaQuery);

// Add listener for changes
mediaQuery.addEventListener('change', handleMediaChange);