


$(document).ready(() => {
    const socket = io("http://127.0.0.1:3000");
    $('#chat').submit((event) => {
        event.preventDefault();
        var msg = $('#input').val();
        if (msg.length > 0) {
            socket.emit('message', msg);
        }
        else {
            console.log("Enter a valid msg :)");
        }
        $('#input').val("");
        return false;
    });

    socket.on('response', (response) => {
        console.log(response)
        $("#messages").append(`
        <span>
        <img width="100" height="100" src="image/users/${response.image}">
        <p>${response.name}:</p>
        <p style="text-align: left">${response.data}
        </span>`
        );
    });

    socket.on('connect', (_) => {
        console.log("Connect")
    });
})

