$(document).ready(() => {
    $("#login").submit(() => {
        event.preventDefault();
        $.post('/login', {
            username: $('#username').val(),
            password: $('#password').val()
        }).done((data) => {
            $("span").html(data) 
        })
    })
})