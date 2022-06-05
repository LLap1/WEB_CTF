$(document).ready(() => {
    $("#upload_image").submit((event) => {
        event.preventDefault();

        fd = new FormData();
        file_input = document.querySelector("#avatar");
        image = file_input.files[0]
        fd.append('file', image);
        $.ajax({
            url: '/profile/upload_picture',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: (data) => {
                $("span").html(data)
            }
        })
    })
})

