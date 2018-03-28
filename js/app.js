$(document).foundation();
$(document).ready(function() {
	// Simple off canvas menu
	$('#simple-menu').click(function() {
		var offCanvasMenu = $('#off-canvas-menu');
		$(this).toggleClass('close');
		offCanvasMenu.toggleClass('active');
		return false;
	});

	$('#off-canvas-menu').on('click', '.go-section', function() {
		var offset = 47; //Offset of 20px

		var target = this.hash;

	    $('html, body').animate({
	        scrollTop: $(target).offset().top - offset
	    }, 300);

	    $('#off-canvas-menu').removeClass('active');
	    $('#simple-menu').removeClass('close');

	});

	// Custom arrows domElements
	$prevSlideEle = $('#prev-slide');
	$nextSlideEle = $('#next-slide');

	// Main slider instance
	$('.main-slider').slick({
		prevArrow: $prevSlideEle,
		nextArrow: $nextSlideEle
	});

	// Bind when the Modal is opened
	$(document).on('open.fndtn.reveal', '[data-reveal]', function () {
		// Slider paginas
		var $flexSlider = $(this).find('.flexslider');
		var $video = $(this).find('.flex-video');
		var iframe = '<iframe width="853" height="480" src="http://www.youtube.com/embed/-qLqL63UBqw?autoplay=1&version=3&showinfo=0&controls=0&rel=0&rel=0&wmode=opaque" frameborder="0" allowfullscreen></iframe>';

		
		if ( $flexSlider.length > 0 ) {
			// Instance flexlider
			$flexSlider.flexslider({
				controlNav: false,
				prevText: 'Anterior',
				nextText: 'Siguiente',
				animationSpeed: 300,
				slideshow: false,
				animationLoop: false,
				// smoothHeight: true
			});

			// Api flexslider
		    var flexSliderApi = $flexSlider.data('flexslider');

	    	// Always move to the first slide
	    	flexSliderApi.flexAnimate(0);

		} else if ( $video.length > 0 ) {
			$video.append(iframe);
		}
	
	});

	// Bind when modal videos is closed to top the video
	$(document).on('close.fndtn.reveal', '[data-reveal]', function() {
		var $video = $(this).find('.flex-video');
		if ( $video.length > 0 ) {
			$video.find('iframe').remove();
		}
	});

	function goToSection($target) {
		$('html, body').animate({
			scrollTop: $target.offset().top 
		}, 300);
	}

	$('#goTramites').click(function(evt) {
		evt.preventDefault();
		$('.main-nav .top-bar-section').find('a')[1].click();;


	})

	// Close modal and go to contact section
	$('.footer-modal a').click(function(evt) {
		evt.preventDefault();
		$('.reveal-modal').foundation('reveal', 'close');

		$target = $('#contacto');

		goToSection($target);
		
	});

	// Bind off-canvas is open/closed
	$(document).on('open.fndtn.offcanvas', '[data-offcanvas]', function () {
		$('.hamburguer-menu').addClass('close');
	});

	$(document).on('close.fndtn.offcanvas', '[data-offcanvas]', function () {
		$('.hamburguer-menu').removeClass('close');
	});

	posicionarMenu();

	$(window).scroll(function() {    
		posicionarMenu();
	});

	function posicionarMenu() {
		var heightSecondaryNav = $('.secondary-bar').outerHeight(true);

		if ( $(window).scrollTop() >= heightSecondaryNav ) {
			$('.main-nav').addClass('fixed');
		} else {
			$('.main-nav').removeClass('fixed');
		}
	}

	//SPY MENU
	// Cache selectors

	function calculateHeight() {
		if ( $('.main-nav').hasClass('fixed') ) {
		
		return  topMenu.outerHeight();
		} else {
		
		return topMenu.height() + 70;
		}
	}


	var lastId,
		// All list items,
		topMenu = $(".main-nav"),
		menuItems = topMenu.find(".top-bar-section a").not('.this-not'),
		topMenuHeight = calculateHeight();
		// Anchors corresponding to menu items
		scrollItems = menuItems.map(function() {
			var item = $($(this).attr("href"));
			if (item.length) { 
				return item; 
			}
		});

	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function(e) {
		topMenuHeight = calculateHeight();
		var href = $(this).attr("href"),
		offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
		$('html, body').stop().animate({ 
			scrollTop: offsetTop
		}, 300);
		e.preventDefault();
	});

	if ( $(window).width() > 1024 ) {
		// Bind to scroll
		$(window).scroll(function() {
			// Get container scroll position
			var fromTop = $(this).scrollTop()+topMenuHeight;
			 
			// Get id of current scroll item
			var cur = scrollItems.map(function(){
			if ($(this).offset().top < fromTop)
				return this;
			});
			// Get the id of the current element
			cur = cur[cur.length-1];
			var id = cur && cur.length ? cur[0].id : "";
		 
			if (lastId !== id) {
				lastId = id;
				// Set/remove active class
				menuItems
				 .parent().removeClass("active")
				 .end().filter("[href=#"+id+"]").parent().addClass("active");
			}                   
		});

	}

	// Ajax contact
	$('.contact-form').submit(function() {
	
			var postdata = $('.contact-form').serialize();

			// debugger;

			$.ajax({
				type: 'POST',
				url: 'assets/sendmail.php',
				data: postdata,
				dataType: 'json',
				success: function(json) {

					// debugger;

					if(json.nameMessage != '') {
						$('#clientName')
							.attr('placeholder', json.nameMessage)
							.val('')
							.addClass('invalid');
					}

					if(json.emailMessage != '') {
						$('#clientEmail')
							.attr('placeholder', json.emailMessage)
							.val('')
							.addClass('invalid');
					}

					if(json.phoneMessage != '') {
						$('#clientPhone')
							.attr('placeholder', json.phoneMessage)
							.val('')
							.addClass('invalid');
					}

					if(json.messageMessage != '') {
						$('#clientMessage')
							.attr('placeholder', json.messageMessage)
							.val('')
							.addClass('invalid');
					}

					if(json.nameMessage == '' && json.emailMessage == '' && json.phoneMessage == '' && json.messageMessage == '') {

						function cleanInvalidEle($input, placeholder) {
							$input
								.val('')
								.attr('placeholder', placeholder)
								.removeClass('invalid');
						}

						$('.contact-form').append('<p class="color-nephritis">EMAIL ENVIADO CORRECTAMENTE.</p>');
						
						// Getting dom elements inputs
						$clientNameInput = $('#clientName');
						$clientEmailInput = $('#clientEmail');
						$clientPhone = $('#clientPhone');
						$clientMessageInput = $('#clientMessage');
						
						// Clean them
						cleanInvalidEle($clientNameInput, '*Nombre completo');
						cleanInvalidEle($clientEmailInput, '*Email');
						cleanInvalidEle($clientPhone, 'Teléfono');
						cleanInvalidEle($clientMessageInput, '*Comentarios');

					}
				}
			});
			return false;
		});		

});

$(window).load(function() {
	function loadMap(lat, lon, selectorId, markerLat, markerLon, styles) {
		// Map
		var latLong = new google.maps.LatLng(lat, lon);
		var mapOptions = {
			zoom: 15,
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP, center: latLong,
			disableDefaultUI: true,
			styles: styles,
			draggable: false
		};
		var map = new google.maps.Map(document.getElementById(selectorId), mapOptions);
		var center;

		// Marker
		var latLonMarker = new google.maps.LatLng(markerLat, markerLon);
		var marker = new google.maps.Marker({
			position: latLonMarker,
			map: map,
			icon: 'http://correduria4hidalgo.mx/img/marcador1.png'
		});

		// Bind window resize and center the map
		google.maps.event.addDomListener(map, "idle", function(){
			center = map.getCenter();
		});

		$(window).resize(function(){
			map.setCenter(center);
		});
	}

	var mapStyles = [{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#8e8e8e"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#7f7f7f"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#bebebe"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#cbcbcb"},{"weight":"0.69"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e4e4e4"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cbcbcb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d9d9d9"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"simplified"}]}];
	loadMap(20.058276, -98.776727, "map-canvas", 20.058276, -98.776727, mapStyles);

});

