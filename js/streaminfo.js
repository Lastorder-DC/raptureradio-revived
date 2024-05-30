const apiUrl = "https://station.raptureradio.cc/api/nowplaying/radio";

document.addEventListener("DOMContentLoaded", function() {
    window.currentSong = "";

    async function updateStreamInfo(data) {
        if (!data) return;

        const nowPlayingTitle = data.now_playing.song.text;
        const currentListenersCount = data.listeners.current;
        if(window.currentSong !== nowPlayingTitle) {
            window.currentSong = nowPlayingTitle;
            document.getElementById('cc_strinfo_song_raptureradio').innerHTML = nowPlayingTitle;
        }
        document.getElementById('cc_strinfo_listeners_raptureradio').innerHTML = currentListenersCount;
    }

    async function fetchStreamInfo() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            updateStreamInfo(data);
        } catch (error) {
            console.error('Error fetching stream info:', error);
        }
    }

    setInterval(fetchStreamInfo, 1500);
    fetchStreamInfo();
});