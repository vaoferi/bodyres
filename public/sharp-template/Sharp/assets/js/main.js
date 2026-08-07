(function($) {
	"use strict";
	
	var nav = $('nav');
	var navHeight = nav.outerHeight();
	$('.navbar-toggler').on('click', function() {
		if(!$('#mainNav').hasClass('navbar-reduce')) {
			$('#mainNav').addClass('navbar-reduce');
		}
	});
	
	// Porfolio isotope and filter
	$(window).on('load', function() {
		var projectIsotope = $('.project-container').isotope({
			itemSelector: '.project-grid-item'
		});
		$('#project-flters li').on('click', function() {
			$("#project-flters li").removeClass('filter-active');
			$(this).addClass('filter-active');
			projectIsotope.isotope({
				filter: $(this).data('filter')
			});
		});
	});
	
	// Navbar Menu Reduce 
	$(window).trigger('scroll');
	$(window).on('scroll', function() {
		var pixels = 50;
		var top = 1200;
		if($(window).scrollTop() > pixels) {
			$('.navbar-expand-md').addClass('navbar-reduce');
			$('.navbar-expand-md').removeClass('navbar-trans');
		} else {
			$('.navbar-expand-md').addClass('navbar-trans');
			$('.navbar-expand-md').removeClass('navbar-reduce');
		}
		if($(window).scrollTop() > top) {
			$('.scrolltop-mf').fadeIn(1000, "easeInOutExpo");
		} else {
			$('.scrolltop-mf').fadeOut(1000, "easeInOutExpo");
		}
	});
	
	// Back to top button 
	var backToTop = $('.back-to-top');
	var footerArea = document.querySelector('footer.footer-area');
	var backToTopBaseBottom = 30;
	var backToTopGap = 16;
	var backToTopHeight = 42;
	var backToTopLifted = false;
	function updateBackToTopOffset() {
		if(!footerArea || !backToTop.length) {
			return;
		}
		var footerRect = footerArea.getBoundingClientRect();
		var footerVisibleHeight = Math.max(0, window.innerHeight - footerRect.top);
		var shouldLift = footerVisibleHeight > 0;
		if(shouldLift) {
			backToTop.css('bottom', (footerVisibleHeight + backToTopHeight + backToTopGap) + 'px');
		} else {
			backToTop.css('bottom', backToTopBaseBottom + 'px');
		}
		backToTopLifted = shouldLift;
	}
	if(footerArea && backToTop.length) {
		var backToTopObserver = new IntersectionObserver(function(entries) {
			if(entries[0] && entries[0].isIntersecting !== backToTopLifted) {
				updateBackToTopOffset();
			}
		}, {
			threshold: [0, 0.01, 1]
		});
		backToTopObserver.observe(footerArea);
		$(window).on('resize scroll', updateBackToTopOffset);
		updateBackToTopOffset();
	}
	$(window).on("scroll", function() {
		if($(this).scrollTop() > 100) {
			$('.back-to-top').fadeIn('slow');
		} else {
			$('.back-to-top').fadeOut('slow');
		}
	});
	$('.back-to-top').on("click", function() {
		$('html, body').animate({
			scrollTop: 0
		}, 1500, 'easeInOutExpo');
		return false;
	});
	
	//  Star ScrollTop
	$('.scrolltop-mf').on("click", function() {
		$('html, body').animate({
			scrollTop: 0
		}, 1000);
	});
	
	//  Star Scrolling nav
	$('a.js-scroll[href*="#"]:not([href="#"])').on("click", function() {
		if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if(target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - navHeight + 30)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});
	
	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll').on("click", function() {
		$('.navbar-collapse').collapse('hide');
	});
	
	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#mainNav',
		offset: navHeight
	});
	
	// Testimonials owl
	$('#testimonial-slide').owlCarousel({
		margin: 5,
		autoplay: true,
		center: true,
		autoplayTimeout: 4000,
		nav: false,
		smartSpeed: 1000,
		dots: true,
		autoplayHoverPause: true,
		loop: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 1
			},
			1000: {
				items: 2
			}
		}
	});
	
        // Partner Logo
        $("#partner-carousel").owlCarousel({
            margin: 0,
            autoplay: true,
            autoplayTimeout: 4000,
            smartSpeed: 800,
            nav: false,
            dots: false,
            autoplayHoverPause: true,
            loop: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                },
                768: {
                    items: 3,
                },
                1000: {
                    items: 5,
                },
            },
        });
		
	//  magnificPopup
	var magnifPopup = function() {
		$('.popup-img').magnificPopup({
			type: 'image',
			removalDelay: 300,
			mainClass: 'mfp-with-zoom',
			gallery: {
				enabled: true
			},
			zoom: {
				enabled: true, // By default it's false, so don't forget to enable it
				duration: 300, // duration of the effect, in milliseconds
				easing: 'ease-in-out', // CSS transition easing function
				// The "opener" function should return the element from which popup will be zoomed in
				// and to which popup will be scaled down
				// By defailt it looks for an image tag:
				opener: function(openerElement) {
					// openerElement is the element on which popup was initialized, in this case its <a> tag
					// you don't need to add "opener" option if this code matches your needs, it's defailt one.
					return openerElement.is('img') ? openerElement : openerElement.find('img');
				}
			}
		});
	};
	// Call the functions
	magnifPopup();

	// Fade in the route video once it scrolls into view.
	var fadeInItems = document.querySelectorAll('[data-fade-in-up]');
	if(fadeInItems.length) {
		var revealFadeInItem = function(element) {
			element.classList.add('is-visible');
		};

		if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
			fadeInItems.forEach(revealFadeInItem);
		} else {
			var fadeInObserver = new IntersectionObserver(function(entries, observer) {
				entries.forEach(function(entry) {
					if(entry.isIntersecting) {
						revealFadeInItem(entry.target);
						observer.unobserve(entry.target);
					}
				});
			}, {
				threshold: 0.25,
				rootMargin: '0px 0px -10% 0px'
			});

			fadeInItems.forEach(function(item) {
				fadeInObserver.observe(item);
			});
		}
	}

	// Touch devices do not have hover, so service cards need an explicit open state.
	// Desktop hover remains the primary behavior; this only mirrors it for tap/keyboard.
	var serviceCards = Array.prototype.slice.call(document.querySelectorAll('.single-services-item'));
	if(serviceCards.length) {
		var closeServiceCards = function(exceptCard) {
			serviceCards.forEach(function(card) {
				if(card !== exceptCard) {
					card.classList.remove('is-touch-open');
					card.setAttribute('aria-expanded', 'false');
				}
			});
		};

		serviceCards.forEach(function(card) {
			card.setAttribute('role', 'button');
			card.setAttribute('tabindex', '0');
			card.setAttribute('aria-expanded', 'false');

			var toggleCard = function(event) {
				if(event) {
					event.preventDefault();
				}

				var willOpen = !card.classList.contains('is-touch-open');
				closeServiceCards(card);
				card.classList.toggle('is-touch-open', willOpen);
				card.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
			};

			card.addEventListener('click', toggleCard);
			card.addEventListener('keydown', function(event) {
				if(event.key === 'Enter' || event.key === ' ') {
					toggleCard(event);
				}
			});
		});

		document.addEventListener('click', function(event) {
			if(!event.target.closest('.single-services-item')) {
				closeServiceCards(null);
			}
		});
	}

	// Keep the route video aligned with the form bottom by measuring real boxes.
	// This avoids breakpoints drifting apart when the form height or video width changes.
	var alignContactRouteVideo = function() {
		var contactForm = document.querySelector('.contact-form');
		var contactRouteColumn = document.querySelector('.contact-route-column');
		var contactRouteVideo = document.querySelector('.contact-route-video');

		if(!contactForm || !contactRouteColumn || !contactRouteVideo) {
			return;
		}

		if(window.innerWidth < 768) {
			contactRouteColumn.style.marginTop = '';
			return;
		}

		contactRouteColumn.style.marginTop = '';

		var baseMarginTop = parseFloat(window.getComputedStyle(contactRouteColumn).marginTop) || 0;
		var formBottom = contactForm.getBoundingClientRect().bottom;
		var videoBottom = contactRouteVideo.getBoundingClientRect().bottom;
		var targetMarginTop = Math.round(baseMarginTop + (formBottom - videoBottom));

		contactRouteColumn.style.marginTop = targetMarginTop + 'px';
	};

	var alignContactRouteVideoRaf = null;
	var scheduleAlignContactRouteVideo = function() {
		if(alignContactRouteVideoRaf !== null) {
			cancelAnimationFrame(alignContactRouteVideoRaf);
		}

		alignContactRouteVideoRaf = requestAnimationFrame(function() {
			alignContactRouteVideoRaf = null;
			alignContactRouteVideo();
		});
	};

	scheduleAlignContactRouteVideo();
	$(window).on('load resize orientationchange', scheduleAlignContactRouteVideo);
	
})(jQuery);
