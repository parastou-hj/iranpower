  $(document).ready(function(){
            $('#links-carousel').owlCarousel({
                rtl: true,
                loop: true,
                margin: 10,
                nav: true,
                dots: true,
                autoplay: true,
                autoplayTimeout: 3000,
                autoplayHoverPause: true,
                smartSpeed: 1000,
                responsive: {
                    0: {
                        items:3
                    },
                    576: {
                        items: 4
                    },
                    768: {
                        items: 5
                    },
                    992: {
                        items: 6
                    },
                    1200: {
                        items: 7
                    },
                    
                }
            });
        });

$(document).ready(function(){
    $('#links-carousel').owlCarousel({
        rtl: true,
        loop: true,
        margin: 10,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items:3
            },
            576: {
                items: 4
            },
            768: {
                items: 5
            },
            992: {
                items: 6
            },
            1200: {
                items: 7
            },
            
        }
    });
});

// Search dropdown functionality
function toggleSearch() {
    const dropdown = document.getElementById('searchDropdown');
    const overlay = document.querySelector('.search-overlay');
    
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        if (overlay) overlay.style.display = 'none';
    } else {
        dropdown.classList.add('active');
        
        // Create overlay if it doesn't exist
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'search-overlay';
            newOverlay.onclick = () => toggleSearch();
            document.body.appendChild(newOverlay);
        }
        
        if (overlay) overlay.style.display = 'block';
        
        // Focus on input after dropdown opens
        setTimeout(() => {
            const input = dropdown.querySelector('.search-input');
            if (input) input.focus();
        }, 100);
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search');
    const dropdown = document.getElementById('searchDropdown');
    
    if (!searchContainer.contains(event.target) && dropdown.classList.contains('active')) {
        toggleSearch();
    }
});