(function ($) {
	"use strict";
	$(document).ready(function () {
		$('body').one('touchstart', function () {
			$(this).addClass('m-touch');
		});
		if (!$.fn.lsvrInitPage) {
			$.fn.lsvrInitPage = function (element) {
				var $element = $(element);
				if ($.fn.lsvrFluidEmbedMedia) {
					$element.lsvrFluidEmbedMedia();
				}
				if ($.fn.lsvrAjaxForm) {
					$element.find('form.m-ajax-form').each(function () {
						$(this).lsvrAjaxForm();
					});
				}
				if ($.fn.lsvrCheckboxInput) {
					$element.find('.checkbox-input').each(function () {
						$(this).lsvrCheckboxInput();
					});
				}
				if ($.fn.lsvrRadioInput) {
					$element.find('.radio-input').each(function () {
						$(this).lsvrRadioInput();
					});
				}
				if ($.fn.lsvrSelectboxInput) {
					$element.find('.selectbox-input').each(function () {
						$(this).lsvrSelectboxInput();
					});
				}
				if ($.fn.lsvrIsFormValid) {
					$element.find('form.m-validate').each(function () {
						var $this = $(this);
						$this.submit(function () {
							if (!$this.lsvrIsFormValid()) {
								$this.find('.m-validation-error').slideDown(300);
								return false;
							}
						});
					});
				}
				if ($.fn.lsvrInviewAnimation) {
					$element.find('[data-inview-anim]').each(function () {
						$(this).addClass('visibility-hidden');
						$(this).lsvrInviewAnimation();
					});
				}
				if ($.fn.lsvrInitLightboxes) {
					$element.lsvrInitLightboxes();
				}
				if ($.fn.lsvrLoadHiresImages) {
					$element.lsvrLoadHiresImages();
				}
			};
		}
		$.fn.lsvrInitPage('body');
		var mediaQueryBreakpoint;
		if ($.fn.lsvrGetMediaQueryBreakpoint) {
			mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
			$(document).on('screenTransition', function () {
				mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
			});
		} else {
			mediaQueryBreakpoint = $(window).width();
		}
		if (!$.fn.lsvrInitComponents) {
			$.fn.lsvrInitComponents = function (element) {
				var $element = $(element);
				if ($.fn.isotope && $.fn.lsvrImagesLoaded) {
					$element.find('.c-article-list.m-masonry').each(function () {
						var $this = $(this);
						$this.lsvrImagesLoaded(function () {
							$this.isotope({
								itemSelector: '.c-article',
								layoutMode: 'masonry',
							});
						});
					});
				}
				if ($.fn.lsvrAccordion) {
					$element.find('.c-accordion').each(function () {
						$(this).lsvrAccordion();
					});
				}
				if ($.fn.lsvrCarousel) {
					$element.find('.c-carousel').each(function () {
						$(this).lsvrCarousel();
					});
				}
				if ($.fn.lsvrCounter) {
					$element.find('.c-counter').each(function () {
						$(this).lsvrCounter();
					});
				}
				if ($.fn.lsvrLoadGoogleMaps && $element.find('.c-gmap').length > 0) {
					$.fn.lsvrLoadGoogleMaps();
				}
				if ($.fn.parallax) {
					if ('WebkitAppearance' in document.documentElement.style) {
						$element.find('.c-parallax-section, .c-cta-message.m-parallax').each(function () {
							$(this).fadeOut(1).fadeIn(1);
						});
					}
					$element.find('.c-parallax-section.m-dynamic, .c-cta-message.m-parallax').each(function () {
						if (mediaQueryBreakpoint > 1299) {
							$(this).parallax('50%', 0.3);
						}
					});
				}
				if ($.fn.lsvrProgressBar) {
					$element.find('.c-progress-bar').each(function () {
						$(this).lsvrProgressBar();
					});
				}
				if ($.fn.lsvrSlider) {
					$element.find('.c-slider').each(function () {
						$(this).lsvrSlider();
					});
				}
				if ($.fn.lsvrTabs) {
					$element.find('.c-tabs').each(function () {
						$(this).lsvrTabs();
					});
				}
			};
		}
		$.fn.lsvrInitComponents('body');
		if ($.fn.lsvrParallax) {
			$('#header').filter('.m-parallax').each(function () {
				$(this).lsvrParallax('50%', 0.3);
			});
		}
		$('.header-menu > ul > li:last-child').addClass('m-last');
		$('.header-menu > ul > li:nth-last-child(2)').addClass('m-penultimate');
		if (!$.fn.lsvrHeaderSubmenu) {
			$.fn.lsvrHeaderSubmenu = function () {
				var $this = $(this),
					$parent = $this.parent();
				$parent.addClass('m-has-submenu');
				if ($parent.find('> .toggle').length < 1) {
					$parent.append('<button class="submenu-toggle" type="button"><i></i></button>');
				}
				var $toggle = $parent.find('> .submenu-toggle');
				$toggle.click(function () {
					if ($(this).hasClass('m-active')) {
						$toggle.removeClass('m-active');
						$this.slideUp(300);
					} else {
						if ($(this).parents('ul').length < 2) {
							$('#header .header-menu > ul > li > .submenu-toggle.m-active').each(function () {
								$(this).removeClass('m-active');
								$(this).parent().find('> ul').slideUp(300);
							});
						}
						$toggle.addClass('m-active');
						$this.slideDown(300);
					}
				});
				$(document).on('screenTransition', function () {
					$toggle.removeClass('m-active');
					$this.removeAttr('style');
				});
				$parent.on('touchstart', function () {
					$parent.addClass('touch');
				});
				$parent.hover(function () {
					if (mediaQueryBreakpoint > 1199 && !$('body').hasClass('m-touch')) {
						$parent.addClass('m-hover');
						$this.show().addClass('animated fadeInDown');
					}
				}, function () {
					if (mediaQueryBreakpoint > 1199 && !$('body').hasClass('m-touch')) {
						$parent.removeClass('m-hover');
						$this.hide().removeClass('animated fadeInDown');
					}
				});
				$parent.find('> a').click(function () {
					if (mediaQueryBreakpoint > 1199 && !$parent.hasClass('m-hover')) {
						if ($(this).parents('ul').length < 2) {
							$('#header .header-menu li.m-hover').each(function () {
								$(this).removeClass('m-hover');
								$(this).find('> ul').hide();
							});
						}
						$parent.addClass('m-hover');
						$this.show().addClass('animated fadeInDown');
						$this.bind('clickoutside', function (event) {
							$parent.removeClass('m-hover');
							$this.hide().removeClass('animated fadeInDown');
							$this.unbind('clickoutside');
						});
						return false;
					}
				});
			};
			$('.header-menu ul > li > ul').each(function () {
				$(this).lsvrHeaderSubmenu();
			});
		}
		$('.header-menu > ul a[href^="#"]').each(function () {
			var $this = $(this),
				link = $this.attr('href'),
				anchor;
			if ($.fn.lsvrScrollspy && $(link).length > 0 && !$(link).hasClass('scrollspied')) {
				$(link).addClass('scrollspied');
				$(link).lsvrScrollspy({
					tolerance: 200,
					onEnter: function () {
						$('.header-menu > ul > li.m-active').removeClass('m-active');
						$('.header-menu a[href="' + link + '"]').parent().addClass('m-active');
					}
				});
				$(window).trigger('scroll');
			}
		});
		$('.header-navigation-toggle').click(function () {
			var $this = $(this),
				$headerNavigation = $('#header .header-navigation');
			if ($this.hasClass('m-active')) {
				$this.removeClass('m-active');
				$headerNavigation.slideUp(300);
			} else {
				$this.addClass('m-active');
				$headerNavigation.slideDown(300);
			}
		});
		$(document).on('screenTransition', function () {
			$('.header-navigation-toggle').removeClass('m-active');
			$('#header .header-navigation').removeAttr('style');
		});
		$('.header-search').each(function () {
			var $this = $(this),
				$form = $this.find('form'),
				$searchInput = $form.find('.search-input');
			$this.hover(function () {
				if (mediaQueryBreakpoint > 1199) {
					$this.addClass('m-hover');
					$form.show().addClass('animated fadeInDown');
					$searchInput.focus();
				}
			}, function () {
				if (mediaQueryBreakpoint > 1199) {
					$this.removeClass('m-hover');
					$form.hide().removeClass('animated fadeInDown');
				}
			});
		});
		if ($.fn.lsvrParallax) {
			$('#page-title.m-parallax .page-title-top').each(function () {
				$(this).lsvrParallax('50%', 0.3);
			});
		}
		if ($.fn.lsvrDribbbleFeed) {
			$('.dribbble-widget').each(function () {
				$(this).lsvrDribbbleFeed();
			});
		}
		if ($.fn.lsvrFlickrFeed) {
			$('.flickr-widget').each(function () {
				$(this).lsvrFlickrFeed();
			});
		}
		if ($.fn.lsvrInstagramFeed) {
			$('.instagram-widget').each(function () {
				$(this).lsvrInstagramFeed();
			});
		}
		if ($.fn.lsvrMailchimpSubscribeForm) {
			$('.subscribe-widget-form').each(function () {
				$(this).lsvrMailchimpSubscribeForm();
			});
		}
		if ($.fn.lsvrParallax) {
			$('#footer.m-parallax').each(function () {
				$(this).lsvrParallax('50%', 0.3);
			});
		}
		$('a[href^="#"]').each(function () {
			var $this = $(this),
				element = $this.attr('href');
			if ($(element).length > 0) {
				$this.click(function (e) {
					$('html, body').animate({
						'scrollTop': $(element).offset().top - 95
					}, 500);
					return false;
				});
			}
		});
	});
})(jQuery);
const isMobile ={
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS () ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};
// На каком устройстве открыт сайт

if( isMobile.any()) {
	document.body.classList.add('_touch');
	let menuArrows = document.querySelectorAll('.menu_link');
	if (menuArrows.length > 0){
		for (let index = 0; index < menuArrows.length; index++){
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener("click", function(e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}

} else {
	document.body.classList.add('_pc');
	let menuArrows = document.querySelectorAll('.menu_link');
	if (menuArrows.length > 0){
		for (let index = 0; index < menuArrows.length; index++){
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener("click", function(e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
}
// Проверка на каком устройстве открыт сайт

//Меню бургер

const iconMenu = document.querySelector('.menu_icon');
if(iconMenu){
	const menuBody = document.querySelector('.menu_body');
	iconMenu.addEventListener("click", function(e){
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}

// -------------------------------------

//Прокрутка при клике

const menuLinks = document.querySelectorAll('.menu_link[data-goto]');
if (menuLinks.length > 0){
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});
	function onMenuLinkClick(e){
		const menuLink = e.target;
		if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)){
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;
			
			if(iconMenu.classList.contains('_active')){
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}


			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}