$(function () {
    console.log("hi");
    $(".play").each(function () {

        $(this).click(function () {
            let id = $(this).parent('.item').attr('data-key');
            console.log(id);
            $(this).parent('.item').remove();
            console.log("---------------------------------------------")
            
            remproduct(
                id,
                function (addedProduct) {
                    alert("deleted");
                }
            )
        })
    })

    function remproduct(id, done) {
        $.post('/remplaylist', {
            id: id
        },
            function (data) {
                done(data)
            })
    }

    const filterinput = document.querySelector('#filter');
    filterinput.addEventListener('keyup',filterlist);

    function filterlist(){
        // console.log(filterinput.value);
        const regExp = new RegExp(filterinput.value, 'gi');
        // console.log(regExp);
        let artic = document.querySelectorAll('.item');
        artic.forEach(art =>{
            let str = art.innerText.substring(0,50);
            if(str.match(regExp)){
                console.log(regExp);
                art.style.display = '';
            }else{
                art.style.display = 'none';
            }
        })
        // console.log(artic);
    }

})
