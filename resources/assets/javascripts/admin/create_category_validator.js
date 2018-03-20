$('#create-category').validate({
    rules: {
        name_vi: {
            required: true,
            minlength: 3
        },
        name_en: {
            required: true,
            minlength: 3
        },
        name_jp: {
            required: true,
            minlength: 3
        }
    },
    messages: {
        name_vi: {
            required: i18n['Name field is required'],
            minLength: i18n['Name must have more than 2 characters']
        },
        name_en: {
            required: i18n['Name field is required'],
            minLength: i18n['Name must have more than 2 characters']
        },
        name_jp: {
            required: i18n['Name field is required'],
            minLength: i18n['Name must have more than 2 characters']
        }
    }
});
