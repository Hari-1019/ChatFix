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
                // Keep the same oval styling when scrolled
                navContainer.style.background = 'rgba(255, 255, 255, 0.98)';
                navContainer.style.backdropFilter = 'blur(15px)';
                navContainer.style.webkitBackdropFilter = 'blur(15px)';
                navContainer.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            } else {
                // Original oval styling
                navContainer.style.background = 'rgba(255, 255, 255, 0.95)';
                navContainer.style.backdropFilter = 'blur(10px)';
                navContainer.style.webkitBackdropFilter = 'blur(10px)';
                navContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

// Enhanced form submission with email functionality
function sendEmail(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
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
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        alert('Please enter a valid email address.');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    // ============================================
    // ADMIN EMAIL CONFIGURATION
    // ============================================
    // TO CHANGE ADMIN EMAIL: Update the email address below
    // Current admin email: harivarshan063@gmail.com
    // When ChatFIX email is created, replace with: chatfixbpo@gmail.com
    const ADMIN_EMAIL = 'harivarshan063@gmail.com'; // ← CHANGE THIS EMAIL ADDRESS HERE
    
    // ============================================
    // EMAIL SENDING FUNCTIONALITY
    // ============================================
    
    // Method 1: EmailJS (Recommended for production)
    // You need to sign up at https://www.emailjs.com/ and get your service ID, template ID, and user ID
    
    // Method 2: Formspree (Alternative service)
    // You can sign up at https://formspree.io/ and get an endpoint
    
    // Method 3: Using mailto (current method - opens user's email client)
    sendViaMailto(formObject, ADMIN_EMAIL, submitButton, originalButtonText, form);
    
    // Method 4: Using a backend service (for production)
    // sendViaBackend(formObject, ADMIN_EMAIL, submitButton, originalButtonText, form);
}

// Method 3: Send via mailto (current implementation)
function sendViaMailto(formObject, adminEmail, submitButton, originalButtonText, form) {
    try {
        // Create email content
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

This message was automatically generated from the ChatFIX website contact form.
Website: ChatFIX Customer Support Services
`;
        
        // Create mailto link
        const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Show success message to user
        showSuccessMessage(formObject.name, formObject.email);
        
        // Open email client automatically
        window.open(mailtoLink, '_blank');
        
        // Also send a copy to the customer (optional)
        sendCustomerConfirmation(formObject);
        
        // Reset form
        form.reset();
        
        // Log for debugging
        console.log('✅ Form submitted successfully to:', adminEmail);
        console.log('📧 Customer details:', formObject);
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        alert('There was an error sending your message. Please try again or contact us directly at ' + adminEmail);
    } finally {
        // Reset button state
        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Send confirmation email to customer
function sendCustomerConfirmation(formObject) {
    const customerEmailSubject = `Thank you for contacting ChatFIX - We'll respond within 24 hours`;
    const customerEmailBody = `Dear ${formObject.name},

Thank you for contacting ChatFIX! 

We have received your inquiry about "${formObject.service}" and will respond within 24 hours.

Your message details:
▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫
${formObject.message}
▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫

Our team will contact you at: ${formObject.email}
${formObject.phone ? `Phone: ${formObject.phone}` : ''}

Best regards,
ChatFIX Customer Support Team
📧 Email: harivarshan063@gmail.com
📞 Phone: +94 76-1234567

Visit our website: ChatFIX Professional Customer Support Services`;

    const customerMailtoLink = `mailto:${formObject.email}?subject=${encodeURIComponent(customerEmailSubject)}&body=${encodeURIComponent(customerEmailBody)}`;
    
    // This will open another email to send to customer (optional)
    // setTimeout(() => window.open(customerMailtoLink, '_blank'), 1000);
}

// Method 4: Backend service (for future implementation)
function sendViaBackend(formObject, adminEmail, submitButton, originalButtonText, form) {
    // This is for when you have a backend server
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: adminEmail,
            subject: `New Contact Form Submission from ${formObject.name}`,
            formData: formObject
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage(formObject.name, formObject.email);
            form.reset();
        } else {
            throw new Error('Failed to send email');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
    })
    .finally(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
}

// Enhanced success message
function showSuccessMessage(name, email) {
    const message = `🎉 Thank you ${name}!

✅ Your message has been sent successfully!

📧 We will contact you within 24 hours at: ${email}

Our customer support team will review your inquiry and get back to you with the best solution for your needs.

⏰ Expected response time: Within 24 hours
📞 For urgent matters, call: +94 76-1234567

Thank you for choosing ChatFIX! 🚀`;
    
    alert(message);
}