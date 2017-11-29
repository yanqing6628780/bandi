//$(function(){
//	$(".bhs_parts_aco_expand").hide();
//	var $targetSlide = $('.bhs_parts_aco_expand'); //展開先のボックス
//	var $acordBtn = $('#bhs_parts_aco_tgl_open'); //オープンボタン
//	var $closeBtn = $('#bhs_parts_aco_tgl_close'); //closeボタン
//	var $targetCss = $('.bhs_parts_aco_expand');
//	//この「$targetCss」に書いたclassに「display:none;」が自動で付与されて非表示、
//	//オープン時に「.open」と「display:block;」が付与されて表示。という挙動になります。
//	
//	$acordBtn.click(function(){
//		$targetSlide.slideToggle(600, "linear"); //※slide関係はlinearかswingのみ
//		$targetSlide.siblings(".bhs_parts_aco_expand").slideUp();
//		
//		$acordBtn.toggleClass("bhs_openBtn");
//		$acordBtn.siblings("#bhs_parts_aco_tgl_open").removeClass("bhs_openBtn");
//
//		$targetCss.toggleClass("open");
//		$targetCss.siblings(".bhs_parts_aco_expand").removeClass("open");
//		return false;
//	});
//	
//	
//	$closeBtn.click(function(){
//		$targetSlide.slideToggle(600, "linear");
//		$targetSlide.siblings(".bhs_parts_aco_expand").slideUp();
//
//	$targetCss.toggleClass("open");   
//		$targetCss.siblings(".bhs_parts_aco_expand").removeClass("open");
//		var position = $("#bhs_parts_aco_tgl_open").offset().top;
//		$("html, body").animate({scrollTop:position}, 300, "linear");
//		return false;
//	});
//});



$(window).on('load',function(){
	
	//クリック時のfunction設定
	$('#bhs_parts_aco_tgl_open').click(function(){
		$('.bhs_parts_aco_expand').slideToggle(600, "linear");
		$('#bhs_parts_aco_tgl_open').toggleClass("bhs_openBtn");
				
		//クリックした際にcookieのセットの確認
		if ($.cookie("bhs_openbtn_cookie001")) {//もしcookie("bhs_openbtn_cookie001")があれば  
			$.cookie("bhs_openbtn_cookie001", '', { expires: -1 });//cookie("bhs_openbtn_cookie001")を削除  
		} else {  
			$.cookie("bhs_openbtn_cookie001", '1', {expires:7});//cookie("bhs_openbtn_cookie001")をセット 
		}
	});

	//セットされたcookieの設定
	if ($.cookie("bhs_openbtn_cookie001")) {//もしcookie("bhs_openbtn_cookie001")があれば  

  $(".bhs_parts_aco_expand").show();//要素を隠す
		$("#bhs_parts_aco_tgl_open").toggleClass("bhs_openBtn");

} else {  

	$(".bhs_parts_aco_expand").hide();//要素を表示する
		$("#bhs_parts_aco_tgl_open").removeClass("bhs_openBtn");
	}  


	$('#bhs_parts_aco_tgl_open').css( {
		cursor : "pointer" //ポインターを表示
	});
});
