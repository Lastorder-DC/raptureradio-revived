$(document).ready(function() {
    const apiUrl = "https://station.raptureradio.cc/api/nowplaying/radio";

    function updateStreamInfo(data) {
        if (!data) return;

        const nowPlayingTitle = data.now_playing.song.text;
        const currentListenersCount = data.listeners.current;
        $('#cc_strinfo_song_raptureradio').html(nowPlayingTitle);
        $('#cc_strinfo_listeners_raptureradio').html(currentListenersCount);
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
