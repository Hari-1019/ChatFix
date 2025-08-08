// ============================================
// EMAILJS CONFIGURATION
// ============================================
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_k5f80xv'; // Replace with your EmailJS Service ID
const EMAILJS_TEMPLATE_ID = 'template_0rjy7w3'; // Replace with your EmailJS Template ID
const EMAILJS_PUBLIC_KEY = 'CcFjVcwP28kMWzvcl'; // Replace with your EmailJS Public Key

// Initialize EmailJS when the page loads
(function() {
    // Only initialize if EmailJS is available
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
    } else {
        console.warn('EmailJS library not loaded. Please add the EmailJS CDN to your HTML.');
    }
})();

// Function to scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initializeAnimations();
    
    // Mobile menu functionality
    initializeMobileMenu();
    
    // Smooth scrolling for all navigation links
    initializeSmoothScrolling();
    
    // Header scroll effects
    initializeHeaderEffects();
});

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change hamburger icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize header scroll effects
function initializeHeaderEffects() {
    const header = document.querySelector('.header');
    const navContainer = document.querySelector('.nav-container');

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header && navContainer) {
            if (currentScrollY > 100) {
                navContainer.style.background = 'rgba(255, 255, 255, 0.98)';
                navContainer.style.backdropFilter = 'blur(15px)';
                navContainer.style.webkitBackdropFilter = 'blur(15px)';
                navContainer.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            } else {
                navContainer.style.background = 'rgba(255, 255, 255, 0.95)';
                navContainer.style.backdropFilter = 'blur(10px)';
                navContainer.style.webkitBackdropFilter = 'blur(10px)';
                navContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

// ============================================
// ENHANCED EMAIL FUNCTIONALITY WITH EMAILJS
// ============================================
function sendEmail(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Get form data
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'service', 'message'];
    const missingFields = requiredFields.filter(field => !formObject[field] || formObject[field].trim() === '');
    
    if (missingFields.length > 0) {
        showNotification(`Please fill in the following required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Check if EmailJS is properly initialized
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Falling back to mailto method.');
        sendViaMailto(formObject, submitButton, originalButtonText, form);
        return;
    }
    
    // Prepare email parameters for EmailJS
    const templateParams = {
        from_name: formObject.name,
        from_email: formObject.email,
        company: formObject.company || 'Not provided',
        phone: formObject.phone || 'Not provided',
        service: formObject.service,
        message: formObject.message,
        sent_time: new Date().toLocaleString(),
        to_email: 'harivarshan063@gmail.com' // Your email address
    };
    
    // Send email using EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showNotification('🎉 Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            form.reset();
            
            // Send auto-reply to customer (optional)
            sendAutoReply(formObject);
        })
        .catch(function(error) {
            console.error('EmailJS failed:', error);
            
            // Fallback to mailto method if EmailJS fails
            showNotification('Using alternative email method...', 'info');
            setTimeout(() => {
                sendViaMailto(formObject, submitButton, originalButtonText, form);
            }, 1000);
        })
        .finally(function() {
            // Reset button state
            setTimeout(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 2000);
        });
}

// Send auto-reply to customer (optional feature)
function sendAutoReply(formData) {
    // This is optional - you can create a separate template in EmailJS for auto-replies
    // Uncomment and configure if you want to send automatic confirmation emails to customers
    /*
    const autoReplyParams = {
        to_email: formData.email,
        to_name: formData.name,
        service_requested: formData.service,
        reply_to: 'harivarshan063@gmail.com'
    };
    
    // Use a different template ID for auto-reply
    emailjs.send(EMAILJS_SERVICE_ID, 'YOUR_AUTOREPLY_TEMPLATE_ID', autoReplyParams)
        .then(function(response) {
            console.log('Auto-reply sent to customer');
        })
        .catch(function(error) {
            console.error('Auto-reply failed:', error);
        });
    */
}

// Fallback: Send via mailto
function sendViaMailto(formObject, submitButton, originalButtonText, form) {
    try {
        const emailSubject = `🔴 URGENT: New Contact Form Submission from ${formObject.name}`;
        const emailBody = `
=== ChatFIX WEBSITE CONTACT FORM SUBMISSION ===

📧 CUSTOMER INQUIRY DETAILS:
▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫

👤 CUSTOMER INFORMATION:
Name: ${formObject.name}
Email: ${formObject.email}
Company: ${formObject.company || 'Not provided'}
Phone: ${formObject.phone || 'Not provided'}

🎯 SERVICE REQUEST:
Service Interest: ${formObject.service}

💬 CUSTOMER MESSAGE:
${formObject.message}

▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫

⏰ SUBMISSION DETAILS:
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}

📝 ACTION REQUIRED:
• Respond to customer within 24 hours
• Customer expects contact at: ${formObject.email}
• Phone contact available: ${formObject.phone || 'Not provided'}

▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫

This message was sent from the ChatFIX website contact form.
`;
        
        const mailtoLink = `mailto:harivarshan063@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        window.open(mailtoLink, '_blank');
        
        showNotification('📧 Opening your email client to send the message...', 'info');
        
        // Reset form
        setTimeout(() => {
            form.reset();
        }, 1000);
        
    } catch (error) {
        console.error('Error with mailto:', error);
        showNotification('Please email us directly at harivarshan063@gmail.com', 'error');
    } finally {
        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.style.background = '#4CAF50';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.background = '#f44336';
            notification.style.color = 'white';
            break;
        case 'info':
            notification.style.background = '#2196F3';
            notification.style.color = 'white';
            break;
        default:
            notification.style.background = '#333';
            notification.style.color = 'white';
    }
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}