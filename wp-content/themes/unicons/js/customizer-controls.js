

jQuery(document).ready(function($) {

	    //Scroll to panel

			//Scroll to section
	    $('body').on('click', '#sub-accordion-panel-theme_options .control-subsection .accordion-section-title', function(event) {
	        var section_id = $(this).parent('.control-subsection').attr('id');
	        scrollToSection( section_id );
	    });
	});


	function scrollToSection( section_id ){
	    var preview_section_id = "staticslider";

	    var $contents = jQuery('#customize-preview iframe').contents();

	    switch ( section_id ) {
	        case 'accordion-section-slider_setup':
	        preview_section_id = "staticslider";
	        break;
					case 'accordion-section-sidebar-widgets-sidebar-service':
	        preview_section_id = "service";
	        break;
					case 'accordion-section-unicons_latestsetup':
	        preview_section_id = "latset-postsaf";
	        break;
					case 'accordion-section-sidebar-widgets-sidebar-team':
	        preview_section_id = "team1";
	        break;
					case 'accordion-section-sidebar-widgets-sidebar-contact':
	        preview_section_id = "contact";
	        break;


	    }

	    if( $contents.find('#'+preview_section_id).length > 0 ){
	        $contents.find("html, body").animate({
	        scrollTop: $contents.find( "#" + preview_section_id ).offset().top -40
	        }, 1000);
	    }
	}
