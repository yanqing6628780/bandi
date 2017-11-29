
//ヘッダー読み込み
function writeHeader(rootDir){

	$.ajax({
		url: rootDir + "bhs_header.html", 
		cache: false,
		async: false, 
		success: function(html){

			html = html.replace(/\{\$root\}/g, rootDir);
			document.write(html);
		}
	});
}

//フッター読み込み
function writeFooter(rootDir){

	$.ajax({
		url: rootDir + "bhs_footer.html", 
		cache: false,
		async: false, 
		success: function(html){

			html = html.replace(/\{\$root\}/g, rootDir);
			document.write(html);
		}
	});
}


