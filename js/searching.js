function search() {
    const query = $('#filter').val()
    event.preventDefault()
    $.ajax({
        type: "GET",
        data: {
            apikey: "88857a3b1aa17b278ea09ea14329b4d5",
            q_artist: `${query}`,
            f_has_lyrics: true,
            s_track_rating: 'desc',
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
                            <div style="position:absolute; right: 3%; top:12%"><i style="color:yellow; text-shadow: 4px 4px 4px #ccc; font-size:20px" class="fas fa-star"></i> ${rslt.track.track_rating}</div>
                            <div class="p-2">${rslt.track.album_name}</div>
                            <div class="p-2"><a href="#" onclick="getVidLyr(${rslt.track.track_id},'${rslt.track.track_name}','${query}')">Get video and lyric</a></div>
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

function getVidLyr(trackId, title, query) {
    $.ajax({
        type: "GET",
        data: {
            apikey: "88857a3b1aa17b278ea09ea14329b4d5",
            track_id: trackId,
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: `http://api.musixmatch.com/ws/1.1/track.lyrics.get`,
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function (data) {
            $('#lyric').empty()
            let lyricLink = data.message.body.lyrics.pixel_tracking_url
            let lyricLinkjs = data.message.body.lyrics.script_tracking_url
            let lyric = data.message.body.lyrics.lyrics_body
            lyric = lyric.split('\n')
            lyric = lyric.slice(0, lyric.length - 1)
            $('#lyric').append(`
            <img src="${lyricLink}">
            <script type="text/javascript" src="${lyricLinkjs}"></script>
            `)
            console.log(data.message.body.lyrics)
            console.log(lyric)
            lyric.forEach(element => {
                $('#lyric').append(`
                    <p>${element}</p>
                `)
            });
            $.ajax({
                type: "GET",
                url: `https://www.googleapis.com/youtube/v3/search/?part=snippet&key=AIzaSyArcX7Ict6UnR7rd0uc_D4LZZmygIVlE38&q=` + title + query,
                dataType: "jsonp",
                jsonpCallback: 'jsonp_callback',
                contentType: 'application/json',
                success: function (data) {
                    console.log(data.items[0].id.videoId)
                    let ytblink = data.items[0].id.videoId
                    $('#myVid').attr('src', `http://www.youtube.com/embed/${ytblink}?rel=0`)
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
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

// YOUTUBE_API_KEY=AIzaSyArcX7Ict6UnR7rd0uc_D4LZZmygIVlE38