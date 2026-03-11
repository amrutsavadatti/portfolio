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

// ============================================================
// Experience & Skills Sections — Data-driven from config.json
// ============================================================
(function () {
    'use strict';

    var EXP_CONFIG = {
        baseUrl: '.'
    };

    var experienceData = null;
    var currentCompanyId = null;
    var usingFallback = false;

    // Hardcoded fallback data — used when both remote and local fetch fail (e.g. file:// protocol)
    var FALLBACK_DATA = {"companies":[{"id":"wpi-mme","name":"Worcester Polytechnic Institute MME","logo":"","role":"AI Automation Engineer","duration":"May 2025 - Jul 2025","type":"Full time","projects":[{"id":"n8n-automation","name":"No-Code Automation Platform","shortDescription":"Deployed n8n to streamline judge-participant communication, reducing coordination time by 70%","detailedDescription":"Deployed a no-code automation platform (n8n) to streamline judge-participant communication, reducing coordination time by 70% and sending 800+ personalized emails annually. Integrated OpenAI LLMs for FAQ detection, auto-responses, and context-aware follow-ups in email workflows.","techStack":["n8n","OpenAI","Python","Google APIs","Slack"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"hitl-system","name":"Human-in-the-Loop Query System","shortDescription":"Built a system to route unresolved queries to Slack for manual intervention","detailedDescription":"Built a human-in-the-loop system to route unresolved queries to Slack for manual intervention. Automated extraction and routing of participant data and resource requests to relevant faculty/staff based on context.","techStack":["n8n","Slack API","OpenAI"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"book-of-abstracts","name":"Book of Abstracts Generator","shortDescription":"Generated formatted annual Book of Abstracts from structured data using Python","detailedDescription":"Generated a formatted annual Book of Abstracts from structured data using Python. Automated creation of Google Forms for judge evaluations with dynamic project assignments, scoring rubrics, and note sections via Python and Google APIs.","techStack":["Python","Google APIs"],"githubUrl":"","liveUrl":"","screenshots":[]}]},{"id":"medianet","name":"Media.net","logo":"","role":"Web Applications Product Developer","duration":"August 2021 - May 2024","type":"Full time","projects":[{"id":"kafka-keyword-launcher","name":"Kafka Keyword Launcher API","shortDescription":"Built a Kafka-based API reducing latency by 35% and enabling real-time keyword analysis","detailedDescription":"Built a Kafka-based Keyword Launcher API reducing latency by 35% and enabling real-time keyword analysis. Utilized Kafka, Elasticsearch, Logstash, and Druid to optimize API performance for large-scale streaming data.","techStack":["Kafka","Elasticsearch","Logstash","Druid","Java"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"data-pipeline","name":"Configurable Data Pipeline","shortDescription":"Developed a pipeline boosting throughput by 60% with real-time ROAS and logging across 30+ APIs","detailedDescription":"Developed a configurable data pipeline that boosted throughput by 60% and supported real-time ROAS and logging across 30+ APIs.","techStack":["Java","Kafka","Spring Boot"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"api-proxy","name":"API Proxy Service","shortDescription":"Created a centralized API Proxy with key management, Dockerization, and caching, saving 25% on API costs","detailedDescription":"Created a centralized API Proxy Service with key management, Dockerization, and caching, saving 25% on frequent API costs. Created analytical tools for monitoring and reporting on ad campaign performance metrics.","techStack":["Docker","Redis","Java","Spring Boot"],"githubUrl":"","liveUrl":"","screenshots":[]}]},{"id":"gopalak","name":"Gopalak Milk","logo":"","role":"Mobile App Developer","duration":"July 2020 - June 2021","type":"Freelance","projects":[{"id":"milk-subscription-app","name":"Milk Subscription Mobile App","shortDescription":"Designed and developed a Flutter mobile app for milk subscription service","detailedDescription":"Designed and developed a mobile application using Flutter for milk subscription service. Created an admin dashboard for managing orders, inventory, and customer data. Implemented secure payment gateway integration for subscription management. Designed and optimized database schema for efficient data retrieval and management.","techStack":["Flutter","Dart","Firebase","Payment Gateway"],"githubUrl":"","liveUrl":"","screenshots":[]}]},{"id":"bhaktivedanta","name":"Bhaktivedanta Hospital IT","logo":"","role":"Software Developer","duration":"December 2019","type":"Intern","projects":[{"id":"pharmacy-logistics","name":"Pharmacy Logistics App","shortDescription":"Developed a mobile app for tracking, delivering and analyzing pharmacy logistics","detailedDescription":"Developed a mobile application for tracking, delivering and analyzing pharmacy logistics. Implemented QR based authentication for delivery receipts. Optimized delivery times by 37% and reduced errors by 40%. Designed reports for analyzing medication usage patterns and optimizing inventory.","techStack":["Android","Java","QR Code","Firebase"],"githubUrl":"","liveUrl":"","screenshots":[]}]}],"projects":[{"id":"ecommerce-platform","name":"E-Commerce Microservices Platform","shortDescription":"A scalable e-commerce backend built with Spring Boot microservices, Kafka event streaming, and React frontend.","detailedDescription":"Designed and built a full-stack e-commerce platform using a microservices architecture. The backend consists of independently deployable Spring Boot services for user management, product catalog, order processing, and payment handling. Services communicate via Kafka for event-driven order fulfillment and inventory updates. The React frontend provides a responsive shopping experience with real-time cart updates via WebSockets. Deployed on AWS ECS with Docker containers and CI/CD through GitHub Actions.","techStack":["Java","Spring Boot","Kafka","React","Docker","AWS","PostgreSQL","Redis"],"githubUrl":"https://github.com/amrutsavadatti","liveUrl":"","screenshots":[]},{"id":"ai-study-assistant","name":"AI Study Assistant","shortDescription":"An AI-powered study tool that generates flashcards, summaries, and quizzes from uploaded lecture notes using LLMs.","detailedDescription":"Built an AI-powered study assistant that helps students learn more efficiently. Users upload lecture notes, PDFs, or paste text, and the app uses OpenAI GPT-4 and Langchain to generate interactive flashcards, concise summaries, and practice quizzes. The Next.js frontend provides a clean study interface with progress tracking. The Django backend handles document processing, embedding generation with FAISS for semantic search, and user session management. Firebase is used for authentication and real-time data sync.","techStack":["Python","Django","Next.js","OpenAI","Langchain","Firebase","FAISS","Tailwind CSS"],"githubUrl":"https://github.com/amrutsavadatti","liveUrl":"https://github.com/amrutsavadatti","screenshots":[]},{"id":"realtime-collab-board","name":"Real-Time Collaboration Whiteboard","shortDescription":"A collaborative whiteboard app with real-time drawing, sticky notes, and video chat built with WebSockets.","detailedDescription":"Developed a real-time collaborative whiteboard application where multiple users can draw, add sticky notes, upload images, and communicate via integrated video chat. Built with a Node.js and Socket.IO backend for low-latency real-time synchronization. The React frontend uses HTML5 Canvas for smooth drawing with pressure sensitivity support. MongoDB stores board state and user sessions. WebRTC powers the peer-to-peer video chat feature. Deployed with Docker on AWS with auto-scaling to handle concurrent collaboration sessions.","techStack":["Node.js","Socket.IO","React","MongoDB","WebRTC","Docker","AWS","Canvas API"],"githubUrl":"https://github.com/amrutsavadatti","liveUrl":"","screenshots":[]}],"skills":[{"id":"languages","name":"Languages","items":[{"name":"C","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg"},{"name":"C++","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"},{"name":"Java","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"},{"name":"Python","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"},{"name":"Dart","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg"},{"name":"PHP","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"},{"name":"JavaScript","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"},{"name":"TypeScript","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"},{"name":"HTML","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"},{"name":"CSS","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"}]},{"id":"frameworks","name":"Frameworks","items":[{"name":"Spring","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg"},{"name":"Django","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg"},{"name":"React","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"},{"name":"Next JS","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"},{"name":"Node JS","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-line-wordmark.svg"},{"name":"Flutter","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg"},{"name":"Android","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-plain.svg"},{"name":"Laravel","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg"},{"name":"Lumen","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lumen/lumen-original.svg"},{"name":"CakePHP","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cakephp/cakephp-original.svg"}]},{"id":"databases","name":"Databases","items":[{"name":"MySQL","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg"},{"name":"Microsoft SQL","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original-wordmark.svg"},{"name":"MongoDB","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original-wordmark.svg"},{"name":"Firebase","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg"}]},{"id":"devops-cloud","name":"DevOps & Cloud","items":[{"name":"AWS","icon":"https://cdn.brandfetch.io/idVoqFQ-78/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1691083842143"},{"name":"Docker","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg"},{"name":"ArgoCD","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/argocd/argocd-original.svg"},{"name":"Elasticsearch","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg"},{"name":"Logstash","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/logstash/logstash-original.svg"},{"name":"Kibana","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kibana/kibana-original.svg"},{"name":"Redis","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg"}]},{"id":"ai-automation","name":"AI & Automation","items":[{"name":"OpenAI","icon":"https://cdn.brandfetch.io/idR3duQxYl/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1749527355219"},{"name":"Langchain","icon":"https://cdn.brandfetch.io/idzf7Sjo28/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1751438886450"},{"name":"n8n","icon":"https://cdn.brandfetch.io/id7gN4JouK/w/260/h/260/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1751031787055"},{"name":"Make.com","icon":"https://cdn.brandfetch.io/idVHU5hl7_/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1690469454303"}]}],"achievements":[{"id":"credly-badge-1","type":"badge","title":"","issuer":"","date":"","description":"","credlyBadgeId":"47578c1d-43d5-4580-95e6-e32ab187b026","image":"","credentialUrl":""}]};

    // DOM references
    var elLoading = document.getElementById('exp-loading');
    var elError = document.getElementById('exp-error');
    var elCompanies = document.getElementById('exp-companies');
    var elCompanyDetail = document.getElementById('exp-company-detail');
    var elProjectDetail = document.getElementById('exp-project-detail');
    var elTilesGrid = document.getElementById('exp-tiles-grid');
    var elCompanyHeader = document.getElementById('exp-company-header');
    var elProjectsGrid = document.getElementById('exp-projects-grid');
    var elProjectContent = document.getElementById('exp-project-content');
    var elRetryBtn = document.getElementById('exp-retry-btn');
    var elBackToCompanies = document.getElementById('exp-back-to-companies');
    var elBackToCompany = document.getElementById('exp-back-to-company');

    // Utility: render a description string into a container
    // Lines starting with "* " become <li> items grouped in a <ul>
    // Other non-empty lines become <p> tags
    function renderDescription(text, container, className) {
        var lines = text.split('\n');
        var ul = null;
        lines.forEach(function (line) {
            var trimmed = line.trim();
            if (!trimmed) {
                ul = null;
                return;
            }
            if (trimmed.charAt(0) === '*') {
                if (!ul) {
                    ul = document.createElement('ul');
                    ul.className = className + '-list';
                    container.appendChild(ul);
                }
                var li = document.createElement('li');
                li.textContent = trimmed.replace(/^\*\s*/, '');
                ul.appendChild(li);
            } else {
                ul = null;
                var p = document.createElement('p');
                p.className = className;
                p.textContent = trimmed;
                container.appendChild(p);
            }
        });
        // If no newlines were found (plain single-line text), render as paragraph
        if (container.children.length === 0) {
            var p = document.createElement('p');
            p.className = className;
            p.textContent = text;
            container.appendChild(p);
        }
    }

    // Utility: resolve asset path to full URL
    function assetUrl(path) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return EXP_CONFIG.baseUrl + '/' + path;
    }

    // Utility: show one view, hide others
    function showView(viewId) {
        [elLoading, elError, elCompanies, elCompanyDetail, elProjectDetail].forEach(function (el) {
            el.style.display = 'none';
        });
        var target = document.getElementById(viewId);
        if (target) target.style.display = 'block';
    }

    // Utility: create a logo element with fallback to initials
    function createLogo(src, name, className) {
        if (src) {
            var img = document.createElement('img');
            img.src = assetUrl(src);
            img.alt = name;
            img.className = className;
            img.onerror = function () {
                var placeholder = document.createElement('div');
                placeholder.className = className + '-placeholder';
                placeholder.textContent = name.charAt(0).toUpperCase();
                img.parentNode.replaceChild(placeholder, img);
            };
            return img;
        }
        var placeholder = document.createElement('div');
        placeholder.className = className + '-placeholder';
        placeholder.textContent = name.charAt(0).toUpperCase();
        return placeholder;
    }

    // ============================================================
    // Projects Section
    // ============================================================
    function renderProjects(data) {
        var grid = document.getElementById('proj-tiles-grid');
        var tilesView = document.getElementById('proj-tiles');
        var detailView = document.getElementById('proj-detail');
        var detailContent = document.getElementById('proj-detail-content');
        var backBtn = document.getElementById('proj-back-btn');
        if (!grid || !data.projects) return;

        function showProjectTiles() {
            detailView.style.display = 'none';
            tilesView.style.display = 'block';
        }

        function showProjectDetail(projectId) {
            var project = data.projects.find(function (p) { return p.id === projectId; });
            if (!project) return;

            detailContent.innerHTML = '';

            var h2 = document.createElement('h2');
            h2.textContent = project.name;
            detailContent.appendChild(h2);

            renderDescription(project.detailedDescription, detailContent, 'proj-detail-desc');

            // Tech stack
            if (project.techStack && project.techStack.length > 0) {
                var techSection = document.createElement('div');
                techSection.className = 'proj-detail-tech';

                var techTitle = document.createElement('h4');
                techTitle.textContent = 'Tech Stack';
                techSection.appendChild(techTitle);

                var techTags = document.createElement('div');
                techTags.className = 'proj-detail-tech-tags';
                project.techStack.forEach(function (tech) {
                    var tag = document.createElement('span');
                    tag.className = 'exp-tech-tag';
                    tag.textContent = tech;
                    techTags.appendChild(tag);
                });
                techSection.appendChild(techTags);
                detailContent.appendChild(techSection);
            }

            // Links
            var hasLinks = (project.githubUrl && project.githubUrl.length > 0) ||
                           (project.liveUrl && project.liveUrl.length > 0);
            if (hasLinks) {
                var linksDiv = document.createElement('div');
                linksDiv.className = 'proj-detail-links';

                if (project.githubUrl) {
                    var ghLink = document.createElement('a');
                    ghLink.href = project.githubUrl;
                    ghLink.target = '_blank';
                    ghLink.rel = 'noopener noreferrer';
                    ghLink.innerHTML = '<i class="bx bxl-github"></i> GitHub';
                    linksDiv.appendChild(ghLink);
                }

                if (project.liveUrl) {
                    var liveLink = document.createElement('a');
                    liveLink.href = project.liveUrl;
                    liveLink.target = '_blank';
                    liveLink.rel = 'noopener noreferrer';
                    liveLink.innerHTML = '<i class="bx bx-link-external"></i> Live Demo';
                    linksDiv.appendChild(liveLink);
                }

                detailContent.appendChild(linksDiv);
            }

            tilesView.style.display = 'none';
            detailView.style.display = 'block';
        }

        // Back button
        if (backBtn) {
            backBtn.addEventListener('click', showProjectTiles);
        }

        // Render tiles
        grid.innerHTML = '';
        data.projects.forEach(function (project, index) {
            var tile = document.createElement('div');
            tile.className = 'proj-tile';
            tile.style.animationDelay = (index * 0.1) + 's';

            var h3 = document.createElement('h3');
            h3.textContent = project.name;
            tile.appendChild(h3);

            var desc = document.createElement('p');
            desc.textContent = project.shortDescription;
            tile.appendChild(desc);

            if (project.techStack && project.techStack.length > 0) {
                var tags = document.createElement('div');
                tags.className = 'proj-tile-tags';
                project.techStack.slice(0, 5).forEach(function (tech) {
                    var tag = document.createElement('span');
                    tag.className = 'exp-tech-tag';
                    tag.textContent = tech;
                    tags.appendChild(tag);
                });
                tile.appendChild(tags);
            }

            // Quick links on the tile
            var hasLinks = (project.githubUrl && project.githubUrl.length > 0) ||
                           (project.liveUrl && project.liveUrl.length > 0);
            if (hasLinks) {
                var links = document.createElement('div');
                links.className = 'proj-tile-links';

                if (project.githubUrl) {
                    var gh = document.createElement('a');
                    gh.href = project.githubUrl;
                    gh.target = '_blank';
                    gh.rel = 'noopener noreferrer';
                    gh.innerHTML = '<i class="bx bxl-github"></i> Code';
                    gh.addEventListener('click', function (e) { e.stopPropagation(); });
                    links.appendChild(gh);
                }

                if (project.liveUrl) {
                    var live = document.createElement('a');
                    live.href = project.liveUrl;
                    live.target = '_blank';
                    live.rel = 'noopener noreferrer';
                    live.innerHTML = '<i class="bx bx-link-external"></i> Demo';
                    live.addEventListener('click', function (e) { e.stopPropagation(); });
                    links.appendChild(live);
                }

                tile.appendChild(links);
            }

            tile.addEventListener('click', function () {
                showProjectDetail(project.id);
            });

            grid.appendChild(tile);
        });

        // GSAP stagger animation
        if (typeof gsap !== 'undefined') {
            gsap.from('.proj-tile', {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.proj-tiles-grid',
                    start: 'top 80%'
                }
            });
        }
    }

    // Render skills from config data
    var SKILLS_PREVIEW_COUNT = 2;

    function renderSkills(data) {
        var grid = document.getElementById('skills-grid');
        if (!grid || !data.skills) return;

        grid.innerHTML = '';
        data.skills.forEach(function (category, index) {
            var card = document.createElement('div');
            card.className = 'skills-category';
            card.style.animationDelay = (index * 0.1) + 's';

            var title = document.createElement('h3');
            title.className = 'skills-category-title';
            title.textContent = category.name;
            card.appendChild(title);

            var items = document.createElement('div');
            items.className = 'skills-items';

            var hasMore = category.items.length > SKILLS_PREVIEW_COUNT;

            category.items.forEach(function (skill, skillIndex) {
                var item = document.createElement('div');
                item.className = 'skills-item';
                if (hasMore && skillIndex >= SKILLS_PREVIEW_COUNT) {
                    item.classList.add('skills-item-hidden');
                }

                var img = document.createElement('img');
                img.src = skill.icon;
                img.alt = skill.name;
                img.loading = 'lazy';
                item.appendChild(img);

                var h3 = document.createElement('h3');
                h3.textContent = skill.name;
                item.appendChild(h3);

                items.appendChild(item);
            });

            card.appendChild(items);

            if (hasMore) {
                var toggle = document.createElement('button');
                toggle.className = 'skills-toggle-btn';
                toggle.innerHTML = 'Show all <i class="bx bx-chevron-down"></i>';
                toggle.addEventListener('click', function () {
                    var isExpanded = card.classList.contains('skills-expanded');
                    if (isExpanded) {
                        // Collapse: show all cards again
                        card.classList.remove('skills-expanded');
                        grid.classList.remove('skills-grid-focused');
                        var siblings = grid.querySelectorAll('.skills-category');
                        for (var i = 0; i < siblings.length; i++) {
                            siblings[i].classList.remove('skills-category-hidden');
                        }
                        toggle.innerHTML = 'Show all <i class="bx bx-chevron-down"></i>';
                    } else {
                        // Expand: hide siblings, expand this card
                        var siblings = grid.querySelectorAll('.skills-category');
                        for (var i = 0; i < siblings.length; i++) {
                            if (siblings[i] !== card) {
                                siblings[i].classList.add('skills-category-hidden');
                            }
                        }
                        card.classList.add('skills-expanded');
                        grid.classList.add('skills-grid-focused');
                        toggle.innerHTML = '<i class="bx bx-arrow-back"></i> Back';
                    }
                });
                card.appendChild(toggle);
            }

            grid.appendChild(card);
        });

        // GSAP stagger animation on category cards
        if (typeof gsap !== 'undefined') {
            gsap.from('.skills-category', {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 80%'
                }
            });
        }
    }

    // ============================================================
    // Education Section
    // ============================================================
    function renderEducation(data) {
        var grid = document.getElementById('edu-grid');
        if (!grid || !data.education) return;

        grid.innerHTML = '';
        data.education.forEach(function (edu, index) {
            var card = document.createElement('div');
            card.className = 'edu-card';
            card.style.animationDelay = (index * 0.1) + 's';

            // Logo
            var logoEl = createLogo(edu.logo, edu.institution, 'edu-card-logo');
            card.appendChild(logoEl);

            // Institution
            var h3 = document.createElement('h3');
            h3.textContent = edu.institution;
            card.appendChild(h3);

            // Degree + Field
            var h4 = document.createElement('h4');
            h4.textContent = edu.degree + (edu.field ? ' · ' + edu.field : '');
            card.appendChild(h4);

            // Duration + Location
            var meta = document.createElement('div');
            meta.className = 'edu-card-meta';

            var dur = document.createElement('span');
            dur.className = 'edu-card-duration';
            dur.textContent = edu.duration;
            meta.appendChild(dur);

            if (edu.location) {
                var loc = document.createElement('span');
                loc.className = 'edu-card-location';
                loc.innerHTML = '<i class="bx bx-map-pin"></i> ' + edu.location;
                meta.appendChild(loc);
            }
            card.appendChild(meta);

            // GPA
            if (edu.gpa) {
                var gpa = document.createElement('span');
                gpa.className = 'edu-card-gpa';
                gpa.textContent = 'GPA: ' + edu.gpa;
                card.appendChild(gpa);
            }

            // Highlights
            if (edu.highlights && edu.highlights.length > 0) {
                var highlightsDiv = document.createElement('div');
                highlightsDiv.className = 'edu-card-highlights';
                edu.highlights.forEach(function (h) {
                    var tag = document.createElement('span');
                    tag.className = 'exp-tech-tag';
                    tag.textContent = h;
                    highlightsDiv.appendChild(tag);
                });
                card.appendChild(highlightsDiv);
            }

            grid.appendChild(card);
        });

        // GSAP stagger animation
        if (typeof gsap !== 'undefined') {
            gsap.from('.edu-card', {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.edu-grid',
                    start: 'top 80%'
                }
            });
        }
    }

    // ============================================================
    // Achievements Section — 2-level drill-down (Categories → Items)
    // ============================================================
    var ACHIEVEMENT_META = {
        badge:          { icon: 'bxs-badge-check',   label: 'Badges' },
        certificate:    { icon: 'bxs-certification',  label: 'Certificates' },
        accomplishment: { icon: 'bxs-trophy',         label: 'Accomplishments' }
    };

    var ACHIEVEMENT_ITEM_ICONS = {
        certificate: 'bxs-certification',
        badge: 'bxs-badge-check',
        accomplishment: 'bxs-trophy'
    };

    function renderAchievements(data) {
        var categoriesView = document.getElementById('achievements-categories');
        var itemsView = document.getElementById('achievements-items');
        var tilesGrid = document.getElementById('achievements-tiles-grid');
        var itemsGrid = document.getElementById('achievements-grid');
        var backBtn = document.getElementById('achievements-back-btn');

        if (!categoriesView || !tilesGrid) return;

        if (!data.achievements || data.achievements.length === 0) {
            tilesGrid.innerHTML = '<p class="achievements-empty">No achievements listed yet.</p>';
            return;
        }

        // Group items by type (case-insensitive)
        var groups = {};
        data.achievements.forEach(function (item) {
            var type = (item.type || 'other').toLowerCase();
            if (!groups[type]) groups[type] = [];
            groups[type].push(item);
        });

        // ---- View switching ----
        function showCategories() {
            itemsView.style.display = 'none';
            categoriesView.style.display = 'block';
        }

        function showItems(type) {
            var items = groups[type] || [];
            var needsCredlyScript = false;

            itemsGrid.innerHTML = '';
            items.forEach(function (item, index) {
                var card = createAchievementCard(item, index);
                if (item.credlyBadgeId && item.credlyBadgeId.trim().length > 0) {
                    needsCredlyScript = true;
                }
                itemsGrid.appendChild(card);
            });

            // Inject Credly embed script once if needed
            if (needsCredlyScript) {
                loadCredlyScript();
            }

            categoriesView.style.display = 'none';
            itemsView.style.display = 'block';

            // GSAP stagger animation
            if (typeof gsap !== 'undefined') {
                gsap.from('.achievement-card', {
                    opacity: 0,
                    y: 30,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        }

        // Back button
        if (backBtn) {
            backBtn.addEventListener('click', showCategories);
        }

        // ---- Render category tiles ----
        tilesGrid.innerHTML = '';
        var typeKeys = Object.keys(groups);
        typeKeys.forEach(function (type, index) {
            var meta = ACHIEVEMENT_META[type] || { icon: 'bxs-award', label: type.charAt(0).toUpperCase() + type.slice(1) + 's' };
            var count = groups[type].length;

            var tile = document.createElement('div');
            tile.className = 'achievement-category-tile';
            tile.style.animationDelay = (index * 0.1) + 's';

            var icon = document.createElement('i');
            icon.className = 'bx ' + meta.icon + ' achievement-category-icon';
            tile.appendChild(icon);

            var h3 = document.createElement('h3');
            h3.textContent = meta.label;
            tile.appendChild(h3);

            var countSpan = document.createElement('span');
            countSpan.className = 'achievement-category-count';
            countSpan.textContent = count + (count === 1 ? ' item' : ' items');
            tile.appendChild(countSpan);

            tile.addEventListener('click', function () {
                showItems(type);
            });

            tilesGrid.appendChild(tile);
        });

        // GSAP scroll animation for tiles
        if (typeof gsap !== 'undefined') {
            gsap.from('.achievement-category-tile', {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.achievements-tiles-grid',
                    start: 'top 80%'
                }
            });
        }
    }

    // Build a single achievement card element
    function createAchievementCard(item, index) {
        var card = document.createElement('div');
        card.className = 'achievement-card';
        card.style.animationDelay = (index * 0.1) + 's';

        // Image / badge display
        var imgContainer = document.createElement('div');
        imgContainer.className = 'achievement-img';

        if (item.credlyBadgeId && item.credlyBadgeId.trim().length > 0) {
            imgContainer.className = 'achievement-img achievement-img-credly';
            var credlyDiv = document.createElement('div');
            credlyDiv.setAttribute('data-iframe-width', '150');
            credlyDiv.setAttribute('data-iframe-height', '270');
            credlyDiv.setAttribute('data-share-badge-id', item.credlyBadgeId.trim());
            credlyDiv.setAttribute('data-share-badge-host', 'https://www.credly.com');
            imgContainer.appendChild(credlyDiv);
        } else if (item.image && item.image.trim().length > 0) {
            var imgSrc = item.image.trim();
            if (imgSrc.startsWith('<svg')) {
                imgContainer.innerHTML = imgSrc;
            } else {
                var img = document.createElement('img');
                img.src = assetUrl(imgSrc);
                img.alt = item.title;
                img.loading = 'lazy';
                imgContainer.appendChild(img);
            }
        } else {
            var typeKey = (item.type || '').toLowerCase();
            var icon = document.createElement('i');
            icon.className = 'bx ' + (ACHIEVEMENT_ITEM_ICONS[typeKey] || 'bxs-award') + ' achievement-fallback-icon';
            imgContainer.appendChild(icon);
        }
        card.appendChild(imgContainer);

        // Title
        if (item.title) {
            var h3 = document.createElement('h3');
            h3.textContent = item.title;
            card.appendChild(h3);
        }

        // Issuer
        if (item.issuer) {
            var h4 = document.createElement('h4');
            h4.textContent = item.issuer;
            card.appendChild(h4);
        }

        // Date
        if (item.date) {
            var date = document.createElement('span');
            date.className = 'achievement-date';
            date.innerHTML = '<i class="bx bx-calendar"></i> ' + item.date;
            card.appendChild(date);
        }

        // Description
        if (item.description && item.description.trim().length > 0) {
            var desc = document.createElement('p');
            desc.className = 'achievement-desc';
            desc.textContent = item.description;
            card.appendChild(desc);
        }

        // Credential link
        if (item.credentialUrl && item.credentialUrl.trim().length > 0) {
            var link = document.createElement('a');
            link.href = item.credentialUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'achievement-link';
            link.innerHTML = '<i class="bx bx-link-external"></i> View Credential';
            card.appendChild(link);
        }

        return card;
    }

    // Load Credly embed script once
    function loadCredlyScript() {
        if (document.getElementById('credly-embed-script')) return;
        var credlyScript = document.createElement('script');
        credlyScript.id = 'credly-embed-script';
        credlyScript.src = '//cdn.credly.com/assets/utilities/embed.js';
        credlyScript.async = true;
        document.body.appendChild(credlyScript);
    }

    // Fetch config data — loads local JSON, falls back to hardcoded data
    function fetchExperienceData() {
        showView('exp-loading');
        fetch(EXP_CONFIG.baseUrl + '/config.json')
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (data) {
                usingFallback = false;
                experienceData = data;
                showCompanies();
                renderProjects(data);
                renderSkills(data);
                renderEducation(data);
                renderAchievements(data);
            })
            .catch(function () {
                // Fallback: use hardcoded data (works on file:// protocol)
                usingFallback = true;
                experienceData = FALLBACK_DATA;
                showCompanies();
                renderProjects(FALLBACK_DATA);
                renderSkills(FALLBACK_DATA);
                renderEducation(FALLBACK_DATA);
                renderAchievements(FALLBACK_DATA);
            });
    }

    // View 1: Render company tiles
    function showCompanies() {
        elTilesGrid.innerHTML = '';
        var companies = experienceData.companies || [];

        companies.forEach(function (company, index) {
            var tile = document.createElement('div');
            tile.className = 'exp-tile';
            tile.style.animationDelay = (index * 0.1) + 's';

            var logo = createLogo(company.logo, company.name, 'exp-tile-logo');
            tile.appendChild(logo);

            var h3 = document.createElement('h3');
            h3.textContent = company.name;
            tile.appendChild(h3);

            var h4 = document.createElement('h4');
            h4.textContent = company.role;
            tile.appendChild(h4);

            var dur = document.createElement('span');
            dur.className = 'exp-tile-duration';
            dur.textContent = company.duration;
            tile.appendChild(dur);

            var type = document.createElement('span');
            type.className = 'exp-tile-type';
            type.textContent = company.type;
            tile.appendChild(type);

            tile.addEventListener('click', function () {
                showCompanyDetail(company.id);
            });

            elTilesGrid.appendChild(tile);
        });

        showView('exp-companies');

        // GSAP stagger animation
        if (typeof gsap !== 'undefined') {
            gsap.from('.exp-tile', {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }

    // View 2: Render company detail with project cards
    function showCompanyDetail(companyId) {
        currentCompanyId = companyId;
        var company = experienceData.companies.find(function (c) { return c.id === companyId; });
        if (!company) return;

        // Render header
        elCompanyHeader.innerHTML = '';
        var logo = createLogo(company.logo, company.name, 'exp-company-header');
        // For the header logo, use a different approach
        var headerInner = document.createElement('div');
        headerInner.style.display = 'flex';
        headerInner.style.alignItems = 'center';
        headerInner.style.gap = '3rem';
        headerInner.style.width = '100%';

        var logoEl = createLogo(company.logo, company.name, 'exp-tile-logo');
        logoEl.style.width = '100px';
        logoEl.style.height = '100px';
        logoEl.style.flexShrink = '0';
        headerInner.appendChild(logoEl);

        var info = document.createElement('div');
        info.className = 'exp-company-info';

        var h3 = document.createElement('h3');
        h3.textContent = company.name;
        info.appendChild(h3);

        var h4 = document.createElement('h4');
        h4.textContent = company.role;
        h4.style.color = 'var(--main-color)';
        info.appendChild(h4);

        var p = document.createElement('p');
        p.textContent = company.duration + ' · ' + company.type;
        info.appendChild(p);

        headerInner.appendChild(info);
        elCompanyHeader.appendChild(headerInner);

        // Render project cards
        elProjectsGrid.innerHTML = '';
        var projects = company.projects || [];

        if (projects.length === 0) {
            var noProjects = document.createElement('p');
            noProjects.className = 'exp-no-projects';
            noProjects.textContent = 'No projects listed yet.';
            elProjectsGrid.appendChild(noProjects);
        } else {
            projects.forEach(function (project, index) {
                var card = document.createElement('div');
                card.className = 'exp-project-card';
                card.style.animationDelay = (index * 0.1) + 's';

                var h3 = document.createElement('h3');
                h3.textContent = project.name;
                card.appendChild(h3);

                var desc = document.createElement('p');
                desc.textContent = project.shortDescription;
                card.appendChild(desc);

                if (project.techStack && project.techStack.length > 0) {
                    var tags = document.createElement('div');
                    tags.className = 'exp-project-card-tags';
                    project.techStack.slice(0, 4).forEach(function (tech) {
                        var tag = document.createElement('span');
                        tag.className = 'exp-tech-tag';
                        tag.textContent = tech;
                        tags.appendChild(tag);
                    });
                    card.appendChild(tags);
                }

                if (project.liveUrl && project.liveUrl.length > 0) {
                    var liveLink = document.createElement('a');
                    liveLink.href = project.liveUrl;
                    liveLink.target = '_blank';
                    liveLink.rel = 'noopener noreferrer';
                    liveLink.className = 'exp-project-card-link';
                    liveLink.innerHTML = '<i class="bx bx-link-external"></i> Live Demo';
                    liveLink.addEventListener('click', function (e) { e.stopPropagation(); });
                    card.appendChild(liveLink);
                }

                card.addEventListener('click', function () {
                    showProjectDetail(companyId, project.id);
                });

                elProjectsGrid.appendChild(card);
            });
        }

        showView('exp-company-detail');

        // GSAP stagger animation
        if (typeof gsap !== 'undefined') {
            gsap.from('.exp-project-card', {
                opacity: 0,
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }

    // View 3: Render full project detail
    function showProjectDetail(companyId, projectId) {
        var company = experienceData.companies.find(function (c) { return c.id === companyId; });
        if (!company) return;
        var project = company.projects.find(function (p) { return p.id === projectId; });
        if (!project) return;

        elProjectContent.innerHTML = '';

        var h2 = document.createElement('h2');
        h2.textContent = project.name;
        elProjectContent.appendChild(h2);

        renderDescription(project.detailedDescription, elProjectContent, 'exp-project-desc');

        // Tech stack
        if (project.techStack && project.techStack.length > 0) {
            var techSection = document.createElement('div');
            techSection.className = 'exp-project-tech';

            var techTitle = document.createElement('h4');
            techTitle.textContent = 'Tech Stack';
            techSection.appendChild(techTitle);

            var techTags = document.createElement('div');
            techTags.className = 'exp-tech-tags';
            project.techStack.forEach(function (tech) {
                var tag = document.createElement('span');
                tag.className = 'exp-tech-tag';
                tag.textContent = tech;
                techTags.appendChild(tag);
            });
            techSection.appendChild(techTags);
            elProjectContent.appendChild(techSection);
        }

        // Links
        var hasLinks = (project.githubUrl && project.githubUrl.length > 0) ||
                       (project.liveUrl && project.liveUrl.length > 0);
        if (hasLinks) {
            var linksDiv = document.createElement('div');
            linksDiv.className = 'exp-project-links';

            if (project.githubUrl) {
                var ghLink = document.createElement('a');
                ghLink.href = project.githubUrl;
                ghLink.target = '_blank';
                ghLink.rel = 'noopener noreferrer';
                ghLink.innerHTML = '<i class="bx bxl-github"></i> GitHub';
                linksDiv.appendChild(ghLink);
            }

            if (project.liveUrl) {
                var liveLink = document.createElement('a');
                liveLink.href = project.liveUrl;
                liveLink.target = '_blank';
                liveLink.rel = 'noopener noreferrer';
                liveLink.innerHTML = '<i class="bx bx-link-external"></i> Live Demo';
                linksDiv.appendChild(liveLink);
            }

            elProjectContent.appendChild(linksDiv);
        }

        // Screenshots
        if (project.screenshots && project.screenshots.length > 0) {
            var ssSection = document.createElement('div');
            ssSection.className = 'exp-project-screenshots';

            var ssTitle = document.createElement('h4');
            ssTitle.textContent = 'Screenshots';
            ssSection.appendChild(ssTitle);

            var ssGrid = document.createElement('div');
            ssGrid.className = 'exp-project-screenshots-grid';
            project.screenshots.forEach(function (ss) {
                var img = document.createElement('img');
                img.src = assetUrl(ss);
                img.alt = project.name + ' screenshot';
                ssGrid.appendChild(img);
            });
            ssSection.appendChild(ssGrid);
            elProjectContent.appendChild(ssSection);
        }

        showView('exp-project-detail');
    }

    // Event listeners
    if (elRetryBtn) {
        elRetryBtn.addEventListener('click', fetchExperienceData);
    }

    if (elBackToCompanies) {
        elBackToCompanies.addEventListener('click', function () {
            showCompanies();
        });
    }

    if (elBackToCompany) {
        elBackToCompany.addEventListener('click', function () {
            if (currentCompanyId) {
                showCompanyDetail(currentCompanyId);
            } else {
                showCompanies();
            }
        });
    }

    // Initialize on page load
    fetchExperienceData();
})();