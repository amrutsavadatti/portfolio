gsap.registerPlugin(ScrollTrigger);

// ============================================================
// LENIS SMOOTH SCROLL (graceful fallback if CDN fails)
// ============================================================
try {
    if (window.innerWidth > 768) {
        var lenis = new Lenis({ duration: 1.2, easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }
} catch(e) {
    console.warn('Lenis smooth scroll not available, using native scroll');
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
(function() {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    var mx = 0, my = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });
    document.querySelectorAll('a, button, .exp-tile, .proj-tile, .skills-item, .achievement-category-tile, .edu-card').forEach(function(el) {
        el.addEventListener('mouseenter', function() { ring.classList.add('hovering'); });
        el.addEventListener('mouseleave', function() { ring.classList.remove('hovering'); });
    });
    (function cursorLoop() {
        dx += (mx - dx) * 0.15;
        dy += (my - dy) * 0.15;
        dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
        ring.style.transform = 'translate(' + (dx - 18) + 'px,' + (dy - 18) + 'px)';
        requestAnimationFrame(cursorLoop);
    })();
})();

// ============================================================
// ANIMATED GRAIN
// ============================================================
(function() {
    var turbulence = document.querySelector('#grain-filter feTurbulence');
    if (!turbulence) return;
    var seed = 1;
    setInterval(function() {
        seed = (seed % 5) + 1;
        turbulence.setAttribute('seed', seed);
    }, 150);
})();

// ============================================================
// HERO — KINETIC SPLIT TEXT
// ============================================================
(function() {
    var h1 = document.querySelector('.home-content h1');
    if (!h1) return;

    // Helper: split text content of an element into .char spans
    function splitChars(text) {
        var frag = document.createDocumentFragment();
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch === ' ' || ch === '\n' || ch === '\t') continue; // skip whitespace-only
            var span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch;
            frag.appendChild(span);
        }
        return frag;
    }

    try {
        var children = Array.from(h1.childNodes);
        var newContent = document.createDocumentFragment();

        children.forEach(function(node) {
            if (node.nodeType === 3) {
                // Text node — split into chars, but skip pure whitespace
                var text = node.textContent;
                if (text.trim().length === 0) return;
                newContent.appendChild(splitChars(text));
            } else if (node.nodeName === 'BR') {
                newContent.appendChild(document.createElement('br'));
            } else if (node.nodeName === 'EM') {
                var em = document.createElement('em');
                em.appendChild(splitChars(node.textContent));
                newContent.appendChild(em);
            } else {
                newContent.appendChild(node.cloneNode(true));
            }
        });

        h1.innerHTML = '';
        h1.appendChild(newContent);
    } catch(e) {
        // If split fails, leave h1 untouched
        console.warn('Split text failed:', e);
    }
})();

// ============================================================
// HERO ENTRANCE ANIMATIONS
// ============================================================
var tl = gsap.timeline();

tl.from(".home-content .section-tag", {
    opacity: 0,
    y: 24,
    duration: 0.6,
    delay: 0.2
});

// Kinetic character animation — random directions
tl.from(".home-content h1 .char", {
    opacity: 0,
    y: function() { return gsap.utils.random(-80, 80); },
    x: function() { return gsap.utils.random(-40, 40); },
    rotation: function() { return gsap.utils.random(-25, 25); },
    scale: function() { return gsap.utils.random(0.3, 1.4); },
    duration: 0.9,
    ease: 'back.out(1.7)',
    stagger: { each: 0.035, from: 'random' }
}, "-=0.3");

tl.from(".home-content p", {
    opacity: 0,
    y: 24,
    duration: 0.5
}, "-=0.4");

tl.from(".terminal-snippet", {
    opacity: 0,
    y: 24,
    duration: 0.5
}, "-=0.2");

tl.from(".btn-group", {
    opacity: 0,
    y: 24,
    duration: 0.5
}, "-=0.2");

tl.from(".home-photo-col", {
    opacity: 0,
    x: 40,
    duration: 0.8
}, "-=0.6");

tl.from(".stats-strip", {
    opacity: 0,
    y: 24,
    duration: 0.6
}, "-=0.3");

// ============================================================
// MAGNETIC BUTTON
// ============================================================
(function() {
    var btn = document.querySelector('.home .btn-primary');
    if (!btn) return;
    btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.3) + 'px,' + (y * 0.3) + 'px)';
    });
    btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(function() { btn.style.transition = ''; }, 400);
    });
    btn.addEventListener('mouseenter', function() { btn.style.transition = ''; });
})();

// ============================================================
// STATS — COUNT UP ON SCROLL
// ============================================================
(function() {
    var statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length || typeof ScrollTrigger === 'undefined') return;

    statNumbers.forEach(function(el) {
        var rawText = el.textContent.trim();
        var hasSuffix = rawText.match(/[+%]$/);
        var suffix = hasSuffix ? hasSuffix[0] : '';
        var numStr = rawText.replace(/[+%]/g, '');
        var target = parseFloat(numStr);
        if (isNaN(target)) return;
        var decimals = numStr.indexOf('.') !== -1 ? numStr.split('.')[1].length : 0;

        el.textContent = '0' + suffix;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: function() {
                gsap.to({ v: 0 }, {
                    v: target,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate: function() {
                        el.textContent = this.targets()[0].v.toFixed(decimals) + suffix;
                    }
                });
            },
            once: true
        });
    });
})();


document.addEventListener('DOMContentLoaded', function() {
    // Scroll-triggered section reveals using GSAP ScrollTrigger
    // (compatible with Lenis smooth scroll, unlike IntersectionObserver)
    var sections = document.querySelectorAll('section:not(.home), .stats-strip');
    sections.forEach(function(section) {
        gsap.set(section, { opacity: 0, y: 24 });
        gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Joke section animations when in viewport (using ScrollTrigger for Lenis compat)
    var jokeSection = document.querySelector('#joke');
    if (jokeSection) {
        ScrollTrigger.create({
            trigger: jokeSection,
            start: 'top 70%',
            once: true,
            onEnter: function() {
                document.querySelector('.joke-setup').classList.add('animate');
                setTimeout(function() {
                    document.querySelector('.joke-punchline').classList.add('animate');
                }, 800);
                setTimeout(function() {
                    document.querySelector('.joke-tagline').classList.add('animate');
                }, 1600);
            }
        });
    }

    // Resume frame overlay functionality
    const frameOverlay = document.querySelector('.frame-overlay');
    if (frameOverlay) {
        frameOverlay.addEventListener('click', function() {
            window.open('https://drive.google.com/file/d/1qEbdD50ugsT73ZojwtZB86nnbhDj7ySS/view?usp=sharing', '_blank');
        });
    }
});



// Mobile Menu Toggle
document.querySelector('#menu-icon').addEventListener('click', function() {
    document.querySelector('.navbar').classList.toggle('active');
    this.classList.toggle('active');
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
    var FALLBACK_DATA = {"companies":[{"id":"wpi-mme","name":"Worcester Polytechnic Institute MME","logo":"","role":"AI Automation Engineer","duration":"May 2025 - Jul 2025","type":"Full time","projects":[{"id":"n8n-automation","name":"No-Code Automation Platform","shortDescription":"Deployed n8n to streamline judge-participant communication, reducing coordination time by 70%","detailedDescription":"Deployed a no-code automation platform (n8n) to streamline judge-participant communication, reducing coordination time by 70% and sending 800+ personalized emails annually. Integrated OpenAI LLMs for FAQ detection, auto-responses, and context-aware follow-ups in email workflows.","techStack":["n8n","OpenAI","Python","Google APIs","Slack"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"hitl-system","name":"Human-in-the-Loop Query System","shortDescription":"Built a system to route unresolved queries to Slack for manual intervention","detailedDescription":"Built a human-in-the-loop system to route unresolved queries to Slack for manual intervention. Automated extraction and routing of participant data and resource requests to relevant faculty/staff based on context.","techStack":["n8n","Slack API","OpenAI"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"book-of-abstracts","name":"Book of Abstracts Generator","shortDescription":"Generated formatted annual Book of Abstracts from structured data using Python","detailedDescription":"Generated a formatted annual Book of Abstracts from structured data using Python. Automated creation of Google Forms for judge evaluations with dynamic project assignments, scoring rubrics, and note sections via Python and Google APIs.","techStack":["Python","Google APIs"],"githubUrl":"","liveUrl":"","screenshots":[]}]},{"id":"medianet","name":"Media.net","logo":"","role":"Web Applications Product Developer","duration":"August 2021 - May 2024","type":"Full time","projects":[{"id":"kafka-keyword-launcher","name":"Kafka Keyword Launcher API","shortDescription":"Built a Kafka-based API reducing latency by 35% and enabling real-time keyword analysis","detailedDescription":"Built a Kafka-based Keyword Launcher API reducing latency by 35% and enabling real-time keyword analysis. Utilized Kafka, Elasticsearch, Logstash, and Druid to optimize API performance for large-scale streaming data.","techStack":["Kafka","Elasticsearch","Logstash","Druid","Java"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"data-pipeline","name":"Configurable Data Pipeline","shortDescription":"Developed a pipeline boosting throughput by 60% with real-time ROAS and logging across 30+ APIs","detailedDescription":"Developed a configurable data pipeline that boosted throughput by 60% and supported real-time ROAS and logging across 30+ APIs.","techStack":["Java","Kafka","Spring Boot"],"githubUrl":"","liveUrl":"","screenshots":[]},{"id":"api-proxy","name":"API Proxy Service","shortDescription":"Created a centralized API Proxy with key management, Dockerization, and caching, saving 25% on API costs","detailedDescription":"Created a centralized API Proxy Service with key management, Dockerization, and caching, saving 25% on frequent API costs. Created analytical tools for monitoring and reporting on ad campaign performance metrics.","techStack":["Docker","Redis","Java","Spring Boot"],"githubUrl":"","liveUrl":"","screenshots":[]}]},{"id":"gopalak","name":"Gopalak Milk","logo":"","role":"Mobile App Developer","duration":"July 2020 - June 2021","type":"Freelance","projects":[{"id":"milk-subscription-app","name":"Milk Subscription Mobile App","shortDescription":"Designed and developed a Flutter mobile app for milk subscription service","detailedDescription":"Designed and developed a mobile application using Flutter for milk subscription service. Created an admin dashboard for managing orders, inventory, and customer data. Implemented secure payment gateway integration for subscription management. Designed and optimized database schema for efficient data retrieval and management.","techStack":["Flutter","Dart","Firebase","Payment Gateway"],"githubUrl":"","liveUrl":"","screenshots":[]}]},{"id":"bhaktivedanta","name":"Bhaktivedanta Hospital IT","logo":"","role":"Software Developer","duration":"December 2019","type":"Intern","projects":[{"id":"pharmacy-logistics","name":"Pharmacy Logistics App","shortDescription":"Developed a mobile app for tracking, delivering and analyzing pharmacy logistics","detailedDescription":"Developed a mobile application for tracking, delivering and analyzing pharmacy logistics. Implemented QR based authentication for delivery receipts. Optimized delivery times by 37% and reduced errors by 40%. Designed reports for analyzing medication usage patterns and optimizing inventory.","techStack":["Android","Java","QR Code","Firebase"],"githubUrl":"","liveUrl":"","screenshots":[]}]}],"projects":[{"id":"ecommerce-platform","name":"E-Commerce Microservices Platform","shortDescription":"A scalable e-commerce backend built with Spring Boot microservices, Kafka event streaming, and React frontend.","detailedDescription":"Designed and built a full-stack e-commerce platform using a microservices architecture. The backend consists of independently deployable Spring Boot services for user management, product catalog, order processing, and payment handling. Services communicate via Kafka for event-driven order fulfillment and inventory updates. The React frontend provides a responsive shopping experience with real-time cart updates via WebSockets. Deployed on AWS ECS with Docker containers and CI/CD through GitHub Actions.","techStack":["Java","Spring Boot","Kafka","React","Docker","AWS","PostgreSQL","Redis"],"githubUrl":"https://github.com/amrutsavadatti","liveUrl":"","screenshots":[]},{"id":"ai-study-assistant","name":"AI Study Assistant","shortDescription":"An AI-powered study tool that generates flashcards, summaries, and quizzes from uploaded lecture notes using LLMs.","detailedDescription":"Built an AI-powered study assistant that helps students learn more efficiently. Users upload lecture notes, PDFs, or paste text, and the app uses OpenAI GPT-4 and Langchain to generate interactive flashcards, concise summaries, and practice quizzes. The Next.js frontend provides a clean study interface with progress tracking. The Django backend handles document processing, embedding generation with FAISS for semantic search, and user session management. Firebase is used for authentication and real-time data sync.","techStack":["Python","Django","Next.js","OpenAI","Langchain","Firebase","FAISS","Tailwind CSS"],"githubUrl":"https://github.com/amrutsavadatti","liveUrl":"https://github.com/amrutsavadatti","screenshots":[]},{"id":"realtime-collab-board","name":"Real-Time Collaboration Whiteboard","shortDescription":"A collaborative whiteboard app with real-time drawing, sticky notes, and video chat built with WebSockets.","detailedDescription":"Developed a real-time collaborative whiteboard application where multiple users can draw, add sticky notes, upload images, and communicate via integrated video chat. Built with a Node.js and Socket.IO backend for low-latency real-time synchronization. The React frontend uses HTML5 Canvas for smooth drawing with pressure sensitivity support. MongoDB stores board state and user sessions. WebRTC powers the peer-to-peer video chat feature. Deployed with Docker on AWS with auto-scaling to handle concurrent collaboration sessions.","techStack":["Node.js","Socket.IO","React","MongoDB","WebRTC","Docker","AWS","Canvas API"],"githubUrl":"https://github.com/amrutsavadatti","liveUrl":"","screenshots":[]}],"skills":[{"id":"languages","name":"Languages","items":[{"name":"C","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg"},{"name":"C++","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"},{"name":"Java","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"},{"name":"Python","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"},{"name":"Dart","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg"},{"name":"PHP","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"},{"name":"JavaScript","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"},{"name":"TypeScript","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"},{"name":"HTML","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"},{"name":"CSS","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"}]},{"id":"frameworks","name":"Frameworks","items":[{"name":"Spring","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg"},{"name":"Django","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg"},{"name":"React","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"},{"name":"Next JS","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"},{"name":"Node JS","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-line-wordmark.svg"},{"name":"Flutter","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg"},{"name":"Android","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-plain.svg"},{"name":"Laravel","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg"},{"name":"Lumen","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lumen/lumen-original.svg"},{"name":"CakePHP","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cakephp/cakephp-original.svg"}]},{"id":"databases","name":"Databases","items":[{"name":"MySQL","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg"},{"name":"Microsoft SQL","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original-wordmark.svg"},{"name":"MongoDB","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original-wordmark.svg"},{"name":"Firebase","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg"}]},{"id":"devops-cloud","name":"DevOps & Cloud","items":[{"name":"AWS","icon":"https://cdn.brandfetch.io/idVoqFQ-78/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1691083842143"},{"name":"Docker","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg"},{"name":"ArgoCD","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/argocd/argocd-original.svg"},{"name":"Elasticsearch","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg"},{"name":"Logstash","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/logstash/logstash-original.svg"},{"name":"Kibana","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kibana/kibana-original.svg"},{"name":"Redis","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg"}]},{"id":"ai-automation","name":"AI & Automation","items":[{"name":"OpenAI","icon":"https://cdn.brandfetch.io/idR3duQxYl/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1749527355219"},{"name":"Langchain","icon":"https://cdn.brandfetch.io/idzf7Sjo28/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1751438886450"},{"name":"n8n","icon":"https://cdn.brandfetch.io/id7gN4JouK/w/260/h/260/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1751031787055"},{"name":"Make.com","icon":"https://cdn.brandfetch.io/idVHU5hl7_/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1690469454303"}]}],"achievements":[{"id":"credly-badge-1","type":"badge","title":"","issuer":"","date":"","description":"","credlyBadgeId":"47578c1d-43d5-4580-95e6-e32ab187b026","image":"","credentialUrl":"","issuer_icon":""}]};

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
                clearProps: 'transform',
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
                clearProps: 'transform',
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
                clearProps: 'transform',
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
                    ease: 'power2.out',
                    clearProps: 'transform'
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
                clearProps: 'transform',
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
        } else if (item.issuer_icon && item.issuer_icon.trim().length > 0) {
            var issuerImg = document.createElement('img');
            issuerImg.src = item.issuer_icon.trim();
            issuerImg.alt = (item.issuer || item.title) + ' logo';
            issuerImg.loading = 'lazy';
            issuerImg.className = 'achievement-issuer-logo';
            imgContainer.appendChild(issuerImg);
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
                ease: 'power2.out',
                clearProps: 'transform'
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
        h4.style.color = 'var(--sienna)';
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
                ease: 'power2.out',
                clearProps: 'transform'
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

// ============================================================
// 3D TILT + RADIAL GLOW ON CARDS (event delegation)
// Works for dynamically created cards
// ============================================================
(function() {
    var TILT_SELECTORS = '.skills-category, .exp-tile, .achievement-category-tile';

    // Inject glow div into cards that don't have one
    function ensureGlow(card) {
        if (card.querySelector('.card-glow')) return;
        var glow = document.createElement('div');
        glow.className = 'card-glow';
        card.insertBefore(glow, card.firstChild);
    }

    document.addEventListener('mousemove', function(e) {
        var card = e.target.closest(TILT_SELECTORS);
        if (!card) return;

        ensureGlow(card);
        var glow = card.querySelector('.card-glow');

        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;

        card.style.transform = 'perspective(600px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) scale(1.02)';
        if (glow) {
            glow.style.background = 'radial-gradient(circle at ' + ((x + 0.5) * 100) + '% ' + ((y + 0.5) * 100) + '%, rgba(196,82,42,0.1) 0%, transparent 60%)';
        }
    });

    document.addEventListener('mouseleave', function(e) {
        var card = e.target.closest(TILT_SELECTORS);
        if (!card) return;
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(function() { card.style.transition = ''; }, 500);
    }, true);

    // Also handle mouseleave on cards directly via delegation
    document.addEventListener('mouseout', function(e) {
        var card = e.target.closest(TILT_SELECTORS);
        if (!card) return;
        // Check if we're actually leaving the card (not entering a child)
        var related = e.relatedTarget;
        if (related && card.contains(related)) return;
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(function() { card.style.transition = ''; }, 500);
    });
})();


// ============================================================
// FOOTER — CONTENT REVEAL ON SCROLL
// ============================================================
(function() {
    var footer = document.querySelector('.end');
    if (!footer) return;

    var endContent = footer.querySelector('.end-content');
    if (endContent) {
        gsap.from(endContent, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: footer,
                start: 'top 70%',
                once: true
            }
        });
    }
})();

// ============================================================
// RE-REGISTER CURSOR HOVER ON DYNAMIC ELEMENTS
// The initial cursor setup runs before cards exist.
// This uses event delegation instead.
// ============================================================
(function() {
    var ring = document.querySelector('.cursor-ring');
    if (!ring) return;
    var HOVER_SELECTORS = 'a, button, .exp-tile, .proj-tile, .skills-item, .achievement-category-tile, .edu-card, .exp-project-card, .achievement-card, .skills-category';

    document.addEventListener('mouseover', function(e) {
        if (e.target.closest(HOVER_SELECTORS)) {
            ring.classList.add('hovering');
        }
    });
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest(HOVER_SELECTORS)) {
            var related = e.relatedTarget;
            if (related && related.closest && related.closest(HOVER_SELECTORS)) return;
            ring.classList.remove('hovering');
        }
    });
})();


// ============================================================
// WEATHER MOOD SYSTEM
// Fetches real weather via IP geolocation + Open-Meteo,
// then applies ambient visual effects to match the mood.
// API calls happen exactly ONCE on page load.
// ============================================================
(function() {
    'use strict';

    // --- CONFIGURATION ---
    var CONFIG = {
        GEO_URL: 'https://ipapi.co/json/',
        WEATHER_URL: 'https://api.open-meteo.com/v1/forecast',
        DEFAULT_LAT: 42.27,
        DEFAULT_LON: -71.80,
        DEFAULT_CITY: '',
        DEFAULT_MOOD: 'clear',
        WIND_THRESHOLD: 40,
        TIMEOUT: 5000,
        PARTICLE_COUNTS: { rain: 120, snow: 80, wind: 35 },
        BUTTERFLY_COUNT: 4,
        MOUSE_HISTORY_SIZE: 60
    };

    // --- WMO CODE -> MOOD ---
    function wmoToMood(code, windSpeed) {
        if (code <= 1) {
            return (windSpeed > CONFIG.WIND_THRESHOLD) ? 'windy' : 'clear';
        }
        if (code <= 3) {
            return (windSpeed > CONFIG.WIND_THRESHOLD) ? 'windy' : 'cloudy';
        }
        if (code === 45 || code === 48) return 'foggy';
        if (code >= 51 && code <= 67) return 'rainy';
        if (code >= 71 && code <= 77) return 'snowy';
        if (code >= 80 && code <= 82) return 'rainy';
        if (code >= 85 && code <= 86) return 'snowy';
        if (code >= 95) return 'thunderstorm';
        return 'clear';
    }

    // --- WEATHER ICON SVGs ---
    var ICONS = {
        clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
        cloudy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>',
        rainy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 13v6M8 13v6M12 15v6M20 9.5A4.5 4.5 0 0018 1a6 6 0 00-11.6 2A4.5 4.5 0 003 9.5 4 4 0 004 17h14a4 4 0 002-7.5z"/></svg>',
        snowy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 9.5A4.5 4.5 0 0018 1a6 6 0 00-11.6 2A4.5 4.5 0 003 9.5 4 4 0 004 17h14a4 4 0 002-7.5z"/><path d="M8 21l.5-1M12 21l.5-1M16 21l.5-1"/><circle cx="8.5" cy="19" r="0.5" fill="currentColor"/><circle cx="12.5" cy="19" r="0.5" fill="currentColor"/><circle cx="16.5" cy="19" r="0.5" fill="currentColor"/></svg>',
        thunderstorm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/><path d="M13 12l-2 5h3l-2 5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        foggy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 10h16M4 14h12M4 18h16" stroke-linecap="round"/></svg>',
        windy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.59 4.59A2 2 0 1111 8H2M12.59 19.41A2 2 0 1014 16H2M17.73 7.73A2.5 2.5 0 1119.5 12H2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };

    // --- BUTTERFLY SVG ---
    var BUTTERFLY_COLORS = ['#7a9e87', '#c4522a', '#1e3d2f', '#e8855e'];
    function butterflyHTML(color) {
        return '<svg viewBox="0 0 24 24" fill="' + color + '" opacity="0.6">'
            + '<path class="wing-l" d="M12 12C9 8 4 6 2 9s3 7 6 6c1-.3 2.5-1.5 4-3z"/>'
            + '<path class="wing-r" d="M12 12c3-4 8-6 10-3s-3 7-6 6c-1-.3-2.5-1.5-4-3z"/>'
            + '<ellipse cx="12" cy="14" rx="0.5" ry="3" fill="' + color + '" opacity="0.8"/>'
            + '</svg>';
    }

    // --- STATE (set once, never re-fetched) ---
    var state = {
        mood: null,
        canvas: null,
        ctx: null,
        particles: [],
        butterflies: [],
        mouseHistory: [],
        mx: window.innerWidth / 2,
        my: window.innerHeight / 2,
        animRunning: false,
        lightningTimer: null
    };

    // --- PREFLIGHT ---
    function shouldRunEffects() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        if (window.innerWidth <= 768) return false;
        return true;
    }

    // --- FETCH WITH TIMEOUT ---
    function fetchWithTimeout(url, ms) {
        return Promise.race([
            fetch(url).then(function(r) { return r.json(); }),
            new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('timeout')); }, ms);
            })
        ]);
    }

    // --- API CALLS (run exactly once) ---
    function fetchLocation() {
        return fetchWithTimeout(CONFIG.GEO_URL, CONFIG.TIMEOUT)
            .then(function(data) {
                return {
                    lat: data.latitude || CONFIG.DEFAULT_LAT,
                    lon: data.longitude || CONFIG.DEFAULT_LON,
                    city: data.city || CONFIG.DEFAULT_CITY,
                    region: data.region_code || ''
                };
            })
            .catch(function() {
                return { lat: CONFIG.DEFAULT_LAT, lon: CONFIG.DEFAULT_LON, city: '', region: '' };
            });
    }

    function fetchWeather(lat, lon) {
        var url = CONFIG.WEATHER_URL
            + '?latitude=' + lat
            + '&longitude=' + lon
            + '&current=weather_code,temperature_2m,wind_speed_10m'
            + '&timezone=auto';
        return fetchWithTimeout(url, CONFIG.TIMEOUT)
            .then(function(data) {
                var c = data.current || {};
                return {
                    code: c.weather_code != null ? c.weather_code : 0,
                    temp: c.temperature_2m != null ? c.temperature_2m : null,
                    wind: c.wind_speed_10m != null ? c.wind_speed_10m : 0
                };
            })
            .catch(function() {
                return { code: 0, temp: null, wind: 0 };
            });
    }

    // --- NAVBAR INDICATOR ---
    var MOOD_LABELS = {
        clear: 'Sunny', cloudy: 'Cloudy', rainy: 'Rainy',
        snowy: 'Snowy', thunderstorm: 'Thunder', foggy: 'Foggy', windy: 'Windy'
    };

    function updateIndicator(mood, weather, loc) {
        var el = document.getElementById('weather-indicator');
        if (!el) return;
        var html = (ICONS[mood] || ICONS.clear);
        html += '<span class="weather-label">' + (MOOD_LABELS[mood] || mood) + '</span>';
        if (weather.temp !== null) {
            html += '<span class="weather-temp">' + Math.round(weather.temp) + '\u00B0C</span>';
        }
        if (loc.region) {
            html += '<span class="weather-region">' + loc.region + '</span>';
        }
        el.innerHTML = html;
        el.title = loc.city;
        el.classList.add('loaded');
    }

    // --- EFFECT DISPATCHER ---
    function startEffects(mood) {
        state.mood = mood;
        switch (mood) {
            case 'clear':        initSun(); initButterflies(); break;
            case 'rainy':        initCanvasParticles('rain'); break;
            case 'snowy':        initCanvasParticles('snow'); break;
            case 'cloudy':       initClouds(); break;
            case 'thunderstorm': initCanvasParticles('rain'); initLightning(); break;
            case 'foggy':        initFog(); break;
            case 'windy':        initCanvasParticles('wind'); break;
        }
    }

    // ========================================
    // CANVAS PARTICLE SYSTEM (rain/snow/wind)
    // ========================================
    function initCanvasParticles(type) {
        state.canvas = document.getElementById('weather-canvas');
        if (!state.canvas) return;
        state.ctx = state.canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', debounce(resizeCanvas, 250));
        state.canvas.style.display = 'block';
        createParticles(type);
        tickCanvas(type);
    }

    function resizeCanvas() {
        if (!state.canvas) return;
        state.canvas.width = window.innerWidth;
        state.canvas.height = window.innerHeight;
    }

    function createParticles(type) {
        var count = CONFIG.PARTICLE_COUNTS[type] || 100;
        state.particles = [];
        var w = window.innerWidth, h = window.innerHeight;
        for (var i = 0; i < count; i++) {
            if (type === 'rain') {
                state.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    speed: 4 + Math.random() * 5,
                    len: 12 + Math.random() * 12
                });
            } else if (type === 'snow') {
                state.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: 1 + Math.random() * 2.5,
                    speed: 0.4 + Math.random() * 1.2,
                    drift: Math.random() * Math.PI * 2
                });
            } else if (type === 'wind') {
                state.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    speed: 2.5 + Math.random() * 4,
                    size: 3 + Math.random() * 5,
                    rot: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.1,
                    vy: (Math.random() - 0.5) * 1.5,
                    color: Math.random() > 0.5 ? 'rgba(122,158,135,' : 'rgba(196,82,42,'
                });
            }
        }
    }

    var _time = 0;
    function tickCanvas(type) {
        if (!state.ctx) return;
        var ctx = state.ctx;
        var w = state.canvas.width, h = state.canvas.height;
        ctx.clearRect(0, 0, w, h);
        _time += 0.016;

        for (var i = 0; i < state.particles.length; i++) {
            var p = state.particles[i];

            if (type === 'rain') {
                ctx.strokeStyle = 'rgba(30,61,47,0.18)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + 0.5, p.y + p.len);
                ctx.stroke();
                p.y += p.speed;
                p.x += 0.3;
                if (p.y > h) { p.y = -p.len; p.x = Math.random() * w; }

            } else if (type === 'snow') {
                ctx.fillStyle = 'rgba(200,195,185,0.55)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                p.y += p.speed;
                p.x += Math.sin(_time * 1.5 + p.drift) * 0.5;
                if (p.y > h + p.r) { p.y = -p.r; p.x = Math.random() * w; }

            } else if (type === 'wind') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color + '0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                p.x -= p.speed;
                p.y += p.vy + Math.sin(_time * 2 + i) * 0.3;
                p.rot += p.rotSpeed;
                if (p.x < -20) { p.x = w + 20; p.y = Math.random() * h; }
                if (p.y > h + 20 || p.y < -20) { p.y = Math.random() * h; }
            }
        }

        state.animRunning = true;
        requestAnimationFrame(function() { tickCanvas(type); });
    }

    // ========================================
    // SUN
    // ========================================
    function initSun() {
        var container = document.getElementById('weather-effects');
        if (!container) return;
        var sun = document.createElement('div');
        sun.className = 'weather-sun';

        // Build rays as line paths
        var innerRays = '';
        var outerRays = '';
        for (var i = 0; i < 12; i++) {
            var angle = i * 30;
            var rad = angle * Math.PI / 180;
            // Inner rays (shorter, thicker)
            var ix1 = 50 + Math.cos(rad) * 18;
            var iy1 = 50 + Math.sin(rad) * 18;
            var ix2 = 50 + Math.cos(rad) * 28;
            var iy2 = 50 + Math.sin(rad) * 28;
            innerRays += '<line x1="'+ix1+'" y1="'+iy1+'" x2="'+ix2+'" y2="'+iy2+'"/>';
            // Outer rays (longer, thinner, offset by 15deg)
            var orad = (angle + 15) * Math.PI / 180;
            var ox1 = 50 + Math.cos(orad) * 24;
            var oy1 = 50 + Math.sin(orad) * 24;
            var ox2 = 50 + Math.cos(orad) * 38;
            var oy2 = 50 + Math.sin(orad) * 38;
            outerRays += '<line x1="'+ox1+'" y1="'+oy1+'" x2="'+ox2+'" y2="'+oy2+'"/>';
        }

        sun.innerHTML = '<svg viewBox="0 0 100 100">'
            + '<defs><radialGradient id="sunGrad">'
            + '<stop offset="0%" stop-color="#fff8e0"/>'
            + '<stop offset="40%" stop-color="#f5d76e"/>'
            + '<stop offset="100%" stop-color="#e8a830"/>'
            + '</radialGradient></defs>'
            + '<g class="sun-rays-outer">' + outerRays + '</g>'
            + '<g class="sun-rays">' + innerRays + '</g>'
            + '<circle class="sun-core" cx="50" cy="50" r="14"/>'
            + '<circle class="sun-shimmer" cx="46" cy="46" r="10"/>'
            + '</svg>';

        container.appendChild(sun);
    }

    // ========================================
    // BUTTERFLIES (trail the mouse cursor)
    // ========================================
    function initButterflies() {
        var container = document.getElementById('weather-effects');
        if (!container) return;

        // Track mouse into ring buffer
        window.addEventListener('mousemove', function(e) {
            state.mx = e.clientX;
            state.my = e.clientY;
        });

        // Fill initial history
        for (var h = 0; h < CONFIG.MOUSE_HISTORY_SIZE; h++) {
            state.mouseHistory.push({ x: state.mx, y: state.my });
        }

        // Create butterfly elements
        for (var i = 0; i < CONFIG.BUTTERFLY_COUNT; i++) {
            var el = document.createElement('div');
            el.className = 'weather-butterfly';
            el.innerHTML = butterflyHTML(BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length]);
            // Stagger the wing animation
            el.style.animationDelay = (i * 0.08) + 's';
            container.appendChild(el);
            state.butterflies.push({
                el: el,
                x: state.mx,
                y: state.my,
                offset: (i + 1) * Math.floor(CONFIG.MOUSE_HISTORY_SIZE / (CONFIG.BUTTERFLY_COUNT + 1))
            });
        }

        // Animation loop
        (function butterLoop() {
            // Push latest mouse position
            state.mouseHistory.push({ x: state.mx, y: state.my });
            if (state.mouseHistory.length > CONFIG.MOUSE_HISTORY_SIZE) {
                state.mouseHistory.shift();
            }

            for (var b = 0; b < state.butterflies.length; b++) {
                var bf = state.butterflies[b];
                var idx = Math.max(0, state.mouseHistory.length - 1 - bf.offset);
                var target = state.mouseHistory[idx];

                // Smooth interpolation
                bf.x += (target.x - bf.x) * 0.08;
                bf.y += (target.y - bf.y) * 0.08;

                // Natural flutter
                var flutter = Math.sin(_time * 3 + b * 1.8) * 10;
                var hFlutter = Math.cos(_time * 2.2 + b * 2.5) * 6;

                bf.el.style.transform = 'translate(' + (bf.x - 11 + hFlutter) + 'px,' + (bf.y - 11 + flutter) + 'px)';
            }
            requestAnimationFrame(butterLoop);
        })();
    }

    // ========================================
    // CLOUDS
    // ========================================
    function initClouds() {
        var container = document.getElementById('weather-effects');
        if (!container) return;

        var cloudSVG = '<svg viewBox="0 0 200 100" width="200"><path d="M30 80 Q30 50 55 50 Q50 20 85 25 Q100 5 130 20 Q155 10 165 35 Q190 30 185 55 Q200 70 175 80Z" fill="currentColor"/></svg>';
        var configs = [
            { top: '12%', duration: 70, delay: 0,  scale: 1.2, opacity: 0.05 },
            { top: '20%', duration: 90, delay: -30, scale: 0.8, opacity: 0.04 },
            { top: '15%', duration: 60, delay: -50, scale: 1.0, opacity: 0.06 },
            { top: '25%', duration: 80, delay: -15, scale: 0.6, opacity: 0.035 }
        ];

        configs.forEach(function(c) {
            var cloud = document.createElement('div');
            cloud.className = 'weather-cloud';
            cloud.innerHTML = cloudSVG;
            cloud.style.top = c.top;
            cloud.style.opacity = c.opacity;
            cloud.style.transform = 'scale(' + c.scale + ')';
            cloud.style.animation = 'cloudDrift ' + c.duration + 's linear ' + c.delay + 's infinite';
            container.appendChild(cloud);
        });

        // Inject the drift keyframes dynamically
        if (!document.getElementById('cloud-drift-keyframes')) {
            var style = document.createElement('style');
            style.id = 'cloud-drift-keyframes';
            style.textContent = '@keyframes cloudDrift { 0% { left: -220px; } 100% { left: calc(100vw + 20px); } }';
            document.head.appendChild(style);
        }
    }

    // ========================================
    // FOG
    // ========================================
    function initFog() {
        var container = document.getElementById('weather-effects');
        if (!container) return;
        var fog1 = document.createElement('div');
        fog1.className = 'weather-fog weather-fog-1';
        var fog2 = document.createElement('div');
        fog2.className = 'weather-fog weather-fog-2';
        var fog3 = document.createElement('div');
        fog3.className = 'weather-fog weather-fog-3';
        container.appendChild(fog1);
        container.appendChild(fog2);
        container.appendChild(fog3);
    }

    // ========================================
    // LIGHTNING
    // ========================================
    function initLightning() {
        var container = document.getElementById('weather-effects');
        if (!container) return;
        var flash = document.createElement('div');
        flash.className = 'weather-lightning';
        container.appendChild(flash);

        // Lightning bolt SVG paths (varied shapes)
        var boltPaths = [
            'M20 0 L12 18 L22 18 L8 40 L14 22 L6 22 Z',
            'M18 0 L10 15 L20 16 L6 42 L15 20 L7 19 Z',
            'M22 0 L14 14 L24 15 L10 38 L18 18 L8 17 Z'
        ];

        function createBolt() {
            var bolt = document.createElement('div');
            bolt.className = 'weather-bolt';
            var path = boltPaths[Math.floor(Math.random() * boltPaths.length)];
            var size = 60 + Math.random() * 80;
            bolt.innerHTML = '<svg viewBox="0 0 30 42" width="' + size + '" height="' + (size * 1.4) + '">'
                + '<path d="' + path + '" fill="rgba(255,255,255,0.9)" stroke="rgba(200,180,255,0.6)" stroke-width="0.5"/>'
                + '</svg>';
            bolt.style.top = (90 + Math.random() * 100) + 'px';
            bolt.style.left = (10 + Math.random() * 80) + 'vw';
            container.appendChild(bolt);
            return bolt;
        }

        function triggerFlash() {
            // Screen flash
            flash.classList.remove('flash');
            void flash.offsetWidth;
            flash.classList.add('flash');

            // Show 1-2 bolt SVGs
            var boltCount = Math.random() > 0.4 ? 2 : 1;
            var bolts = [];
            for (var i = 0; i < boltCount; i++) {
                var bolt = createBolt();
                bolt.classList.add('strike');
                bolts.push(bolt);
            }

            // Clean up bolts after animation
            setTimeout(function() {
                bolts.forEach(function(b) { b.remove(); });
            }, 600);

            // Sometimes do a quick double-flash
            if (Math.random() > 0.6) {
                setTimeout(function() {
                    flash.classList.remove('flash');
                    void flash.offsetWidth;
                    flash.classList.add('flash');
                }, 200 + Math.random() * 300);
            }

            // Next flash in 3-8 seconds
            state.lightningTimer = setTimeout(triggerFlash, 3000 + Math.random() * 5000);
        }

        // First flash after a short delay
        state.lightningTimer = setTimeout(triggerFlash, 1500 + Math.random() * 3000);
    }

    // --- UTILITY ---
    function debounce(fn, ms) {
        var timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn, ms);
        };
    }

    // ========================================
    // BOOTSTRAP — runs exactly once
    // ========================================
    function init() {
        try {
            // URL param override for testing: ?mood=rainy, ?mood=snowy, etc.
            var urlMood = new URLSearchParams(window.location.search).get('mood');
            var VALID_MOODS = ['clear', 'cloudy', 'rainy', 'snowy', 'thunderstorm', 'foggy', 'windy'];
            if (urlMood && VALID_MOODS.indexOf(urlMood) !== -1) {
                var fakeWeather = { code: 0, temp: 22, wind: 0 };
                var fakeLoc = { lat: 42.27, lon: -71.80, city: 'Test Mode', region: '' };
                updateIndicator(urlMood, fakeWeather, fakeLoc);
                if (shouldRunEffects()) startEffects(urlMood);
                console.log('[Weather] Debug mode — mood forced to: ' + urlMood);
                return;
            }

            fetchLocation().then(function(loc) {
                return fetchWeather(loc.lat, loc.lon).then(function(weather) {
                    var mood = wmoToMood(weather.code, weather.wind);
                    updateIndicator(mood, weather, loc);
                    if (shouldRunEffects()) {
                        startEffects(mood);
                    }
                });
            });
        } catch (e) {
            console.warn('Weather mood system error:', e);
        }
    }

    // Delay init so hero animations finish first
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 2000);
        });
    } else {
        setTimeout(init, 2000);
    }
})();