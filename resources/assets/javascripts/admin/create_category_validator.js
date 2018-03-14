$('#create-category').validate({
    rules: {
        name: {
            required: true,
            minlength: 3
        }
    },
    messages: {
        name: {
            required: i18n['Name field is required'],
            minLength: i18n['Name must have more than 2 characters']
        }
    }
});
