$(document).ready(function() {
    const apiUrl = "https://station.raptureradio.cc/api/nowplaying/radio";

    function updateStreamInfo(data) {
        if (!data) return;

        const nowPlaying = data.now_playing.song;
        //const playingNext = data.playing_next.song;
        //const songHistory = data.song_history;

        // 현재 재생 중인 곡 업데이트
        $('#cc_strinfo_song_raptureradio').html(nowPlaying.title);
        //$('#cc_strinfo_artist').html(nowPlaying.artist);
        //$('#cc_strinfo_album').html(nowPlaying.album);
        //$('#cc_strinfo_art').attr('src', nowPlaying.art);

        // 다음 곡 업데이트
        //$('#cc_strinfo_next_song').html(playingNext.title);
        //$('#cc_strinfo_next_artist').html(playingNext.artist);
        //$('#cc_strinfo_next_album').html(playingNext.album);
        //$('#cc_strinfo_next_art').attr('src', playingNext.art);

        $('#cc_strinfo_listeners_raptureradio').html(data.listeners.current);

        /* 재생 기록 업데이트
        const historyContainer = $('#cc_strinfo_history');
        historyContainer.empty();
        songHistory.forEach(function(entry) {
            const song = entry.song;
            historyContainer.append(`
                <li>
                    <img src="${song.art}" alt="앨범 아트" style="width: 50px; height: 50px;">
                    <p>제목: ${song.title}</p>
                    <p>아티스트: ${song.artist}</p>
                </li>
            `);
        });
        */
    }

    function fetchStreamInfo() {
        $.getJSON(apiUrl, function(data) {
            updateStreamInfo(data);
        });
    }

    // 주기적으로 API 데이터 갱신
    setInterval(fetchStreamInfo, 1000);
    fetchStreamInfo(); // 페이지 로드 시 초기 데이터 가져오기
});
