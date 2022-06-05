$(document).ready(() => {
    $("#register").submit(() => {
        event.preventDefault();
        $.post('/register', {
            username: $('#username').val(),
            password: $('#password').val()
        }).done((data) => {
            $("span").html(data) 
        })
    })
})