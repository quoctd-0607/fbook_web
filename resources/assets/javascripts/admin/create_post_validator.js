$('#create-post').validate({
    rules: {
        title: {
            required: true
        },
        file: {
            required: true
        }
    },
    messages: {
        title: {
            required: i18n['Title field is required']
        },
        file: {
            required: i18n['Image feature field is required']
        }
    }
});
