document.addEventListener("DOMContentLoaded", () => {
    setupPreloader();
    setupCustomCursor();
    setupMagneticElements();

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--bg-color)';
            navLinks.style.padding = '20px 0';
            navLinks.style.alignItems = 'center';
        });
    }

    // Generate Floating Constellation
    createConstellation();

    // 3D Parallax Mouse Move Effect
    setupParallax();

    // Generic 3D Tilt Effect on Elements
    setup3DTilt();
    
    // Scroll Reveal Observer
    setupScrollReveal();

    // Typewriter effect
    setupTypewriter();
    
    // Scroll Progress Bar
    setupScrollProgress();
});

function setupTypewriter() {
    const textStr = "AI Engineer • Data Analyst • ML Enthusiast • C++ DSA Developer";
    const element = document.getElementById('typewriter');
    if(!element) return;
    
    let i = 0;
    element.innerHTML = "";
    function typeWriter() {
        if (i < textStr.length) {
            element.innerHTML += textStr.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    setTimeout(typeWriter, 1000);
}

function setupScrollProgress() {
    const progressBar = document.getElementById("scroll-progress");
    if(!progressBar) return;
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });
}

function createConstellation() {
    const container = document.getElementById('particles-container');
    if(!container) return;
    
    container.innerHTML = '<canvas id="constellation-canvas"></canvas>';
    const canvas = document.getElementById('constellation-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height, particles;
    
    function init() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        particles = [];
        const numParticles = Math.floor((width * height) / 10000);
        for(let i = 0; i < numParticles; i++) {
            const size = Math.random() * 2 + 0.5;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * (size * 0.4),
                vy: (Math.random() - 0.5) * (size * 0.4),
                radius: size,
                alpha: size / 2.5
            });
        }
    }
    
    let mouse = { x: null, y: null };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('resize', init);
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for(let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            if(p.x < 0 || p.x > width) p.vx = -p.vx;
            if(p.y < 0 || p.y > height) p.vy = -p.vy;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(79, 195, 247, ${p.alpha})`;
            ctx.shadowBlur = p.radius * 2;
            ctx.shadowColor = '#00E5FF';
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Connect to nearby particles
            for(let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                
                if(dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    let lineAlpha = (0.3 - dist/400) * ((p.alpha + p2.alpha) / 2);
                    if (lineAlpha < 0) lineAlpha = 0;
                    ctx.strokeStyle = `rgba(79, 195, 247, ${lineAlpha})`;
                    ctx.stroke();
                }
            }
            
            // Connect to mouse
            if(mouse.x != null) {
                let distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if(distMouse < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(142, 36, 170, ${0.5 - distMouse/300})`;
                    ctx.stroke();
                }
            }
        }
    }
    
    init();
    animate();
}

function setupParallax() {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // Parallax elements
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.05;
            const x = mouseX * speed * 100;
            const y = mouseY * speed * 100;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Particles parallax not needed or applied differently with canvas
        // (Canvas constellation follows mouse natively).
        const targetCanvas = document.getElementById('constellation-canvas');
        if(targetCanvas) {
            const x = mouseX * 20;
            const y = mouseY * 20;
            targetCanvas.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

function setup3DTilt() {
    // Select all elements that should tilt (including hero image)
    const tiltElements = document.querySelectorAll('.tilt-card, .hero-image-container');
    
    tiltElements.forEach(container => {
        // If it's the hero container, the target is the image, else it's the container itself
        const target = container.classList.contains('hero-image-container') ? 
                      container.querySelector('.hero-image') : container;
                      
        if(!target) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const multiplier = container.classList.contains('hero-image-container') ? 10 : 15;
            
            const rotateX = ((y - centerY) / centerY) * -multiplier; 
            const rotateY = ((x - centerX) / centerX) * multiplier;
            
            target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        container.addEventListener('mouseleave', () => {
            target.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

function setupScrollReveal() {
    if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Single Elements Reveal
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => {
            gsap.fromTo(el, 
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Staggered Grids (Cards)
        const grids = document.querySelectorAll('.skills-grid-modern, .projects-grid-modern, .cert-grid-modern');
        grids.forEach(grid => {
            const cards = grid.querySelectorAll('.tilt-card');
            if(cards.length > 0) {
                gsap.fromTo(cards, 
                    { y: 60, opacity: 0, scale: 0.9 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: grid,
                            start: "top 85%",
                        }
                    }
                );
            }
        });
    } else {
        // Fallback if GSAP fails to load
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => observer.observe(el));
    }
}

// --- Preloader ---
function setupPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loader-progress');
    const percentageText = document.getElementById('loading-percentage');
    
    if(!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if(progress > 100) progress = 100;
        
        if(progressBar) progressBar.style.width = progress + '%';
        if(percentageText) percentageText.innerText = progress + '%';

        if(progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => document.body.classList.add('loaded'), 500);
            }, 600);
        }
    }, 100);
}

// --- Custom Cursor ---
function setupCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if(!dot || !outline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
    });

    function renderCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.transform = `translate(calc(-50% + ${outlineX}px), calc(-50% + ${outlineY}px))`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverables = document.querySelectorAll('a, button, .btn, .tilt-card, .menu-toggle, .social-icon, .skill-modern-card, .cert-modern-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// --- Magnetic Elements ---
function setupMagneticElements() {
    const magnets = document.querySelectorAll('.btn, .social-icon, .contact-link-item');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        magnet.addEventListener('mouseleave', () => {
            magnet.style.transform = ''; // reset to let css take over
        });
    });
}
