






// JavaScript Document//==================================================
//　$.fn.linkScroll 
//  スクロールする関数
//  $('.scroll').linkScroll({scMargin:500,scSpeed:1000});
//==================================================

$(function(){
	$('#btnPagetop').linkScroll({scMargin:500,scSpeed:1000}); //scroll関数実行
});

;(function ($) {
    jQuery.fn.linkScroll = function (opt) {
        var opt = jQuery.extend({
            scMargin: 0, //スクロールする上からの距離
			scFade: 100, //消える箇所
            scSpeed: 700 //スピード
        }, opt);
		
		var uaWebkit = (!window.chrome && 'WebkitAppearance' in document.documentElement.style);//webkitか否か
		var $targetObj = $(this);

		$targetObj.hide();
		$(window).scroll(function () {
			if ($(this).scrollTop() > opt.scFade) {
				$targetObj.fadeIn();
			} else {
				$targetObj.fadeOut();
			}
		});

		$.easing.easeInOutExpo = function (x, t, b, c, d) { //イージング
            if (t === 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		};

        this.each(function () {
            $(this).on("click", "a", function () {
                var $href = $(this).attr("href");

                //ブラウザ間差異とガタツキ防止のため3項演算子で分岐
                $(uaWebkit ? 'body' : 'html').animate({
                    scrollTop: $($href).offset().top - opt.scMargin + "px"
                }, opt.scSpeed, 'easeInOutExpo');
				return false;
            });
        });
		
		return false;
    };
	

      //ページ内リンク用
      jQuery(function() {
          //$('a[href^=#]').click(function() {
				$('a[href^=#]').not("ul.bhs_sub_megamenu li a[href^=#]").click(function() {
              var speed = 600;
              var href = $(this).attr("href");

              var target = $(href == "#" || href == "" ? 'html' : href);

              var position = target.offset().top;

              $("html, body").animate({
                  scrollTop: position
              }, speed, "swing");

//              return false;

		          //colorboxの時のinlineは除外
          $("a.bhs_cb_inline").unbind('click');
										
          });



      });

	

})(jQuery);







