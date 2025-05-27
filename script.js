
class CounterAnimation {
    constructor() {
        this.percentSection = document.querySelector('.percent-sec');
        this.hasAnimated = false;
        this.counterItems = this.percentSection ? this.percentSection.querySelectorAll('.percent-item span') : [];
        this.init();
    }
    
    init() {
        if (!this.percentSection || this.counterItems.length === 0) return;
        
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
        Array.from(this.counterItems).forEach((item, index) => {
            setTimeout(() => {
                this.animateCounter(item);
            }, index * 200);
        });
    }
    
    animateCounter(element) {
        const fullText = element.textContent;
        const matches = fullText.match(/(\d+)([^0-9]*)/);
        
        if (!matches) return;
        
        const target = parseInt(matches[1]); 
        const suffix = matches[2] || '';
        
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

document.addEventListener('DOMContentLoaded', function() {
    new CounterAnimation();
});
class AutoVideoBackground {
    constructor() {
        this.heroImage = document.getElementById('heroImage');
        this.heroVideo = document.getElementById('heroVideo');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.isSequential = this.heroVideo ? this.heroVideo.dataset.sequential === 'true' : false;
        
        this.videoSources = [];
        this.currentSourceIndex = 0;
        
        if (this.heroVideo) {
            const sources = this.heroVideo.querySelectorAll('source');
            
            let orderedSources = Array.from(sources);
            orderedSources.sort((a, b) => {
                const orderA = parseInt(a.dataset.order || 0);
                const orderB = parseInt(b.dataset.order || 0);
                return orderA - orderB;
            });
            
            this.videoSources = orderedSources;
        }
        
        this.imageDisplayTime = 3000;
        this.isVideoPlaying = false;
        this.videoLoaded = false;
        
        this.init();
    }
    
    init() {
        if (!this.heroVideo || !this.heroImage) return;
        
        this.heroVideo.muted = true;
        this.heroVideo.setAttribute('playsinline', '');
        this.heroVideo.controls = false;
        
        this.heroVideo.removeAttribute('loop');
        
        this.setupEventListeners();
        this.startImageTimer();
        this.prepareCurrentVideo();
    }
    
    setupEventListeners() {
        this.heroVideo.addEventListener('canplay', () => this.onVideoReady());
        this.heroVideo.addEventListener('loadeddata', () => this.onVideoLoaded());
        this.heroVideo.addEventListener('error', (e) => this.onVideoError(e));
        this.heroVideo.addEventListener('play', () => this.onVideoStarted());
        
        if (this.isSequential) {
            this.heroVideo.addEventListener('ended', () => this.onVideoEnded());
        } else {
            this.heroVideo.loop = true;
        }
        
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
    
    prepareCurrentVideo() {
        if (!this.heroVideo || this.videoSources.length === 0) return;
        
        if (this.isSequential) {
            const currentSource = this.videoSources[this.currentSourceIndex];
            this.heroVideo.src = currentSource.src;
            this.heroVideo.load();
        }
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
        
        if (this.isSequential) {
            this.playNextVideo();
        }
    }
    
    onVideoStarted() {
        this.isVideoPlaying = true;
    }
    
    onVideoEnded() {
        if (this.isSequential) {
            this.playNextVideo();
        }
    }
    
    playNextVideo() {
        if (this.videoSources.length <= 1) return;
        
        this.currentSourceIndex = (this.currentSourceIndex + 1) % this.videoSources.length;
        
        const nextSource = this.videoSources[this.currentSourceIndex];
        this.heroVideo.src = nextSource.src;
        this.heroVideo.load();
        
        const playNextVideo = () => {
            this.heroVideo.play()
                .catch(e => console.log('خطا در پخش ویدیوی بعدی:', e));
            this.heroVideo.removeEventListener('loadeddata', playNextVideo);
        };
        
        this.heroVideo.addEventListener('loadeddata', playNextVideo);
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
        
        if (this.isSequential) {
            this.playNextVideo();
        }
    }
}
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
                items:3.2
            },
            500: {
                items: 4
            },
            700: {
                items: 5
            },
            830: {
                items: 6
            },
            992: {
                items: 6
            },
            1100: {
                items: 7
            },
            1400: {
                items: 8
            },
        }
    });
});

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

$(document).ready(function(){
    
    new CounterAnimation();
    new AutoVideoBackground();
    
   
    $('.map-point').each(function() {
        const point = $(this);
        
        
        const tooltip = $('<div class="point-tooltip"></div>');
        point.append(tooltip);
        
        
        const city = point.data('city');
        const projects = point.data('projects');
        
        let content = `<strong>${city}</strong>`;
        if (projects) content += `<br>${projects} پروژه فعال`;
        
        tooltip.html(content);
        
      
        point.on('mouseenter', function() {
            tooltip.addClass('show');
        });
        
        point.on('mouseleave', function() {
            tooltip.removeClass('show');
        });
    });
});


class VideoModal {
    constructor() {
        this.modal = null;
        this.video = null;
        this.watchButtons = null;
        this.currentVideoSrc = '';
        
        this.init();
    }
    
    init() {
        this.watchButtons = document.querySelectorAll('.watch-video');
        
        if (this.watchButtons.length === 0) return;
        
        this.findModalElements();
        
        this.setupEventListeners();
    }
    
    findModalElements() {
        this.modal = document.getElementById('videoModal');
        this.video = document.getElementById('modalVideo');
        this.loading = document.getElementById('videoLoading');
        this.error = document.getElementById('videoError');
        this.closeBtn = document.getElementById('closeVideoModal');
        this.retryBtn = document.getElementById('retryVideo');
        
        if (!this.modal) {
            console.warn('مودال ویدیو در HTML پیدا نشد');
            return;
        }
    }
    
    setupEventListeners() {
        if (!this.modal) return;
        
        this.watchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const videoSrc = button.dataset.video || button.getAttribute('data-video');
                
                if (videoSrc) {
                    this.currentVideoSrc = videoSrc;
                    this.openModal();
                } else {
                    console.warn('آدرس ویدیو مشخص نشده:', button);
                }
            });
        });
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
        
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
        
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => {
                this.retryVideo();
            });
        }
    }
    
    openModal() {
        if (!this.modal || !this.currentVideoSrc) return;
        
        this.modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        if (this.loading) this.loading.style.display = 'flex';
        if (this.error) this.error.style.display = 'none';
        if (this.video) this.video.style.display = 'none';
        
        this.loadVideo();
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            
            setTimeout(() => {
                this.video.src = '';
                this.video.load();
            }, 300);
        }
    }
    
    loadVideo() {
        if (!this.video || !this.currentVideoSrc) return;
        
        this.video.src = this.currentVideoSrc;
        this.video.load();
    }
    
    onVideoLoaded() {
        if (this.loading) this.loading.style.display = 'none';
        if (this.error) this.error.style.display = 'none';
        if (this.video) this.video.style.display = 'block';
        
        this.video.play().catch(error => {
            console.log('پخش خودکار ممکن نیست:', error);
        });
    }
    
    onVideoError() {
        if (this.loading) this.loading.style.display = 'none';
        if (this.video) this.video.style.display = 'none';
        if (this.error) this.error.style.display = 'block';
    }
    
    onVideoEnded() {
        // this.closeModal();
    }
    
    retryVideo() {
        if (this.error) this.error.style.display = 'none';
        if (this.loading) this.loading.style.display = 'flex';
        
        setTimeout(() => {
            this.loadVideo();
        }, 500);
    }
}

$(document).ready(function(){

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

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.add('active');
            mobileSideMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileSideMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        document.querySelectorAll('.mobile-menu-item.has-submenu.active')
            .forEach(item => item.classList.remove('active'));
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = link.closest('.mobile-menu-item');
            const isActive = menuItem.classList.contains('active');
            
            document.querySelectorAll('.mobile-menu-item.has-submenu.active')
                .forEach(item => {
                    if (item !== menuItem) {
                        item.classList.remove('active');
                    }
                });

            if (isActive) {
                menuItem.classList.remove('active');
            } else {
                menuItem.classList.add('active');
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSideMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && mobileSideMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
     document.addEventListener('click', (e)=>{
        if(!e.target.closest('#mobileSideMenu')&&!e.target.closest('.mobile-menu-toggle')){
             closeMobileMenu();
        }
    })
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
           
        
            
            let resizeTimer;
            $(window).resize(function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateHeights, 250);
            });
        
        
    });


    // Mobile menu toggle for main mega menu
$('.has-megamenu > .nav-link').on('click', function(e) {
    if (window.innerWidth <= 991) {
        e.preventDefault();
        const parent = $(this).parent();
        
        // Toggle active class
        parent.toggleClass('active');
        
        // Show/hide megamenu container
        if (parent.hasClass('active')) {
            parent.find('.megamenu-container').slideDown(300);
        } else {
            parent.find('.megamenu-container').slideUp(300);
        }
    }
});

$('.megamenu-container').on('click', function(e) {
    e.stopPropagation();
});

$(window).on('resize', function() {
    if (window.innerWidth > 991) {
        $('.megamenu-container').css('display', '');
        
        if (!$('.category-item.active').length) {
            $('.category-item').first().addClass('active');
            const defaultCategory = $('.category-item').first().data('category');
            $(`#${defaultCategory}-content`).addClass('active');
        }
    }
});

$(document).ready(function() {
    if (!$('.category-item.active').length) {
        $('.category-item').first().addClass('active');
        const defaultCategory = $('.category-item').first().data('category');
        $(`#${defaultCategory}-content`).addClass('active');
    }
    
    $('.category-item').on('click', function(e) {
        e.preventDefault();
        
        $('.category-item').removeClass('active');
        
        $(this).addClass('active');
        
        $('.subcategory-content').removeClass('active');
        
        const category = $(this).data('category');
        $(`#${category}-content`).addClass('active');
    });
});
$(document).ready(function() {
    const defaultCategory = $('.category-item').first().data('category');
    $('.category-item').first().addClass('active');
    $(`#${defaultCategory}-content`).addClass('active');
    
    $('.category-item').on('mouseenter', function() {
        if (window.innerWidth > 991) {
            const categoryId = $(this).data('category');
            
            $('.category-item').removeClass('active');
            $('.subcategory-content').removeClass('active');
            
            $(this).addClass('active');
            $(`#${categoryId}-content`).addClass('active');
        }
    });
    
    $('.category-item').on('click', function(e) {
        if (window.innerWidth <= 991) {
            e.preventDefault();
            const categoryId = $(this).data('category');
            
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(`#${categoryId}-content`).removeClass('active');
            } else {
                $('.category-item').removeClass('active');
                $('.subcategory-content').removeClass('active');
                
                $(this).addClass('active');
                $(`#${categoryId}-content`).addClass('active');
            }
        }
    });
    
    $('.subcategory-content').on('mouseenter', function() {
        if (window.innerWidth > 991) {
            $(this).addClass('active');
        }
    });
    
    $('.has-megamenu > .nav-link').on('click', function(e) {
        if (window.innerWidth <= 991) {
            e.preventDefault();
            const parent = $(this).parent();
            
            parent.toggleClass('active');
            
            if (parent.hasClass('active')) {
                parent.find('.megamenu-container').slideDown(300);
            } else {
                parent.find('.megamenu-container').slideUp(300);
            }
        }
    });
    
    $('.megamenu-container').on('click', function(e) {
        e.stopPropagation();
    });
    
    $(window).on('resize', function() {
        if (window.innerWidth > 991) {
            // Reset for desktop
            $('.megamenu-container').css('display', '');
            
            if (!$('.category-item.active').length) {
                $('.category-item').first().addClass('active');
                const defaultCategory = $('.category-item').first().data('category');
                $(`#${defaultCategory}-content`).addClass('active');
            }
        }
    });
    
   
    
   
    function bindCategoryEvents() {
        $('.category-item').off('mouseenter click');
        
        $('.category-item').on('mouseenter', function() {
            if (window.innerWidth > 991) {
                const categoryId = $(this).data('category');
                
                $('.category-item').removeClass('active');
                $('.subcategory-content').removeClass('active');
                
                $(this).addClass('active');
                $(`#${categoryId}-content`).addClass('active');
            }
        });
        
        $('.category-item').on('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const categoryId = $(this).data('category');
                
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(`#${categoryId}-content`).removeClass('active');
                } else {
                    $('.category-item').removeClass('active');
                    $('.subcategory-content').removeClass('active');
                    
                    $(this).addClass('active');
                    $(`#${categoryId}-content`).addClass('active');
                }
            }
        });
    }
    
    // Uncomment to enable dynamic loading
    // loadDynamicCategories();
});


   $(document).ready(function(){
            $('#power-carousel').owlCarousel({
                rtl: true,
                loop: true,
                margin: 20,
                nav: false,
                dots: false,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    }
                },
                
            });
            
           
        });
     $(document).ready(function(){
            $('#activity-carousel').owlCarousel({
                rtl: true,
                loop: true,
                margin: 20,
                nav: false,
                dots: false,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    }
                },
                
            });
            
           
        });
