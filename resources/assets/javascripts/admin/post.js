var Post = {};

Post.init = function () {
    var scope = this;
    //scope.modalBooking();
};

Post.checkAuthorized = function () {
    if (typeof(access_token) === 'undefined' || typeof(user) === 'undefined') {
        showNotify(
            'danger', 
            i18n['Please login before action'], 
            {icon: 'glyphicon glyphicon-remove'}, 
            {delay: 3000}
        );

        return false;
    }

    return true;
};

Post.addNew = function () {
    var scope = this;
    if (!scope.checkAuthorized()) {
        return false;
    }

    if (!$('#create-post').valid()) {
        return false;
    }

    var content = tinymce.get('content').getContent();
    if (content == '') {
        tinymce.activeEditor.setContent('<p style="color: red; font-size: 30px">' + i18n['Content field is required'] +'</p>');
        return false;
    }

    var formData = new FormData();
    formData.append('title', $('#title').val().trim());
    formData.append('content', tinymce.get('content').getContent());
 
    //Attach file
    if ($("[name='file']")[0].files[0]) {
        formData.append('medias[0][file]', $("[name='file']")[0].files[0]);
    }

    $.ajax({
        url: API_PATH + 'admin/posts',
        headers: {'Accept': 'application/json', 'Authorization': access_token},
        method: 'POST',
        contentType:false,
        cache: false,
        processData:false,
        data: formData
    }).done(function (res) {
        window.location.href = '/admin/posts';
    }).fail(function (errors) {
        showNotify(
            'danger', 
            'Khong luu duoc vao CSDL', 
            {icon: 'glyphicon glyphicon-remove'}, 
            {delay: 3000}
        );
    });
};

Post.editPost = function (id) {
    var scope = this;
    if (!scope.checkAuthorized()) {
        return false;
    }

    if (!$('#edit-post').valid()) {
        return false;
    }

    var content = tinymce.get('content').getContent();
    if (content == '') {
        tinymce.activeEditor.setContent('<p style="color: red; font-size: 30px">' + i18n['Content field is required'] +'</p>');
        return false;
    }

    var formData = new FormData();
    formData.append('title', $('#title').val().trim());
    formData.append('content', tinymce.get('content').getContent());
 
    //Attach file
    if ($("[name='file']")[0].files[0]) {
        formData.append('medias[0][file]', $("[name='file']")[0].files[0]);
    }

    $.ajax({
        url: API_PATH + 'admin/posts/update/' + id,
        headers: {'Accept': 'application/json', 'Authorization': access_token},
        method: 'POST',
        contentType:false,
        cache: false,
        processData:false,
        data: formData
    }).done(function (res) {
        window.location.href = '/admin/posts';
    }).fail(function (errors) {
        showNotify(
            'danger', 
            'Khong luu duoc vao CSDL', 
            {icon: 'glyphicon glyphicon-remove'}, 
            {delay: 3000}
        );
    });
};
