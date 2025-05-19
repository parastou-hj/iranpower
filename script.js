// کد شمارنده percent-sec
class CounterAnimation {
    constructor() {
        this.percentSection = document.querySelector('.percent-sec');
        this.hasAnimated = false;
        
        this.countersData = [
            { selector: '.percent-item:nth-child(1) span', target: 20, suffix: '%' },
            { selector: '.percent-item:nth-child(2) span', target: 352, suffix: '' },
            { selector: '.percent-item:nth-child(3) span', target: 72, suffix: '' },
            { selector: '.percent-item:nth-child(4) span', target: 34, suffix: '%' }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.percentSection) return;
        
        this.setupObserver();
        window.addEventListener('scroll', () => this.checkScroll());
    }
    
    setupObserver() {
        if (window.IntersectionObserver) {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px',
                threshold: 0.3
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.startAnimation();
                        this.hasAnimated = true;
                    }
                });
            }, observerOptions);
            
            observer.observe(this.percentSection);
        }
    }
    
    checkScroll() {
        if (this.hasAnimated || !this.percentSection) return;
        
        const rect = this.percentSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
            this.startAnimation();
            this.hasAnimated = true;
        }
    }
    
    startAnimation() {
        this.countersData.forEach((counterData, index) => {
            setTimeout(() => {
                this.animateCounter(counterData);
            }, index * 200);
        });
    }
    
    animateCounter(counterData) {
        const element = document.querySelector(counterData.selector);
        if (!element) return;
        
        const target = counterData.target;
        const suffix = counterData.suffix;
        const duration = 1500;
        const frameRate = 16;
        const totalFrames = duration / frameRate;
        
        let currentFrame = 0;
        let currentValue = 1;
        
        const timer = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easedProgress = this.easeOutExpo(progress);
            currentValue = Math.round(1 + (easedProgress * (target - 1)));
            
            if (currentFrame >= totalFrames) {
                currentValue = target;
            }
            
            element.textContent = currentValue + suffix;
            
            if (currentFrame >= totalFrames) {
                clearInterval(timer);
                element.style.transition = 'transform 0.3s ease';
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        }, frameRate);
    }
    
    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
}

// کد ویدیو پس‌زمینه خودکار
class AutoVideoBackground {
    constructor() {
        this.heroImage = document.getElementById('heroImage');
        this.heroVideo = document.getElementById('heroVideo');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.imageDisplayTime = 3000;
        this.isVideoPlaying = false;
        this.videoLoaded = false;
        
        this.init();
    }
    
    init() {
        if (!this.heroVideo || !this.heroImage) return;
        
        this.heroVideo.muted = true;
        this.heroVideo.loop = true;
        this.heroVideo.setAttribute('playsinline', '');
        this.heroVideo.controls = false;
        
        this.setupEventListeners();
        this.startImageTimer();
        this.preloadVideo();
    }
    
    setupEventListeners() {
        this.heroVideo.addEventListener('canplay', () => this.onVideoReady());
        this.heroVideo.addEventListener('loadeddata', () => this.onVideoLoaded());
        this.heroVideo.addEventListener('error', (e) => this.onVideoError(e));
        this.heroVideo.addEventListener('play', () => this.onVideoStarted());
        this.heroVideo.addEventListener('pause', () => {
            if (this.isVideoPlaying) {
                this.heroVideo.play().catch(e => console.log('خطا در ادامه پخش:', e));
            }
        });
    }
    
    startImageTimer() {
        setTimeout(() => {
            this.transitionToVideo();
        }, this.imageDisplayTime);
    }
    
    preloadVideo() {
        this.heroVideo.load();
    }
    
    onVideoReady() {
        this.videoLoaded = true;
    }
    
    onVideoLoaded() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('hidden');
        }
    }
    
    onVideoError(error) {
        console.error('خطا در بارگذاری ویدیو:', error);
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('hidden');
        }
        this.isVideoPlaying = false;
    }
    
    onVideoStarted() {
        this.isVideoPlaying = true;
    }
    
    transitionToVideo() {
        if (!this.videoLoaded) {
            setTimeout(() => this.transitionToVideo(), 500);
            return;
        }
        
        this.playVideo();
        
        setTimeout(() => {
            if (this.heroImage) this.heroImage.classList.add('image-hidden');
            if (this.heroVideo) this.heroVideo.classList.add('video-visible');
        }, 100);
    }
    
    playVideo() {
        if (!this.heroVideo) return;
        
        this.heroVideo.play()
            .then(() => {
                console.log('ویدیو با موفقیت پخش شد');
            })
            .catch(error => {
                console.error('خطا در پخش ویدیو:', error);
                this.handlePlaybackError();
            });
    }
    
    handlePlaybackError() {
        if (this.heroImage) this.heroImage.classList.remove('image-hidden');
        if (this.heroVideo) this.heroVideo.classList.remove('video-visible');
    }
}

// کد carousel لینک‌ها (کد موجود)
$(document).ready(function(){
    $('#links-carousel').owlCarousel({
        rtl: true,
        loop: true,
        margin: 5,
        // nav: true,
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

// Search dropdown functionality (کد موجود)
function toggleSearch() {
    const dropdown = document.getElementById('searchDropdown');
    const overlay = document.querySelector('.search-overlay');
    
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        if (overlay) overlay.style.display = 'none';
    } else {
        dropdown.classList.add('active');
        
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'search-overlay';
            newOverlay.onclick = () => toggleSearch();
            document.body.appendChild(newOverlay);
        }
        
        if (overlay) overlay.style.display = 'block';
        
        setTimeout(() => {
            const input = dropdown.querySelector('.search-input');
            if (input) input.focus();
        }, 100);
    }
}

document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search');
    const dropdown = document.getElementById('searchDropdown');
    
    if (!searchContainer.contains(event.target) && dropdown.classList.contains('active')) {
        toggleSearch();
    }
});

// کد tooltip برای نقاط نقشه
$(document).ready(function(){
    // راه‌اندازی شمارنده
    new CounterAnimation();
    
    // راه‌اندازی ویدیو پس‌زمینه
    new AutoVideoBackground();
    
    // Tooltip برای نقاط نقشه
    $('.map-point').each(function() {
        const point = $(this);
        
        // ساخت tooltip مخصوص هر نقطه
        const tooltip = $('<div class="point-tooltip"></div>');
        $('body').append(tooltip);
        
        // محتوای tooltip
        const city = point.data('city');
        const projects = point.data('projects');
        const description = point.data('description');
        
        let content = `<strong>${city}</strong>`;
        if (projects) content += `<br>${projects} پروژه فعال`;
        if (description) content += `<br>${description}`;
        
        tooltip.html(content);
        
        // Events
        point.on('mouseenter', function(e) {
            tooltip.addClass('show');
            updateTooltipPosition(e, tooltip);
        });
        
        point.on('mouseleave', function() {
            tooltip.removeClass('show');
        });
        
        point.on('mousemove', function(e) {
            updateTooltipPosition(e, tooltip);
        });
    });
    
    // تابع موقعیت tooltip
    function updateTooltipPosition(e, tooltip) {
        const margin = 15;
        let x = e.pageX + margin;
        let y = e.pageY - tooltip.outerHeight() - margin;
        
        // چک مرزها
        if (x + tooltip.outerWidth() > $(window).width()) {
            x = e.pageX - tooltip.outerWidth() - margin;
        }
        if (y < 0) {
            y = e.pageY + margin;
        }
        
        tooltip.css({
            left: x + 'px',
            top: y + 'px'
        });
    }
});

// کلاس مدیریت مودال ویدیو
class VideoModal {
    constructor() {
        this.modal = null;
        this.video = null;
        this.watchButtons = null;
        this.currentVideoSrc = '';
        
        this.init();
    }
    
    init() {
        // پیدا کردن دکمه‌های watch-video
        this.watchButtons = document.querySelectorAll('.watch-video');
        
        if (this.watchButtons.length === 0) return;
        
        // پیدا کردن مودال در HTML
        this.findModalElements();
        
        // اضافه کردن event listeners
        this.setupEventListeners();
    }
    
    findModalElements() {
        this.modal = document.getElementById('videoModal');
        this.video = document.getElementById('modalVideo');
        this.loading = document.getElementById('videoLoading');
        this.error = document.getElementById('videoError');
        this.closeBtn = document.getElementById('closeVideoModal');
        this.retryBtn = document.getElementById('retryVideo');
        
        // اگر مودال در HTML وجود ندارد، خطا نده
        if (!this.modal) {
            console.warn('مودال ویدیو در HTML پیدا نشد');
            return;
        }
    }
    
    setupEventListeners() {
        if (!this.modal) return;
        
        // دکمه‌های watch-video
        this.watchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // گرفتن آدرس ویدیو از data-video attribute
                const videoSrc = button.dataset.video || button.getAttribute('data-video');
                
                if (videoSrc) {
                    this.currentVideoSrc = videoSrc;
                    this.openModal();
                } else {
                    console.warn('آدرس ویدیو مشخص نشده:', button);
                }
            });
        });
        
        // دکمه بستن
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // کلیک روی پس‌زمینه
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // کلید ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
        
        // event های ویدیو
        if (this.video) {
            this.video.addEventListener('loadeddata', () => {
                this.onVideoLoaded();
            });
            
            this.video.addEventListener('error', () => {
                this.onVideoError();
            });
            
            this.video.addEventListener('ended', () => {
                this.onVideoEnded();
            });
        }
        
        // دکمه تلاش مجدد
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => {
                this.retryVideo();
            });
        }
    }
    
    openModal() {
        if (!this.modal || !this.currentVideoSrc) return;
        
        // نمایش مودال
        this.modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // reset state
        if (this.loading) this.loading.style.display = 'flex';
        if (this.error) this.error.style.display = 'none';
        if (this.video) this.video.style.display = 'none';
        
        // شروع بارگذاری ویدیو
        this.loadVideo();
    }
    
    closeModal() {
        if (!this.modal) return;
        
        // بستن مودال
        this.modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // متوقف کردن ویدیو
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            
            // reset src برای توقف کامل بارگذاری
            setTimeout(() => {
                this.video.src = '';
                this.video.load();
            }, 300);
        }
    }
    
    loadVideo() {
        if (!this.video || !this.currentVideoSrc) return;
        
        // تنظیم src و شروع بارگذاری
        this.video.src = this.currentVideoSrc;
        this.video.load();
    }
    
    onVideoLoaded() {
        // ویدیو بارگذاری شد
        if (this.loading) this.loading.style.display = 'none';
        if (this.error) this.error.style.display = 'none';
        if (this.video) this.video.style.display = 'block';
        
        // پخش خودکار (اختیاری)
        this.video.play().catch(error => {
            console.log('پخش خودکار ممکن نیست:', error);
        });
    }
    
    onVideoError() {
        // خطا در بارگذاری
        if (this.loading) this.loading.style.display = 'none';
        if (this.video) this.video.style.display = 'none';
        if (this.error) this.error.style.display = 'block';
    }
    
    onVideoEnded() {
        // پایان ویدیو (اختیاری: بستن خودکار مودال)
        // this.closeModal();
    }
    
    retryVideo() {
        // تلاش مجدد
        if (this.error) this.error.style.display = 'none';
        if (this.loading) this.loading.style.display = 'flex';
        
        setTimeout(() => {
            this.loadVideo();
        }, 500);
    }
}

// اضافه کردن به کد اصلی
$(document).ready(function(){
    // کدهای قبلی...
    
    // راه‌اندازی مودال ویدیو
    new VideoModal();
});

 function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }



$(document).ready(function() {
  const initializeOwlCarousel = () => {
      const advantagesContainer=$('.services')
      if (window.innerWidth > 576) {
          if (typeof advantagesContainer.data('owl.carousel') != 'undefined') {
              advantagesContainer.data('owl.carousel').destroy();
            }
            advantagesContainer.removeClass('owl-carousel');
          
      } else if(window.innerWidth <= 576) {
          if (!$('.services').hasClass('owl-carousel')) {
              $('.services').addClass('owl-carousel').owlCarousel({
                  rtl: true,
                  items: 1,
                  // nav: true,
                  dots: true,
                  loop: true,
                  autoplay: true,
                  autoplayTimeout: 3000,
                  autoplayHoverPause: true,
                  // navText: [
                  //     '<i class="fa-solid fa-chevron-right"></i>',
                  //     '<i class="fa-solid fa-chevron-left"></i>'
                  // ],
                  responsive: {
                     
                      
                  }
              });
             

              
          }
      }
  };

  initializeOwlCarousel();
  $(window).resize(initializeOwlCarousel);


});

$(document).ready(function() {
  const initializeOwlCarousel = () => {
      const advantagesContainer=$('.news')
      if (window.innerWidth > 576) {
          if (typeof advantagesContainer.data('owl.carousel') != 'undefined') {
              advantagesContainer.data('owl.carousel').destroy();
            }
            advantagesContainer.removeClass('owl-carousel');
          
      } else if(window.innerWidth <= 576) {
          if (!$('.news').hasClass('owl-carousel')) {
              $('.news').addClass('owl-carousel').owlCarousel({
                  rtl: true,
                  items: 1,
                //   margin:10,
                  dots: true,
                  loop: true,
                //   autoplay: true,
                //   autoplayTimeout: 3000,
                  autoplayHoverPause: true,
                  // navText: [
                  //     '<i class="fa-solid fa-chevron-right"></i>',
                  //     '<i class="fa-solid fa-chevron-left"></i>'
                  // ],
                  responsive: {
                     
                      
                  }
              });
             

              
          }
      }
  };

  initializeOwlCarousel();
  $(window).resize(initializeOwlCarousel);


});
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileSideMenu = document.getElementById('mobileSideMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const submenuLinks = document.querySelectorAll('[data-submenu]');

    // Open mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.add('active');
            mobileSideMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileSideMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Close all submenus
        document.querySelectorAll('.mobile-menu-item.has-submenu.active')
            .forEach(item => item.classList.remove('active'));
    }

    // Close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Overlay click
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Submenu toggle
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = link.closest('.mobile-menu-item');
            const isActive = menuItem.classList.contains('active');
            
            // Close all other submenus
            document.querySelectorAll('.mobile-menu-item.has-submenu.active')
                .forEach(item => {
                    if (item !== menuItem) {
                        item.classList.remove('active');
                    }
                });

            // Toggle current submenu
            if (isActive) {
                menuItem.classList.remove('active');
            } else {
                menuItem.classList.add('active');
            }
        });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSideMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && mobileSideMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
 

    const header = document.querySelector('.header-bottom'); 
    const scrollThreshold = 10; 

    function handleHeaderScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleHeaderScroll();

    window.addEventListener('scroll', handleHeaderScroll);
});

 //--------------------scrol-top-header-hidden----------------
    $(document).ready(function() {
        let lastScrollTop = 0;
        let isHeaderVisible = true;
        const $mainHeader = $('header');
        const $downHeader = $('.header-bottom');
        const downHeaderHeight = $downHeader.outerHeight();
      
        

        if (window.innerWidth > 990) {
            
            $(window).scroll(function() {
                const currentScroll = $(this).scrollTop();
                
    
                if (currentScroll > 100) {
                    if (currentScroll > lastScrollTop && isHeaderVisible) {
                        $mainHeader.addClass('header-hidden');
                        $downHeader.addClass('header-up-lg');
                        // $header.height(downHeaderHeight);
                        isHeaderVisible = false;
                    }
                   
                } else   {
                    $mainHeader.removeClass('header-hidden');
                    $downHeader.removeClass('header-up-lg');
                    isHeaderVisible = true;
                }
                
                lastScrollTop = currentScroll;
            });
           
        }else if( window,innerWidth <= 992){
            function updateHeights() {  
                $search.css('top', `${downHeaderHeight + rowHeight }`);
            }
            
            updateHeights();
            
            $(window).scroll(function() {
                const currentScroll = $(this).scrollTop();
                if (currentScroll > 100) {
                    if (currentScroll > lastScrollTop && isHeaderVisible) {
                        $headerRow.addClass('row-hidden');
                        $downHeader.addClass('header-up');
                        $search.addClass('header-up');
                        isHeaderVisible = false;
                    }
                   
                } else {
                    $headerRow.removeClass('row-hidden');
                    $downHeader.removeClass('header-up');
                    $search.removeClass('header-up');
                    isHeaderVisible = true;
                }
                
                lastScrollTop = currentScroll;
            });
            
            let resizeTimer;
            $(window).resize(function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateHeights, 250);
            });
        }
        
    });
