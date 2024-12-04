document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const customizeBtn = document.querySelector('.customization-button');
    const customizeMenu = document.querySelector('.customization-menu');
    const searchInput = document.querySelector('.search-bar input');
    const menuButton = document.querySelector('.menu-button');
    const micButton = document.querySelector('.mic-button');
    const bookNowBtn = document.querySelector('.book-now');

    // State
    let isCustomizeMenuOpen = false;
    let currentFontSize = 100;
    const fontSizeStep = 10;
    const maxFontSize = 150;
    const minFontSize = 70;
    let isListening = false;

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            micButton.style.color = '#ff4444'; // Red color when recording
        };

        recognition.onend = () => {
            isListening = false;
            micButton.style.color = 'var(--primary-color)';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
        };
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + M for microphone
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            toggleMicrophone();
        }
        // Ctrl + B for booking section
        if (e.ctrlKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            scrollToBooking();
        }
    });

    // Microphone Functions
    function toggleMicrophone() {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    }

    micButton.addEventListener('click', toggleMicrophone);

    // Booking Function
    function scrollToBooking() {
        const bookingSection = document.querySelector('.booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    bookNowBtn.addEventListener('click', scrollToBooking);

    // Customize Button and Menu
    customizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isCustomizeMenuOpen = !isCustomizeMenuOpen;
        customizeMenu.style.display = isCustomizeMenuOpen ? 'block' : 'none';
    });

    // Close customize menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!customizeBtn.contains(e.target) && !customizeMenu.contains(e.target)) {
            isCustomizeMenuOpen = false;
            customizeMenu.style.display = 'none';
        }
    });

    // Color Themes
    const themes = {
        default: {
            '--primary-color': '#fdb347',
            '--secondary-color': '#2d2d2d',
            '--background-color': '#fdb347',
            '--text-dark': '#2d2d2d',
            '--text-light': '#ffffff',
            '--button-color': '#fdb347',
            '--button-hover-color': '#e69a2e'
        },
        dark: {
            '--primary-color': '#34495e',
            '--secondary-color': '#2d2d2d',
            '--background-color': '#2d2d2d',
            '--text-dark': '#ffffff',
            '--text-light': '#ffffff',
            '--button-color': '#34495e',
            '--button-hover-color': '#2c3e50'
        },
        purple: {
            '--primary-color': '#9b59b6',
            '--secondary-color': '#2d2d2d',
            '--background-color': '#9b59b6',
            '--text-dark': '#2d2d2d',
            '--text-light': '#ffffff',
            '--button-color': '#9b59b6',
            '--button-hover-color': '#8e44ad'
        },
        green: {
            '--primary-color': '#2ecc71',
            '--secondary-color': '#2d2d2d',
            '--background-color': '#2ecc71',
            '--text-dark': '#2d2d2d',
            '--text-light': '#ffffff',
            '--button-color': '#2ecc71',
            '--button-hover-color': '#27ae60'
        },
        pink: {
            '--primary-color': '#ff69b4',
            '--secondary-color': '#2d2d2d',
            '--background-color': '#ff69b4',
            '--text-dark': '#2d2d2d',
            '--text-light': '#ffffff',
            '--button-color': '#ff69b4',
            '--button-hover-color': '#ff1493'
        },
        babyBlue: {
            '--primary-color': '#89cff0',
            '--secondary-color': '#2d2d2d',
            '--background-color': '#89cff0',
            '--text-dark': '#2d2d2d',
            '--text-light': '#ffffff',
            '--button-color': '#89cff0',
            '--button-hover-color': '#7bb7e9'
        }
    };

    // Create and setup color options
    const colorOptions = document.querySelector('.color-options');
    colorOptions.innerHTML = ''; // Clear existing options
    Object.keys(themes).forEach(theme => {
        const option = document.createElement('button');
        option.classList.add('color-option');
        option.dataset.theme = theme;
        option.style.backgroundColor = themes[theme]['--primary-color'];
        option.innerHTML = `<span class="color-name">${theme.charAt(0).toUpperCase() + theme.slice(1)}</span>`;
        option.addEventListener('click', () => applyTheme(theme));
        colorOptions.appendChild(option);
    });

    function applyTheme(themeName) {
        const theme = themes[themeName];
        Object.keys(theme).forEach(property => {
            document.documentElement.style.setProperty(property, theme[property]);
        });
        // Save theme preference
        localStorage.setItem('selectedTheme', themeName);
    }

    // Font Size Controls
    const increaseFontBtn = document.getElementById('increaseFont');
    const decreaseFontBtn = document.getElementById('decreaseFont');
    const fontSizeDisplay = document.querySelector('.font-size-display');

    function updateFontSize(change) {
        currentFontSize = Math.max(minFontSize, Math.min(maxFontSize, currentFontSize + change));
        document.documentElement.style.fontSize = `${currentFontSize}%`;
        fontSizeDisplay.textContent = `${currentFontSize}%`;
        // Save font size preference
        localStorage.setItem('fontSize', currentFontSize);
    }

    increaseFontBtn.addEventListener('click', () => updateFontSize(fontSizeStep));
    decreaseFontBtn.addEventListener('click', () => updateFontSize(-fontSizeStep));

    // Emoji Slider Logic
    const emojiSlider = document.getElementById('emoji-slider');
    const emojiUrls = [
        'https://openmoji.org/data/color/svg/1F622.svg', // Crying face
        'https://openmoji.org/data/color/svg/1F641.svg', // Slightly frowning face
        'https://openmoji.org/data/color/svg/1F610.svg', // Neutral face
        'https://openmoji.org/data/color/svg/1F642.svg', // Slightly smiling face
        'https://openmoji.org/data/color/svg/1F604.svg'  // Smiling face with open mouth
    ];

    emojiSlider.addEventListener('input', (event) => {
        const value = event.target.value;
        emojiSlider.style.setProperty('--emoji-url', `url(${emojiUrls[value - 1]})`);
    });

    // Mobile Menu Functionality
    const mobileNav = document.querySelector('.mobile-nav');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuButton.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        console.log('Menu toggled:', isMenuOpen);
    }

    menuButton.addEventListener('click', () => {
        toggleMenu();
        console.log('Menu button clicked');
    });

    // Mobile Menu Navigation Links
    document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            console.log('Link clicked:', targetId);
            
            if (targetSection) {
                toggleMenu(); // Close the menu
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 300); // Wait for menu animation to complete
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !menuButton.contains(e.target) && 
            !mobileNav.contains(e.target)) {
            toggleMenu();
            console.log('Clicked outside menu');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
            console.log('Escape key pressed');
        }
    });

    // Feedback Form Handling
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.querySelector('.feedback-list');
    const ratingText = document.querySelector('.rating-text');
    const stars = document.querySelectorAll('.stars input[type="radio"]');

    // Update rating text when stars are hovered or selected
    stars.forEach(star => {
        star.addEventListener('change', () => {
            const rating = star.value;
            ratingText.textContent = `${rating} star${rating !== '1' ? 's' : ''}`;
        });
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('feedback-name').value;
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const message = document.getElementById('feedback-message').value;

        // Create new feedback item
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <span class="feedback-author">${name}</span>
                <div class="feedback-rating">${'★'.repeat(rating)}</div>
            </div>
            <p class="feedback-content">"${message}"</p>
        `;

        // Add animation class
        feedbackItem.style.opacity = '0';
        feedbackItem.style.transform = 'translateY(20px)';

        // Add to the top of the list
        feedbackList.insertBefore(feedbackItem, feedbackList.firstChild);

        // Trigger animation
        setTimeout(() => {
            feedbackItem.style.transition = 'all 0.5s ease';
            feedbackItem.style.opacity = '1';
            feedbackItem.style.transform = 'translateY(0)';
        }, 10);

        // Reset form
        feedbackForm.reset();
        ratingText.textContent = 'Select your rating';

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.background = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '1rem 2rem';
        successMessage.style.borderRadius = '30px';
        successMessage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        successMessage.style.zIndex = '1000';
        successMessage.textContent = 'Thank you for your feedback!';
        
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 300);
        }, 3000);
    });

    // Testimonial Carousel
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function updateCarouselClasses() {
        carouselItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === (currentIndex - 1 + carouselItems.length) % carouselItems.length) {
                item.classList.add('prev');
            } else if (index === (currentIndex + 1) % carouselItems.length) {
                item.classList.add('next');
            }
        });
    }

    function showNextTestimonial() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        updateCarouselClasses();
    }

    updateCarouselClasses(); // Initial setup
    setInterval(showNextTestimonial, 3000); // Change every 3 seconds

    // Initialize preferences
    function initializePreferences() {
        // Load saved theme
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && themes[savedTheme]) {
            applyTheme(savedTheme);
        }

        // Load saved font size
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            currentFontSize = parseInt(savedFontSize);
            updateFontSize(0);
        }
    }

    // Initialize
    initializePreferences();
});
