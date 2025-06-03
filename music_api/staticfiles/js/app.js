const apiUrl = 'http://localhost:8000/api/songs/';

async function fetchSongs() {
    const response = await fetch(apiUrl);
    const songs = await response.json();

    const listDiv = document.getElementById("song-list");
    songs.forEach(song => {
        const btn = document.createElement("button");
        btn.innerText =  `${song.title} - ${song.artist}`;
        btn.onclick = () => playSong(song.audio_file);
        listDiv.appendChild(btn);
        listDiv.appendChild(document.createElement("br"));
    });
}

const playSong = fileUrl => {
    const audio = document.getElementById("audio-player");
    audio.src = `http://localhost:8000${fileUrl}`;
    audio.play();
}

document.addEventListener("DOMContentLoaded", fetchSongs()
);

