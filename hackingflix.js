// Particle System for Hero Section
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId) || document.querySelector('.hero-section');
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.6';
        
        if (this.container) {
            this.container.style.position = 'relative';
            this.container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        if (this.container) {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
        }
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#3b82f6' : '#ff6b35'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            });
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }
    
    init() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        // Add to navigation
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            navRight.insertBefore(themeToggle, navRight.firstChild);
        }
        
        // Apply current theme
        this.applyTheme(this.currentTheme);
        
        // Add event listener
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }
}

// Advanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Create intersection observer for scroll-triggered animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements
        this.observeElements();
        
        // Add scroll progress indicator
        this.createScrollProgress();
        
        // Add parallax effect
        this.initParallax();
    }
    
    observeElements() {
        const elements = document.querySelectorAll(`
            .metric-card, .feature-card, .why-card, .testimonial-card, 
            .story-card, .section-header, .hero-content
        `);
        
        elements.forEach(el => {
            el.classList.add('scroll-animate');
            this.observer.observe(el);
        });
    }
    
    animateElement(element) {
        element.classList.add('animate-in');
        
        // Add stagger effect for cards in the same container
        const container = element.closest('.metrics-grid, .features-grid, .testimonials-grid, .stories-carousel');
        if (container) {
            const cards = container.querySelectorAll('.metric-card, .feature-card, .testimonial-card, .story-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }
    }
    
    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            const progressBarElement = document.querySelector('.scroll-progress-bar');
            if (progressBarElement) {
                progressBarElement.style.width = `${scrolled}%`;
            }
        });
    }
    
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-section, .metrics-section');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor(containerId) {
        this.container = document.getElementById(containerId) || document.querySelector('.final-cta');
        this.canvas = null;
        this.ctx = null;
        this.columns = [];
        this.animationId = null;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.1';
        
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.initColumns();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    initColumns() {
        const fontSize = 14;
        const columnCount = Math.floor(this.canvas.width / fontSize);
        
        this.columns = Array(columnCount).fill(0).map(() => ({
            y: Math.random() * this.canvas.height,
            speed: Math.random() * 3 + 1
        }));
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#39ff14';
        this.ctx.font = '14px monospace';
        
        this.columns.forEach((column, index) => {
            const char = String.fromCharCode(0x30A0 + Math.random() * 96);
            const x = index * 14;
            
            this.ctx.fillText(char, x, column.y);
            
            column.y += column.speed;
            
            if (column.y > this.canvas.height && Math.random() > 0.975) {
                column.y = 0;
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Mobile Menu Enhancement
class MobileMenu {
    constructor() {
        this.init();
    }
    
    init() {
        // Create mobile menu toggle
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            navRight.appendChild(mobileToggle);
        }
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <button class="mobile-menu-close"><i class="fas fa-times"></i></button>
                <nav class="mobile-nav">
                    <a href="#features">Features</a>
                    <a href="#testimonials">Testimonials</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div class="mobile-cta">
                    <a href="#" class="login-link">Login</a>
                    <button class="cta-button">Join for FREE</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Event listeners
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on backdrop click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Quote Carousel Functionality
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote-slide');
const totalQuotes = quotes.length;

function showNextQuote() {
    quotes[currentQuote].classList.remove('active');
    currentQuote = (currentQuote + 1) % totalQuotes;
    quotes[currentQuote].classList.add('active');
}

// Auto-rotate quotes every 5 seconds
setInterval(showNextQuote, 5000);

// Counter Animation
function animateCounter() {
    const counter = document.querySelector('.counter');
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString();
    }, 20);
}

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
            counterObserver.unobserve(entry.target);
        }
    });
});

const counterSection = document.querySelector('.trusted-counter');
if (counterSection) {
    counterObserver.observe(counterSection);
}

// Progress Bar Animation
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress');
            progressBars.forEach(bar => {
                bar.style.width = bar.style.width || '100%';
            });
        }
    });
});

const storyCards = document.querySelectorAll('.story-card');
storyCards.forEach(card => {
    progressObserver.observe(card);
});

// Smooth scrolling for CTA buttons
document.querySelectorAll('.cta-button, .hero-cta, .final-cta-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        // Add smooth scroll or modal functionality here
        console.log('CTA clicked - redirect to signup');
    });
});

// Video player functionality
const videoPlayer = document.querySelector('.video-player');
if (videoPlayer) {
    videoPlayer.addEventListener('click', () => {
        // Replace with actual video embed or modal
        alert('Video testimonial would play here');
    });
}

// Download button functionality
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Trigger download or lead capture form
        alert('eBook download would start here');
    });
}

// View all testimonials functionality
const viewAllBtn = document.querySelector('.view-all-btn button');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Navigate to testimonials page or show modal
        alert('View all testimonials page would open here');
    });
}

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

// Apply animation to various sections
document.querySelectorAll('.metric-card, .feature-card, .why-card, .testimonial-card, .story-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// Pulse dots animation for world map
function animatePulseDots() {
    const dots = document.querySelectorAll('.pulse-dot');
    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.style.animationDelay = `${index * 0.5}s`;
        }, index * 200);
    });
}

// Initialize pulse animation when map is visible
const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animatePulseDots();
            mapObserver.unobserve(entry.target);
        }
    });
});

const mapSection = document.querySelector('.global-map-section');
if (mapSection) {
    mapObserver.observe(mapSection);
}

// Logo carousel auto-scroll (if needed for overflow)
const logoCarousel = document.querySelector('.logo-carousel');
if (logoCarousel && logoCarousel.scrollWidth > logoCarousel.clientWidth) {
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollDelay = 50;
    
    function autoScroll() {
        scrollAmount += scrollStep;
        if (scrollAmount >= logoCarousel.scrollWidth - logoCarousel.clientWidth) {
            scrollAmount = 0;
        }
        logoCarousel.scrollLeft = scrollAmount;
    }
    
    // Start auto-scroll on hover
    logoCarousel.addEventListener('mouseenter', () => {
        logoCarousel.autoScrollInterval = setInterval(autoScroll, scrollDelay);
    });
    
    logoCarousel.addEventListener('mouseleave', () => {
        clearInterval(logoCarousel.autoScrollInterval);
    });
}

// Spark animation for trusted counter
function createSparkles() {
    const sparkContainer = document.querySelector('.spark-animation');
    if (!sparkContainer) return;
    
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.style.position = 'absolute';
        spark.style.width = '4px';
        spark.style.height = '4px';
        spark.style.background = '#3b82f6';
        spark.style.borderRadius = '50%';
        spark.style.opacity = '0';
        spark.style.animation = `sparkle-particle 2s infinite ${i * 0.4}s`;
        
        const angle = (i / 5) * 360;
        const radius = 80;
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;
        
        spark.style.left = `calc(50% + ${x}px)`;
        spark.style.top = `calc(50% + ${y}px)`;
        
        sparkContainer.appendChild(spark);
    }
}

// Add CSS for spark particles
const sparkCSS = `
@keyframes sparkle-particle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
}
`;

const style = document.createElement('style');
style.textContent = sparkCSS;
document.head.appendChild(style);

// Initialize sparkles when counter is visible
const sparkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            createSparkles();
            sparkObserver.unobserve(entry.target);
        }
    });
});

if (counterSection) {
    sparkObserver.observe(counterSection);
}

// Horizontal scroll for alumni stories on mobile
const storiesCarousel = document.querySelector('.stories-carousel');
if (storiesCarousel) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    storiesCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - storiesCarousel.offsetLeft;
        scrollLeft = storiesCarousel.scrollLeft;
    });
    
    storiesCarousel.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    storiesCarousel.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    storiesCarousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - storiesCarousel.offsetLeft;
        const walk = (x - startX) * 2;
        storiesCarousel.scrollLeft = scrollLeft - walk;
    });
}

// Loading Screen Management
class LoadingManager {
    constructor() {
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.init();
    }
    
    init() {
        // Hide loading spinner when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (this.loadingSpinner) {
                    this.loadingSpinner.classList.add('fade-out');
                    setTimeout(() => {
                        this.loadingSpinner.style.display = 'none';
                    }, 500);
                }
            }, 1000); // Show spinner for at least 1 second for smooth UX
        });
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor performance and disable heavy animations if needed
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (memoryUsage > 0.8) {
                document.body.classList.add('reduce-animations');
                console.log('High memory usage detected, reducing animations');
            }
        }
        
        // Check for mobile devices and reduce animations accordingly
        if (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent)) {
            document.body.classList.add('mobile-optimized');
        }
    }
}

// Enhanced Analytics
class Analytics {
    constructor() {
        this.events = [];
        this.init();
    }
    
    init() {
        // Track page views
        this.trackEvent('page_view', {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    this.trackEvent('scroll_depth', { depth: maxScroll });
                }
            }
        });
        
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.cta-button, .hero-cta')) {
                this.trackEvent('cta_click', {
                    button: e.target.textContent,
                    section: e.target.closest('section')?.className || 'unknown'
                });
            }
        });
    }
    
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        this.events.push(event);
        console.log('Analytics Event:', event);
        
        // In a real application, you would send this to your analytics service
        // Example: this.sendToAnalytics(event);
    }
}

// Enhanced Error Handling
class ErrorHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            this.reportError(e.error);
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.reportError(e.reason);
        });
    }
    
    reportError(error) {
        // In a real application, you would send this to your error tracking service
        const errorData = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.log('Error Report:', errorData);
        // Example: this.sendToErrorService(errorData);
    }
}

// Enhanced Loading Animation for Building the Next-Gen of Hackers Section
class FeaturesLoadingAnimation {
    constructor() {
        this.featuresSection = document.querySelector('.features-section');
        this.featureCards = document.querySelectorAll('.feature-card');
        this.progressBar = null;
        this.loadingComplete = false;
        
        this.init();
    }
    
    init() {
        if (!this.featuresSection) return;
        
        this.createProgressBar();
        this.setupIntersectionObserver();
        this.addSkeletonLoading();
    }
    
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'features-loading-progress';
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'features-progress-bar';
        
        progressContainer.appendChild(this.progressBar);
        this.featuresSection.appendChild(progressContainer);
    }
    
    addSkeletonLoading() {
        // Add skeleton loading effect initially
        this.featureCards.forEach(card => {
            card.classList.add('feature-card-skeleton');
        });
        
        this.featuresSection.classList.add('loading');
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadingComplete) {
                    this.startLoadingAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(this.featuresSection);
    }
    
    startLoadingAnimation() {
        // Start progress bar animation
        this.animateProgressBar();
        
        // Simulate loading delay
        setTimeout(() => {
            this.removeSkeletonLoading();
            this.animateCards();
        }, 500);
    }
    
    animateProgressBar() {
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
            
            // Hide progress bar after animation
            setTimeout(() => {
                this.progressBar.parentElement.style.opacity = '0';
                setTimeout(() => {
                    this.progressBar.parentElement.remove();
                }, 300);
            }, 2000);
        }
    }
    
    removeSkeletonLoading() {
        this.featureCards.forEach(card => {
            card.classList.remove('feature-card-skeleton');
        });
        
        this.featuresSection.classList.remove('loading');
        this.featuresSection.classList.add('loaded');
    }
    
    animateCards() {
        this.featureCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('loading');
                
                // Add entrance sound effect (optional)
                this.playEntranceSound();
                
                // Add completion effect
                setTimeout(() => {
                    this.addCompletionEffect(card);
                }, 800);
                
            }, index * 150); // Stagger the animations
        });
        
        // Mark loading as complete
        setTimeout(() => {
            this.loadingComplete = true;
            this.addInteractiveEffects();
        }, this.featureCards.length * 150 + 1000);
    }
    
    addCompletionEffect(card) {
        // Add a subtle pulse effect when loading completes
        card.style.animation = 'feature-completion-pulse 0.6s ease-out';
        
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }
    
    addInteractiveEffects() {
        this.featureCards.forEach(card => {
            // Enhanced hover effects after loading
            card.addEventListener('mouseenter', () => {
                this.addHoverGlow(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeHoverGlow(card);
            });
            
            // Add click animation
            card.addEventListener('click', () => {
                this.addClickEffect(card);
            });
        });
    }
    
    addHoverGlow(card) {
        const icon = card.querySelector('.feature-icon');
        if (icon) {
            icon.style.animation = 'icon-hover-glow 0.3s ease-out forwards';
        }
    }
    
    removeHoverGlow(card) {
        const icon = card.querySelector('.feature-icon');
        if (icon) {
            icon.style.animation = '';
        }
    }
    
    addClickEffect(card) {
        card.style.transform = 'translateY(-15px) scale(0.98)';
        
        setTimeout(() => {
            card.style.transform = 'translateY(-15px) scale(1.03)';
        }, 100);
    }
    
    playEntranceSound() {
        // Optional: Add subtle sound effects
        if (window.AudioContext) {
            try {
                const audioContext = new AudioContext();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (error) {
                // Ignore audio errors
            }
        }
    }
}

// CSS animations for completion effects
const featuresAnimationCSS = `
@keyframes feature-completion-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 107, 53, 0.5); }
    100% { transform: scale(1); }
}

@keyframes icon-hover-glow {
    0% { box-shadow: 0 0 0 rgba(255, 107, 53, 0); }
    100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.6); }
}
`;

// Add the CSS to the document
const featuresStyleElement = document.createElement('style');
featuresStyleElement.textContent = featuresAnimationCSS;
document.head.appendChild(featuresStyleElement);

// Goals Mission Section Interactive Functionality
class GoalsMissionSection {
    constructor() {
        this.section = document.querySelector('.goals-mission-section');
        this.timelineButtons = document.querySelectorAll('.timeline-btn');
        this.successCards = document.querySelectorAll('.success-card');
        this.floatingParticles = document.querySelector('.floating-particles');
        this.viewMoreBtn = document.querySelector('.view-more-btn');
        
        if (this.section) {
            this.init();
        }
    }
    
    init() {
        this.createFloatingParticles();
        this.setupTimelineFiltering();
        this.setupScrollAnimations();
        this.setupCardInteractions();
        this.setupViewMoreButton();
        this.animateStatsOnScroll();
    }
    
    createFloatingParticles() {
        if (!this.floatingParticles) return;
        
        // Create floating particles for the cyber background
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: #00ff88;
                border-radius: 50%;
                opacity: ${Math.random() * 0.6 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
                box-shadow: 0 0 10px #00ff88;
            `;
            this.floatingParticles.appendChild(particle);
        }
    }
    
    setupTimelineFiltering() {
        this.timelineButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                this.timelineButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter category
                const category = button.dataset.category;
                
                // Filter cards with animation
                this.filterCards(category);
                
                // Add click effect
                this.addClickEffect(button);
            });
        });
    }
    
    filterCards(category) {
        this.successCards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            
            // Add fade out effect
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0.3';
            
            setTimeout(() => {
                if (category === 'all' || cardCategory === category) {
                    // Show card
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    // Hide card
                    card.style.display = 'none';
                }
            }, 150 + (index * 50)); // Staggered animation
        });
    }
    
    addClickEffect(button) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: 50%;
            top: 50%;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('mission-header')) {
                        this.animateMissionHeader();
                    }
                    
                    if (entry.target.classList.contains('success-card')) {
                        this.animateSuccessCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe mission header
        const missionHeader = document.querySelector('.mission-header');
        if (missionHeader) observer.observe(missionHeader);
        
        // Observe success cards
        this.successCards.forEach(card => observer.observe(card));
        
        // Observe timeline navigation
        const timelineNav = document.querySelector('.timeline-nav');
        if (timelineNav) observer.observe(timelineNav);
    }
    
    animateMissionHeader() {
        const badge = document.querySelector('.mission-badge');
        const title = document.querySelector('.mission-title');
        const subtitle = document.querySelector('.mission-subtitle');
        const stats = document.querySelectorAll('.stat-item');
        
        // Staggered animation
        setTimeout(() => badge?.classList.add('slide-in-top'), 100);
        setTimeout(() => title?.classList.add('slide-in-left'), 300);
        setTimeout(() => subtitle?.classList.add('fade-in-up'), 500);
        
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.classList.add('bounce-in');
                this.animateStatNumber(stat);
            }, 700 + (index * 200));
        });
    }
    
    animateStatNumber(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        if (!numberElement) return;
        
        const finalText = numberElement.textContent;
        const isPercentage = finalText.includes('%');
        const isMultiplier = finalText.includes('x');
        const isNumber = finalText.includes('+');
        
        let targetNumber = 0;
        let suffix = '';
        
        if (isPercentage) {
            targetNumber = parseInt(finalText);
            suffix = '%';
        } else if (isMultiplier) {
            targetNumber = parseFloat(finalText);
            suffix = 'x';
        } else if (isNumber) {
            targetNumber = parseInt(finalText.replace(/[^0-9]/g, ''));
            suffix = '+';
        }
        
        if (targetNumber > 0) {
            this.countUpAnimation(numberElement, targetNumber, suffix, 2000);
        }
    }
    
    countUpAnimation(element, target, suffix, duration) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix === 'x') {
                element.textContent = current.toFixed(1) + suffix;
            } else if (suffix === '+') {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }
    
    animateSuccessCard(card) {
        const avatar = card.querySelector('.person-avatar');
        const ring = card.querySelector('.achievement-ring');
        const metrics = card.querySelectorAll('.metric');
        
        // Avatar glow animation
        setTimeout(() => avatar?.classList.add('glow-pulse'), 200);
        
        // Achievement ring animation
        setTimeout(() => ring?.classList.add('ring-animate'), 400);
        
        // Metrics animation
        metrics.forEach((metric, index) => {
            setTimeout(() => {
                metric.classList.add('metric-pop');
            }, 600 + (index * 150));
        });
    }
    
    setupCardInteractions() {
        this.successCards.forEach(card => {
            // Hover effects
            card.addEventListener('mouseenter', () => {
                card.classList.add('card-hover');
                
                // Enhance spotlight effect
                const spotlight = card.querySelector('.card-spotlight');
                if (spotlight) {
                    spotlight.style.opacity = '1';
                    spotlight.style.transform = 'scale(1.2)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('card-hover');
                
                const spotlight = card.querySelector('.card-spotlight');
                if (spotlight) {
                    spotlight.style.opacity = '0.5';
                    spotlight.style.transform = 'scale(1)';
                }
            });
            
            // Click interaction for mobile
            card.addEventListener('click', () => {
                card.classList.toggle('card-active');
            });
        });
    }
    
    setupViewMoreButton() {
        if (!this.viewMoreBtn) return;
        
        this.viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create loading effect
            const originalText = this.viewMoreBtn.querySelector('span').textContent;
            this.viewMoreBtn.querySelector('span').textContent = 'Loading...';
            this.viewMoreBtn.disabled = true;
            
            // Simulate loading more stories
            setTimeout(() => {
                this.loadMoreStories();
                this.viewMoreBtn.querySelector('span').textContent = originalText;
                this.viewMoreBtn.disabled = false;
            }, 1500);
        });
    }
    
    loadMoreStories() {
        // Create additional success cards dynamically
        const successGrid = document.querySelector('.success-grid');
        const moreStories = [
            {
                name: 'Sneha Reddy',
                category: 'career-change',
                beforeRole: 'HR Manager',
                beforeCompany: 'Retail Corp',
                afterRole: 'CISO',
                afterCompany: 'FinTech Startup',
                salaryIncrease: '400%',
                transitionTime: '6 Months',
                quote: 'From managing people to securing systems - HackingFlix made this incredible transition possible.',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face'
            },
            {
                name: 'Vikram Shah',
                category: 'experienced',
                beforeRole: 'Network Admin',
                beforeCompany: 'Local ISP',
                afterRole: 'Security Architect',
                afterCompany: 'Cisco',
                salaryIncrease: '320%',
                transitionTime: '4 Months',
                quote: 'The advanced penetration testing courses at HackingFlix elevated my career to the next level.',
                image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=120&h=120&fit=crop&crop=face'
            }
        ];
        
        moreStories.forEach((story, index) => {
            setTimeout(() => {
                const cardHTML = this.createSuccessCardHTML(story);
                successGrid.insertAdjacentHTML('beforeend', cardHTML);
                
                // Animate the new card
                const newCard = successGrid.lastElementChild;
                newCard.style.opacity = '0';
                newCard.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    newCard.style.transition = 'all 0.6s ease';
                    newCard.style.opacity = '1';
                    newCard.style.transform = 'translateY(0)';
                }, 100);
                
                // Setup interactions for new card
                this.setupSingleCardInteraction(newCard);
                
            }, index * 300);
        });
        
        // Update counter
        const counter = document.querySelector('.success-counter span');
        if (counter) {
            const currentCount = parseInt(counter.textContent.match(/\d+/)[0]);
            counter.textContent = `+${(currentCount - 2).toLocaleString()} more transformations`;
        }
    }
    
    createSuccessCardHTML(story) {
        return `
            <div class="success-card" data-category="${story.category}">
                <div class="card-spotlight"></div>
                <div class="person-info">
                    <div class="avatar-container">
                        <img src="${story.image}" alt="${story.name}" class="person-avatar">
                        <div class="avatar-glow"></div>
                        <div class="achievement-ring">
                            <div class="ring-progress" style="--progress: 100%"></div>
                        </div>
                    </div>
                    <div class="person-details">
                        <h3 class="person-name">${story.name}</h3>
                        <div class="career-transformation">
                            <div class="career-before">
                                <span class="role">${story.beforeRole}</span>
                                <span class="company">${story.beforeCompany}</span>
                            </div>
                            <div class="transformation-arrow">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                            <div class="career-after">
                                <span class="role">${story.afterRole}</span>
                                <span class="company">${story.afterCompany}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="transformation-metrics">
                    <div class="metric salary-metric">
                        <div class="metric-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="metric-info">
                            <span class="metric-value">${story.salaryIncrease}</span>
                            <span class="metric-label">Salary Increase</span>
                        </div>
                    </div>
                    <div class="metric timeline-metric">
                        <div class="metric-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="metric-info">
                            <span class="metric-value">${story.transitionTime}</span>
                            <span class="metric-label">Transition Time</span>
                        </div>
                    </div>
                </div>

                <div class="success-story">
                    <blockquote>
                        "${story.quote}"
                    </blockquote>
                </div>

                <div class="verification-badge">
                    <i class="fas fa-shield-check"></i>
                    <span>Verified Graduate</span>
                </div>
            </div>
        `;
    }
    
    setupSingleCardInteraction(card) {
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
            const spotlight = card.querySelector('.card-spotlight');
            if (spotlight) {
                spotlight.style.opacity = '1';
                spotlight.style.transform = 'scale(1.2)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
            const spotlight = card.querySelector('.card-spotlight');
            if (spotlight) {
                spotlight.style.opacity = '0.5';
                spotlight.style.transform = 'scale(1)';
            }
        });
        
        card.addEventListener('click', () => {
            card.classList.toggle('card-active');
        });
    }
    
    animateStatsOnScroll() {
        const stats = document.querySelectorAll('.mission-stats .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('stat-animate');
                    
                    // Add pulsing effect to stats
                    setTimeout(() => {
                        entry.target.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            entry.target.style.transform = 'scale(1)';
                        }, 200);
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }
}

// Add CSS for new animations
const goalsMissionStyles = document.createElement('style');
goalsMissionStyles.textContent = `
    /* Goals Mission Interactive Animations */
    .slide-in-top {
        animation: slideInTop 0.6s ease-out forwards;
    }
    
    .slide-in-left {
        animation: slideInLeft 0.8s ease-out forwards;
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .bounce-in {
        animation: bounceIn 0.8s ease-out forwards;
    }
    
    .glow-pulse {
        animation: glowPulse 2s ease-in-out infinite;
    }
    
    .ring-animate .ring-progress {
        animation: ringProgress 2s ease-out forwards;
    }
    
    .metric-pop {
        animation: metricPop 0.5s ease-out forwards;
    }
    
    .card-hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 255, 136, 0.3);
    }
    
    .card-active {
        transform: scale(1.05);
        z-index: 10;
    }
    
    .stat-animate {
        animation: statPulse 0.6s ease-out forwards;
    }
    
    @keyframes slideInTop {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            transform: scale(1.1);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes glowPulse {
        0%, 100% {
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
        50% {
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.8);
        }
    }
    
    @keyframes ringProgress {
        from {
            stroke-dashoffset: 251.2;
        }
        to {
            stroke-dashoffset: 0;
        }
    }
    
    @keyframes metricPop {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes statPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes float-particle {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(goalsMissionStyles);

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleSystem = new ParticleSystem();
    
    // Initialize theme toggle
    const themeToggle = new ThemeToggle();
    
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();
    
    // Initialize matrix rain effect
    const matrixRain = new MatrixRain();
    
    // Initialize mobile menu
    const mobileMenu = new MobileMenu();
      // Initialize new features
    new LoadingManager();
    new BackToTop();
    new PerformanceMonitor();
    new Analytics();
    new ErrorHandler();
    
    // Initialize features section loading animation
    new FeaturesLoadingAnimation();
    
    // Initialize goals mission section functionality
    new GoalsMissionSection();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('All HackingFlix enhancements loaded successfully!');
});

// Enhanced loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate-in');
    }
    
    // Initialize lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Performance timing
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});
