  // =======================================================================
  // ナビゲーションアイコン（サブのメニュー）
  // =======================================================================
$(window).load(function() {
	bhs_sub_nav();
	tile_lib();

	$('#bhs_contents , #bhs_navbar').prepend('<div class="overlay_sub"></div>');

});

var bhs_sub_nav = function(){

	var s = $('#bhs_sub_navBox');
	var btn = s.find('ul.bhs_sub_megamenu li a');
	var lists = s.find('.bhs_sub_megamenu_open');

	btn.on('click', function(){



		if($(this).parent().is('.cur')){

			btn.parent().removeClass('cur');
			lists.slideUp(0);

			$('.overlay_sub').hide(); // オーバーレイ必ず消す

		}else{
			btn.parent().removeClass('cur');
			$(this).parent().addClass('cur');

			lists.hide();
			$($(this).attr('href')).slideDown(0);

			$('.overlay_sub').show(); // オーバーレイ必ず出す

		}





	// オーバーレイをクリックしたら
	$('.overlay_sub').click(function() {

			$('.overlay_sub').hide(); // オーバーレイ必ず消す
		$(this).slideUp(0); 

			btn.parent().removeClass('cur');
			$(this).parent().addClass('cur');

			lists.hide();
			$($(this).attr('href')).slideDown(0);

	});

	// ヘッダーとメニューのリンク以外の部分をクリックしても消えるようにする
	$('#bhs_header , #bhs_sub_megamenuWrap').click(function() {
	 $('.overlay_sub').hide(); // サブのオーバーレイも必ず消す
		lists.hide();
			$($(this).attr('href')).slideDown(0); //コンテンツ閉じる
			btn.parent().removeClass('cur'); //メニューの赤いのやめる
});


		return false;
	});
};


