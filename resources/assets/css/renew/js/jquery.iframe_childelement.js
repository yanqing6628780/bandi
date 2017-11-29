(function(window, $){
		$(window).on('load resize', function() {
    var $frame = $('.bhs_parts_iframe', parent.document);
    var innerHeight = $frame.get(0).contentWindow.document.body.scrollHeight;
    var innerWidth = $frame.get(0).contentWindow.document.body.scrollWidth;
    $frame.attr('height', innerHeight + 'px');
    $frame.attr('width', innerWidth + 'px');
  })
})(window, jQuery)