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

gsap.from(".timeline-item:nth-child(1)", {
    opacity: 0,
    y: 30,
    scrollTrigger: {
        trigger: "#experience",
        scroller: "body",
        // markers:true,
        start: "top 0%",
        end: "top -10%",
        scrub: 2,
        pin:true

    }
})

gsap.from(".timeline-item:nth-child(2)", {
    opacity: 0,
    y: 30,
    scrollTrigger: {
        trigger: "#experience",
        scroller: "body",
        // markers:true,
        start: "top -40%",
        end: "top -45%",
        scrub: 2,
        pin:true

    }
})

gsap.from(".timeline-item:nth-child(3)", {
    opacity: 0,
    y: 30,
    scrollTrigger: {
        trigger: "#experience",
        scroller: "body",
        // markers:true,
        start: "top -80%",
        end: "top -85%",
        scrub: 1,
        pin:true

    }
})

gsap.from(".timeline-item:nth-child(4)", {
    opacity: 0,
    y: 30,
    scrollTrigger: {
        trigger: "#experience",
        scroller: "body",
        // markers:true,
        start: "top -120%",
        end: "top -125%",
        scrub: 1,
        pin:true

    }
})

gsap.from(".timeline-item:nth-child(5)", {
    opacity: 0,
    y: 30,
    scrollTrigger: {
        trigger: "#experience",
        scroller: "body",
        // markers:true,
        start: "top -140%",
        end: "top -145%",
        scrub: 1,
        pin:true

    }
})

// gsap.to(".all_skills", {
//     transform: "translateX(-320%)",
//     scrollTrigger: {
//         trigger: "#skills",
//         scroller: "body",
//         // markers:true,
//         start: "top -25%",
//         end: "top -100%",
//         scrub: 5,
//         pin:true

//     }
// })

// gsap.to("#head", {
//     transform: "translateX(-240%)",
//     scrollTrigger: {
//         trigger: "#experience",
//         scroller: "body",
//         markers:true,
//         start: "top -30%",
//         end: "top -100%",
//         scrub: 2,
//         pin:true

//     }
// })

// Working skills slider

// gsap.to("#skills h2", {
//     transform: "translateX(-120%)",
//     scrollTrigger: {
//         trigger: "#skills",
//         scroller: "body",
//         markers:true,
//         start: "top -17%",
//         end: "top -100%",
//         scrub: 1,
//         pin:true

//     }
// })

// gsap.to("#experience #timeline-items", {
//     transform: "translateY(-9000)",
//     scrollTrigger: {
//         trigger: ".experience",
//         scroller: "body",
//         markers: true,
//         start: "top 0%",
//         end: "top -100%",
//         pin: true
//     }
// })

// Load data from localStorage if available
document.addEventListener('DOMContentLoaded', function() {
    // Check if data exists
    if (typeof(Storage) !== "undefined") {
        // Load personal info
        const personalInfoKey = 'portfolio_personal_info';
        const experiencesKey = 'portfolio_experiences';
        const skillsKey = 'portfolio_skills';
        const categoriesKey = 'portfolio_skill_categories';
        const resumeKey = 'portfolio_resume';
        const profilePicKey = 'portfolio_profile_pic';
        
        // Update personal info
        if (localStorage.getItem(personalInfoKey)) {
            const personalInfo = JSON.parse(localStorage.getItem(personalInfoKey));
            
            // Update name
            if (personalInfo.name) {
                const nameParts = personalInfo.name.split(' ');
                if (nameParts.length > 1) {
                    const firstName = nameParts[0];
                    const lastName = nameParts.slice(1).join(' ');
                    document.querySelector('.logo').innerHTML = `${firstName} <span>${lastName}</span>`;
                    document.querySelector('.home-content h1').innerHTML = `Hi, It's <span>${firstName}</span>`;
                }
            }
            
            // Update bio
            if (personalInfo.bio) {
                document.querySelector('.home-content p').textContent = personalInfo.bio;
            }
            
            // Update social links
            if (personalInfo.linkedin) {
                document.querySelector('.social-icons a[href*="linkedin"]').href = personalInfo.linkedin;
            }
            
            if (personalInfo.github) {
                document.querySelector('.social-icons a[href*="github"]').href = personalInfo.github;
            }
            
            if (personalInfo.email) {
                document.querySelector('.social-icons a[href*="mailto"]').href = `mailto:${personalInfo.email}`;
                document.querySelector('.btn-group a[href*="mailto"]').href = `mailto:${personalInfo.email}`;
            }
            
            if (personalInfo.phone) {
                document.querySelector('.social-icons a[href*="tel"]').href = `tel:${personalInfo.phone}`;
            }
        }
        
        // Update profile picture
        if (localStorage.getItem(profilePicKey)) {
            document.querySelector('.home-img img').src = localStorage.getItem(profilePicKey);
        }
        
        // Update experiences
        if (localStorage.getItem(experiencesKey)) {
            const experiences = JSON.parse(localStorage.getItem(experiencesKey));
            const timelineContainer = document.querySelector('.timeline-items');
            
            if (timelineContainer && experiences.length > 0) {
                // Clear existing items
                timelineContainer.innerHTML = '';
                
                // Add new items
                experiences.forEach(exp => {
                    const timelineItem = document.createElement('div');
                    timelineItem.className = 'timeline-item';
                    
                    timelineItem.innerHTML = `
                        <div class="timeline-dot"></div>
                        <div class="timeline-date">${exp.startDate} - ${exp.endDate}</div>
                        <div class="timeline-content">
                            <h3>${exp.jobTitle} <span class="sub-header">${exp.jobType}</span></h3>
                            <h2 class="company">${exp.company}</h2>
                            <p>${exp.description}</p>
                        </div>
                    `;
                    
                    timelineContainer.appendChild(timelineItem);
                });
            }
        }
        
        // Update skills
        if (localStorage.getItem(categoriesKey) && localStorage.getItem(skillsKey)) {
            const categories = JSON.parse(localStorage.getItem(categoriesKey));
            const skills = JSON.parse(localStorage.getItem(skillsKey));
            const skillsContainer = document.querySelector('.all_skills');
            
            if (skillsContainer && categories.length > 0) {
                // Clear existing items
                skillsContainer.innerHTML = '';
                
                // Add new categories and skills
                categories.forEach(category => {
                    const categorySkills = skills.filter(skill => skill.category === category.id);
                    
                    if (categorySkills.length > 0) {
                        const oneSkill = document.createElement('div');
                        oneSkill.className = 'one_skill';
                        
                        const skillName = document.createElement('div');
                        skillName.className = 'skill_name';
                        
                        const skillHeader = document.createElement('h3');
                        skillHeader.className = 'skillHeader';
                        skillHeader.textContent = category.name;
                        skillName.appendChild(skillHeader);
                        
                        const parentSkills = document.createElement('div');
                        parentSkills.className = 'parentSkills_1';
                        
                        categorySkills.forEach(skill => {
                            const skillDiv = document.createElement('div');
                            const childSkill = document.createElement('div');
                            childSkill.className = 'childSkill';
                            
                            // Create image
                            const img = document.createElement('img');
                            img.src = skill.icon;
                            childSkill.appendChild(img);
                            
                            // Create name
                            const skillName = document.createElement('h3');
                            skillName.textContent = skill.name;
                            childSkill.appendChild(skillName);
                            
                            skillDiv.appendChild(childSkill);
                            parentSkills.appendChild(skillDiv);
                        });
                        
                        oneSkill.appendChild(skillName);
                        oneSkill.appendChild(parentSkills);
                        skillsContainer.appendChild(oneSkill);
                    }
                });
            }
        }
        
        // Update resume section if exists
        if (localStorage.getItem(resumeKey) && document.querySelector('.resume-frame')) {
            const resumeFrame = document.querySelector('.resume-frame');
            const iframe = resumeFrame.querySelector('iframe');
            
            if (iframe) {
                iframe.src = localStorage.getItem(resumeKey) + '#toolbar=0';
            } else {
                // Create iframe if it doesn't exist
                const newIframe = document.createElement('iframe');
                newIframe.src = localStorage.getItem(resumeKey) + '#toolbar=0';
                newIframe.frameBorder = '0';
                resumeFrame.appendChild(newIframe);
            }
            
            // Ensure overlay exists
            let frameOverlay = resumeFrame.querySelector('.frame-overlay');
            if (!frameOverlay) {
                frameOverlay = document.createElement('div');
                frameOverlay.className = 'frame-overlay';
                frameOverlay.innerHTML = '<span>Click to view resume in full screen</span>';
                resumeFrame.appendChild(frameOverlay);
            }
            
            // Attach click handler to overlay
            frameOverlay.addEventListener('click', function() {
                window.open(localStorage.getItem(resumeKey), '_blank');
            });
            
            // Update download and view buttons
            const downloadBtn = document.querySelector('.btn-group a[download]');
            const viewBtn = document.querySelector('.btn-group a.btn-view');
            
            if (downloadBtn) downloadBtn.href = localStorage.getItem(resumeKey);
            if (viewBtn) viewBtn.href = localStorage.getItem(resumeKey);
        }
    }

    // Resume frame overlay functionality
    const frameOverlay = document.querySelector('.frame-overlay');
    if (frameOverlay) {
        frameOverlay.addEventListener('click', function() {
            const resumeUrl = localStorage.getItem('portfolio_resume');
            if (resumeUrl) {
                window.open(resumeUrl, '_blank');
            } else {
                // Fallback to the default URL in the HTML
                const viewResumeBtn = document.querySelector('.btn-view');
                if (viewResumeBtn) {
                    window.open(viewResumeBtn.getAttribute('href'), '_blank');
                }
            }
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