$(window).on("load", function () {

   // Preload 
   $("#preload").fadeOut(500);
   $('.header-content h1, .wrapper-header-content h1').fadeIn(2000);


});

jQuery(document).ready(function () {

   // Scroll Top Button
   $('#scroll-top').click(function (event) {
      event.preventDefault();
      $('body,html').animate({
         scrollTop: 0
      }, 800);
      return false;
   });

   $('#scroll-top').hide();
   $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
         $('#scroll-top').fadeIn();
      } else {
         $('#scroll-top').fadeOut();
      }
   });

   // OWl Carousel Products
   $('.products-carousel').owlCarousel({
      loop: true,
      margin: 20,
      nav: false,
      dots: true,
      responsive: {
         0: {
            items: 1
         },
         600: {
            items: 2
         },
         1050: {
            items: 4
         }
      }
   });

   // OWl Carousel Testimonials
   $('.testimonials-carousel').owlCarousel({
      loop: true,
      margin: 20,
      nav: false,
      dots: true,
      responsive: {
         0: {
            items: 1
         },
         600: {
            items: 1
         },
         1000: {
            items: 1
         }
      }
   });

   // Dropdown Mobile Menu 
   $('.mobile-menu > li.menu-item-has-children > a').append('<i class="fa-solid fa-chevron-down"></i>');
   $('.mobile-menu .sub-menu > li.menu-item-has-children > a').append('<i class="fa-solid fa-chevron-down"></i>');
   $('.mobile-menu > li.menu-item-has-children > a').click(function () {
      $(this).next('.sub-menu').slideToggle();

   });
   $('.mobile-menu .sub-menu > li.menu-item-has-children > a').click(function () {
      $(this).next('.sub-menu').slideToggle();

   });

   // Show/hide Mobile Menu 
   $('#closemenu').click(function (event) {
      event.preventDefault();
      $('#mobile-nav').animate({
         'left': '-320px'
      }, 800);
   });
   $('#openmenu').click(function (event) {
      event.preventDefault();
      $('#mobile-nav').animate({
         'left': '0px'
      }, 800);
   });

   // Boxloader
   $(".single-pricing, .single-service, #product, .wrapper-testimonials, .single-blog").boxLoader({
      direction: "y",
      position: "100%",
      effect: "fadeIn",
      duration: "1s",
      windowarea: "100%"
   });

   // Accordion FAQ
   var titleAccordion = $('.wrapper-accordion h3');
   var contentAccordion = $('.content-accordion');

   titleAccordion.click(function () {
      var content = $(this).next(contentAccordion);
      if (content.is(':visible')) {
         content.slideUp();
         $(this).children('.fa-solid').removeClass('fa-arrow-up').addClass('fa-arrow-down');
      } else {
         contentAccordion.slideUp();
         content.slideDown();
         titleAccordion.children('.fa-solid').removeClass('fa-arrow-up').addClass('fa-arrow-down');
         $(this).children('.fa-solid').removeClass('fa-arrow-down').addClass('fa-arrow-up');
      }

   });

   // Contact Form Ajax
   $('.contact-form .btn').click(function (e) {
      e.preventDefault();

      var name = $('input[name="name"]').val();
      var email = $('input[name="email"]').val();
      var subject = $('input[name="subject"]').val();
      var messege = $('textarea[name="messege"]').val();
      $('input, textarea').focus(function () {
         $('.res-contact').fadeOut();
      });

      if (name == '' || email == '' || subject == '' || messege == '') {
         $('.res-contact').fadeIn().html('<span class="error">All fields must be filled.</span>');
         $('input').focus(function () {
            $('.res-contact').fadeOut();
         });
      } else {
         $.ajax({
            url: '../contact.php',
            type: 'POST',
            data: {
               name: name,
               email: email,
               subject: subject,
               messege: messege
            },
            dataType: 'html',
            success: function (data) {
               if (data == 'Send') {
                  $('.res-contact').fadeIn().html('<span class="send">Thanks. We will contact you shortly.</span>');

                  $('input[name="name"]').val('');
                  $('input[name="email"]').val('');
                  $('input[name="subject"]').val('');
                  $('textarea[name="messege"]').val('');
                  $('input, textarea').focus(function () {
                     $('.res-contact').fadeOut();
                  });
               }

            }


         });
      }

   });


}); // ready