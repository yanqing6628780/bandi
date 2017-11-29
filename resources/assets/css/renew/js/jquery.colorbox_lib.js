;(function ($) {

// =======================================================================
// 【汎用】
// colorbox各種設定
// =======================================================================
if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || (navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0)) {
    //▼iPhone・iPod・通常のAndroidの時（SP版）▼
    $(document).ready(function() {

        $(".bhs_cb_img").colorbox({
            maxWidth: "96%",
            maxHeight: "96%",
            opacity: 0.6
        });
        $(".bhs_cb_iframe").colorbox({
            iframe: true,
            width: "96%",
            height: "96%",
            opacity: 0.6
        });
        $(".bhs_cb_inline").colorbox({
            inline: true,
            width: "96%",
            height: "96%",
            opacity: 0.6
        });

    });
    //▲iPhone・iPod・通常のAndroidの時（SP版）ここまで▲
} else {
    //▼iPad・PC・Androidタブレットの時▼
    $(document).ready(function() {

        $(".bhs_cb_img").colorbox({
            maxWidth: "90%",
            maxHeight: "90%",
            opacity: 0.6
        });
        $(".bhs_cb_iframe").colorbox({
            iframe: true,
            width: "80%",
            height: "80%",
            opacity: 0.6
        });
        $(".bhs_cb_inline").colorbox({
            inline: true,
            maxWidth: "80%",
            maxHeight: "80%",
            opacity: 0.6
        });

    });
    //▲iPad・PC・Androidタブレットの時▲

}




})(jQuery);
