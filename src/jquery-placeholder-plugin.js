(function($) {
    // check browser support for placeholder
    $.support.placeholder = 'placeholder' in document.createElement('input');

    // plugin code
	$.fn.placeholder = function(opts) {
		opts = $.extend({
			focusClass: 'placeholderFocus',
			activeClass: 'placeholderActive',
			overrideSupport: false,
			preventRefreshIssues: true
		}, opts);

		// we don't have to do anything if the browser supports placeholder
		if(!opts.overrideSupport && $.support.placeholder)
		    return this;
		
		// Replace the val function to never return placeholders
		$.fn.plVal = $.fn.val;
		$.fn.val = function(value) {
			if(value != undefined)
				return $(this).plVal(value);
			

			if(this[0]) {
        		var el = $(this[0]);
        		if(el.hasClass(opts.activeClass) && el.plVal() == el.attr('placeholder')) {
           			return '';
       			} else {
           	 		return el.plVal();
        		}
    		}
    		return undefined;
		};
		
		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			console.log('removing values');
			$('input.' + opts.placeholderBlur).val('').attr('autocomplete','off');
		});


        return this.each(function() {
            var $el = $(this);

            // skip if we do not have the placeholder attribute
            if(!$el.is('[placeholder]'))
                return;

            // we cannot do password fields, but supported browsers can
            if($el.is(':password'))
                return;
			
			// Prevent values from being reapplied on refresh
			if(opts.preventRefreshIssues):
				$el.attr('autocomplete','off');

            $el.bind('focus.placeholder', function(){
                var $el = $(this);
                if(this.value == $el.attr('placeholder') && $el.hasClass(opts.activeClass))
                    $el.val('')
                       .removeClass(opts.activeClass)
                       .addClass(opts.focusClass);
            });
            $el.bind('blur.placeholder', function(){
                var $el = $(this);
				
				$el.removeClass(opts.focusClass);

                if(this.value == '')
                  $el.val($el.attr('placeholder'))
                     .addClass(opts.activeClass);
            });

            $el.triggerHandler('blur');
			
			// Prevent incorrect form values being posted
			$el.parents('form').submit(function(){
				$el.triggerHandler('focus.placeholder');
			});

        });
    };
})(jQuery);
