// ランキング機能拡張 プラグイン
(function($) {
	$.fn.extend({
		addRankingExternalLink : function(){
			var $that = $(this);
			
			$that.on('click', ' > a', function(){
				//console.log('news click!!!');
				var url = $(this).attr('href'),
					tmp = url.split('/'),
					scheme = tmp[0],
					host   = tmp[2];
				
				//console.log(url);
				//console.log(0 === scheme.indexOf('http') ? '絶対パス' : '相対パス?');
				//console.log(/(www.|koida.)?bandai-hobby.net/.test(host) ? 'ホビーサイト' : '外部ホスト または、相対パス');
				
				if( 0 === scheme.indexOf('http') 
				&& false === /(www.|koida.)?bandai-hobby.net/.test(host) ){
					console.log('外部URL!! ランキング集計');
					// 絶対パスかつホスト名が ～bandai-hobby.net ではない場合ランキング集計
					$.ajax({
						type : 'POST',
						url : '//bandai-hobby.net/ranking.php',
						data: {
							request_url: url
						},
						success : function(ret){
						},
						error : function(ret){
						}
					});
				}
			});
		}
	});
	// 他のライブラリで $ が使用されている可能性があるので、グローバルスコープからは $ ではなく、jQuery を指定。
})(jQuery);


