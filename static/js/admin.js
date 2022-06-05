

$(document).ready(() => {
    $('#make_admin').submit((event) => {
        event.preventDefault();
        var username = document.getElementById("to_add").value;
        if(username && username.length > 0){
            $.post('/admin/make_admin', {
                username: username
            }).done((data) => {
                $("span").html(data)
            })
        }
        else{
            console.log("Enter a valid username");
        }
    });

    $('#remove_admin').submit((event) => {
        event.preventDefault();
        var username = document.getElementById("to_remove").value;
        if(username && username.length > 0){
            $.post('/admin/remove_admin', {
                username: username
            }).done((data) => {
                $("span").html(data)
            })
        }
        else{
            console.log("Enter a valid username ");
        }
    });

})

