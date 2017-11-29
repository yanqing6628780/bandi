// =======================================================================
// 【共通】
// 高さを揃える
// 実行させるJSについては「jquery.tile.js」を参照
// =======================================================================
var tile_lib = function() {
    //高さ調整

$(function(){


	//【TOP】
	$('#bhs_news ul li p.bhs_info_img').tile(3); //ニュースの画像を3つ並びで揃える
 $('#bhs_news ul li p.bhs_info_cd').tile(3); //ニュースのテキストを3つ並びで揃える
 $('#bhs_news ul li p.bhs_info_txt').tile(3); //ニュースのテキストを3つ並びで揃える
 $('#bhs_event ul li p').tile(2); //イベントのテキストを2つ並びで揃える
 $('#bhs_campaign ul li p').tile(2); //イベントのテキストを2つ並びで揃える

	//【商品一覧】
 $('#bhs_searchForm form ul li').tile(2); //詳細ページの検索フォームの項目を2つ並びで揃える


		//【共用】商品名の高さを2つ並びで揃える（「ol.bhs_pdlist_sbs」内でカウントする）
		$('ol.bhs_pdlist_sbs').each(function(){
			$(this).find('li span.bhs_pd_ttl').tile(2);
		});
		
		//【共用】商品リスト自体を2つ並びで揃える（「ol.bhs_pdlist_sbs」内でカウントする）※枠内の処理より後にする
		$('ol.bhs_pdlist_sbs').each(function(){
			$(this).find('li').tile(2);
		});


		//【イベント】商品リストを3つ並びで揃える（「ul.bhs_event_photoset」内でカウントする）
		$('ul.bhs_event_photoset').each(function(){
			$(this).find('li span.bhs_event_name').tile(3);
		});

		
		


});


};

$(window).on('load resize', function() {
//$(document).ready(function() {
//$(window).load(function() {
    tile_lib();
});


