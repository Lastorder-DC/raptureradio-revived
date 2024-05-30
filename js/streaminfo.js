const apiUrl = "https://station.raptureradio.cc/api/nowplaying/radio";

document.addEventListener("DOMContentLoaded", () => {
    window.currentSong = "";

    const songElement = document.getElementById('cc_strinfo_song_raptureradio');
    const listenersElement = document.getElementById('cc_strinfo_listeners_raptureradio');

    async function updateStreamInfo(data) {
        if (!data) return;

        const { text: nowPlayingTitle } = data.now_playing.song;
        const { current: currentListenersCount } = data.listeners;

        if (window.currentSong !== nowPlayingTitle) {
            window.currentSong = nowPlayingTitle;
            if (songElement) {
                songElement.innerHTML = nowPlayingTitle;
            }
        }
        if (listenersElement) {
            listenersElement.innerHTML = currentListenersCount;
        }
    }

    async function fetchStreamInfo() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            updateStreamInfo(data);
        } catch (error) {
            console.error('Error fetching stream info:', error);
        }
    }

    setInterval(fetchStreamInfo, 1500);
    fetchStreamInfo();
});
