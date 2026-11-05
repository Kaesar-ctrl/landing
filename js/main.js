$(function() {
	var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var config = window.FIT_CONFIG || {};
	$('#header').stickyHeader();
	$('#menu-principal').onePageNav({
		currentClass: 'active',
		changeHash: false,
		scrollSpeed: reducedMotion ? 0 : 650,
		scrollOffset: 78,
		scrollThreshold: 0.25
	});
	$('.menu-boton').on('click', function() {
		var open = $(this).attr('aria-expanded') !== 'true';
		$(this).attr('aria-expanded', String(open)).attr('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
		$('#menu-principal').toggleClass('abierto', open);
	});
	$('#menu-principal a').on('click', function() {
		$('.menu-boton').attr('aria-expanded', 'false').attr('aria-label', 'Abrir menú');
		$('#menu-principal').removeClass('abierto');
	});
	$(document).on('keydown', function(event) {
		if (event.key === 'Escape') {
			$('.menu-boton').attr('aria-expanded', 'false').attr('aria-label', 'Abrir menú');
			$('#menu-principal').removeClass('abierto');
		}
	});
	$('.beneficios-carousel').owlCarousel({
		items: 3,
		margin: 16,
		loop: false,
		autoplay: false,
		smartSpeed: reducedMotion ? 0 : 500,
		dots: true,
		responsive: {
			0: { items: 1, margin: 16 },
			480: { items: 2, margin: 16 },
			768: { items: 3, margin: 16 }
		},
		onInitialized: labelDots,
		onRefreshed: labelDots
	});
	function labelDots() {
		$('.owl-dot').each(function(index) {
			$(this).attr({ 'aria-label': 'Ver beneficio ' + (index + 1), type: 'button' });
		});
	}
	if (!reducedMotion) {
		new WOW({ offset: 25, mobile: false, live: false }).init();
	}
	$('[data-fancybox]').fancybox({
		touch: false,
		autoFocus: true,
		animationDuration: reducedMotion ? 0 : 300
	});
	$('.cerrar-y-comenzar').on('click', function() {
		$.fancybox.close();
	});
	if (config.siteUrl) {
		try {
			var site = new URL(config.siteUrl);
			if (!/^https?:$/.test(site.protocol)) throw new Error('URL no válida');
			$('<link>', { rel: 'canonical', href: site.href }).appendTo('head');
			$('<meta>', { property: 'og:url', content: site.href }).appendTo('head');
			$('<meta>', { property: 'og:image', content: new URL('img/hero-curry.png', site).href }).appendTo('head');
		} catch (error) {
			console.warn('Revisa siteUrl en config.js.');
		}
	}
	var validMailchimp = false;
	if (config.mailchimpAction) {
		try {
			var action = new URL(config.mailchimpAction);
			validMailchimp = action.protocol === 'https:' && /(^|\.)list-manage\.com$/.test(action.hostname) && action.pathname === '/subscribe/post' && action.searchParams.has('u') && action.searchParams.has('id');
			if (validMailchimp) $('#registro-form').attr('action', action.href);
		} catch (error) { validMailchimp = false; }
	}
	$('#registro-form').on('submit', function(event) {
		if (!validMailchimp) {
			event.preventDefault();
			$('#registro-estado').text('Modo de demostración: tus datos no se han enviado.').prop('hidden', false);
			return;
		}
		$('#registro-estado').text('Completá la confirmación en la ventana de Mailchimp para finalizar tu inscripción.').prop('hidden', false);
	});
});
