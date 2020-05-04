$(function () {
    console.log("hi");
    $(".butnAdd").each(function () {

        $(this).click(function () {
            let vidid = $(this).siblings('.anc').attr('href');
            let desc = $(this).siblings('.details').children('.desc').text();
            let title = $(this).siblings('.details').children('.title').text();
            let imageurl = $(this).siblings('.anc').children('.thumb').attr('src');
            console.log(vidid);
            console.log(desc);
            addproduct(
                vidid,
                desc,
                title,
                imageurl,
                function (addedProduct) {
                    window.alert("Added to Database")
                }
            )
        })
    })

    function addproduct(vidid,desc, title, imageurl, done) {
        $.post('/playlist', {
            vidid:vidid,
            desc: desc,
            title: title,
            imageurl: imageurl
        },
            function (data) {
                done(data)
            })
    }
})
