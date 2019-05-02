function search() {
    const query = $('#filter').val()
    event.preventDefault()
    $.ajax({
        type: "GET",
        data: {
            apikey: "88857a3b1aa17b278ea09ea14329b4d5",
            q_artist: `${query}`,
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "http://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function (data) {
            const result = data.message.body.track_list
            $('#searchlist').html('')
            result.map(rslt => {
                console.log(rslt.track)
                $('#searchlist').append(`<div class="card">
                <div class="card-body">
                    <h3>${rslt.track.track_name}</h3>
                    <p>${rslt.track.artist_name}</p>
                    <div>
                        <div class="d-flex flex-row">
                            <div class="p-2">${rslt.track.album_name}</div>
                            <div class="p-2"><a href="#">Get video lirics</a></div>
                        </div>
                    </div>
                </div>
            </div>`)
            })
          


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })

}


$(document).ready(function () {
    $('#search-music').submit(function () {
        search()
    })

})