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
                url: `https://www.googleapis.com/youtube/v3/search/?part=snippet&key=API_KEY_GOOGLE&q=` + title + query,
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

function showEventSearch() {
    event.preventDefault()
    $('#musicsearch').hide()
    $('#maxdiv').show()
}

function searchUpcoming(event) {
    event.preventDefault()

    const output = $("#upcoming-search").serializeArray()
    console.log(output)

    $.ajax({
        url: "http://localhost:3000/upcoming",
        method: "POST",
        data: output

    })
    .done((response) => {
        for(event of response) {
            $("#upcoming-list").append(
                `<div class="fetchedItems" style="margin-bottom: 0.8rem; padding: 8px; background-color: #e4e1d8; font-size: 0.85rem;" class="container"><h5 style="font-size: 1rem; margin-bottom: 0.4rem;">${event.displayName}</h5>&nbsp;&nbsp;&nbsp;&nbsp;Artists: ${event.artists}<br>&nbsp;&nbsp;&nbsp;&nbsp;Start date: ${event.startDate}<br>&nbsp;&nbsp;&nbsp;&nbsp;Venue: ${event.venue}<br>&nbsp;&nbsp;&nbsp;&nbsp;City: ${event.city}<br></div>`
            )
        }
    })
    .fail((jqXHR, textStatus) => {
        console.log("Failed", textStatus)
    })
}

$(document).ready(function () {
    $('#maxdiv').hide()

    $('#search-music').submit(function () {
        search()
    })

    $("#upcoming-search").submit(function(event) {
        $(".fetchedItems").remove()
        searchUpcoming(event);
    })
})

// YOUTUBE_API_KEY=AIzaSyArcX7Ict6UnR7rd0uc_D4LZZmygIVlE38
