/* Plugin jQuery local: encabezado fijo y sombra al desplazarse. */
(function($) {
	$.fn.stickyHeader = function(options) {
		var settings = $.extend({ offset: 12, activeClass: 'is-sticky' }, options);
		return this.each(function() {
			var $header = $(this);
			$header.css({ position: 'sticky', top: 0 });
			function updateHeader() {
				$header.toggleClass(settings.activeClass, $(window).scrollTop() > settings.offset);
			}
			$(window).on('scroll.stickyHeader', updateHeader);
			updateHeader();
		});
	};
})(jQuery);
