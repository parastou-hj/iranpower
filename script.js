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