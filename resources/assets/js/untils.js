var images = [], $images;
function createImgTemplate(name, uploadDir) {
    var url = uploadDir + name;
    var col = $('<div/>').addClass('col-sm-3');
    var t = $('<div/>').addClass('thumbnail');
    var img = $('<img/>').attr('src', url);
    var c = $('<div/>').addClass('caption');
    var btn = $('<button/>').addClass('btn btn-danger')
        .attr('type', "button")
        .text('删').attr('onclick', "delete_imgs(this, '" + url + "','"+ uploadDir +"')");
    var p = $('<p/>').append(btn);
    c.append(p);
    t.append(img).append(c);
    col.append(t);
    return col;
}
function ajaxDel(dir, filename) {
    return $.ajax({
        type: 'DELETE',
        url: '/admin/upload/',
        dataType: "json",
        data: {
            _method: 'delete',
            dir: dir,
            filename: filename
        }
    });
}
function delete_imgs(obj, url, uploadDir) {
    var rs = url.split(uploadDir);
    ajaxDel(uploadDir, rs[1]).then(function (data) {
        if (data.success) {
            $(obj).parents('.col-sm-3').remove();
            images.splice($.inArray(url, images), 1);
            $images.trigger('update');
        }
    });
}
function fileuploadInit(uploadDir, maxFileCount) {
    $("#fileuploader").fileupload({
        url: "/admin/upload?dir=" + uploadDir,
        fileName: "image",
        maxFileCount: maxFileCount,
        done: function (e, data) {
            try {
                var rs = data.result;
                rs = JSON.parse(rs);
                rs = rs.files;
                $.each(rs, function (index, file) {
                    $('#images_box').append(createImgTemplate(file.name, uploadDir));
                    images.push(uploadDir + file.name);
                });
                $images.trigger('update');
            } catch (e) {
                console.warn(e);
            }
        }
    });
}
$(document).ready(function () {
    $images = $('#images');
    images = $images.val() ? $images.val().split(',') : [];
    $images.on('update', function () {
        for (var key in images) {
            if (!images[key]) delete images[key];
        }
        $images.val(images.join(','));
    });
    $images.trigger('update');
});
