const  albumList = "http://127.0.0.1:8000/music/api/albums"; 
const  songList = "http://127.0.0.1:8000/music/api/songs"; 
const  artistList = "http://127.0.0.1:8000/music/api/artists"; 

document.addEventListener("DOMContentLoaded", () => {
    const scrollGroups = document.querySelectorAll(".scroll-group");

    scrollGroups.forEach(group => {
        const container = group.querySelector(".scroll-container");
        const leftBtn = group.querySelector(".scroll-left");
        const rightBtn = group.querySelector(".scroll-right");

        function scrollContainer(direction) {
            const cardWidth = container.querySelector("div").offsetWidth + 5;
            container.scrollLeft += direction * cardWidth * 3;
        }

        function updateButtonVisibility() {
            const hasOverflow = container.scrollWidth > container.clientWidth;
            if (!hasOverflow) {
                leftBtn.classList.add("hidden-opacity");
                rightBtn.classList.add("hidden-opacity");
                return;
            }

            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            const canScrollLeft = container.scrollLeft > 0;
            const canScrollRight = container.scrollLeft < maxScrollLeft;

            leftBtn.classList.toggle("hidden-opacity", !canScrollLeft);
            rightBtn.classList.toggle("hidden-opacity", !canScrollRight);
        }

        function attachScrollListeners() {
            updateButtonVisibility();
            container.addEventListener("scroll", updateButtonVisibility);

            group.addEventListener("mouseenter", updateButtonVisibility);
            group.addEventListener("mouseleave", () => {
                leftBtn.classList.add("hidden-opacity");
                rightBtn.classList.add("hidden-opacity");
            });

        leftBtn.addEventListener("click", () => scrollContainer(-1));
        rightBtn.addEventListener("click", () => scrollContainer(1));
        }

    attachScrollListeners();
  });

    displayAlbumSongs();
    displayDiscography();
    directUserToArtistPage();
});

async function fetchAlbums() {
    try {
        const response = await fetch(albumList);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const albums = await response.json(); 
        return albums;
    }
    catch (error) {
        console.error("Error fetching albums:", error);
    }
};

async function fetchSongs() {
    try {
        const response = await fetch(songList);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const songs = await response.json(); 
        return songs;
    }
    catch (error) {
        console.error("Error fetching albums:", error);
    }
};
async function fetchArtists() {
    try {
        const response = await fetch(artistList);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const artist = await response.json(); 
        return artist;
    }
    catch (error) {
        console.error("Error fetching albums:", error);
    }
};

async function displayAlbumSongs(){
    const albumsSongsContainer = document.querySelector(".album-songs");
    const albumTitle = albumsSongsContainer.getAttribute("data-album-title");
    const albums = await fetchAlbums();
    const songs = await fetchSongs();
    const albumSongs = songs.filter(song => song.album === albumTitle);

    // Clear existing content
    albumsSongsContainer.innerHTML = ""; 

    // Create album cards
    if (albumSongs.length === 0) {
        albumsSongsContainer.innerHTML = `<p class="text-gray-500">No songs available for this album</p>`;
        return;
    }
    
    albumSongs.forEach((song, id) => {
        const songElement = document.createElement("div");
        songElement.className = "flex items-center gap-4 px-4 py-[5px]  hover:bg-gray-700 rounded-md cursor-pointer transition duration-200";
        songElement.innerHTML = `
            <p class="w-6 text-center text-sm font-medium">${id + 1}</p>
            <img src="${song.thumbnail}" alt="${song.title} cover" class="w-10 h-10 rounded-lg object-cover"> 
            <p class="font-semibold text-sm flex-1 truncate">${song.title}</p>
            <i class='bx bx-plus-circle p-4 cursor-pointer hover:scale-105 duration-300 text-md'></i>
            <p class="text-left text-xs w-12">${song.duration}</p>
            <i class='bx bx-dots-horizontal-rounded py-4 cursor-pointer hover:scale-105 duration-300 text-md'></i>

            `;
        albumsSongsContainer.appendChild(songElement);
    });

}

async function displayDiscography() {
    const discographyContainer = document.getElementById("artist-discography");
    
    const artistName = discographyContainer.getAttribute("data-artist-name");
    const allAlbums = await fetchAlbums();
    const allsongs = await fetchSongs();

    const artistAlbums = allAlbums
        .filter(album => album.artist === artistName)
        .map(album => ({...album, type: 'album'}));
    const artistSongs = allsongs    
        .filter(song => song.artist === artistName)
        .map(song => ({...song, type: 'song'}));
    
    console.log(artistAlbums, artistSongs);

    // Combine albums and songs into a single array
    const artistCatalog = [...artistAlbums, ...artistSongs].sort(() => Math.random() - 0.5).slice(0, 10);

    console.log(artistCatalog);
    // Clear existing content
    discographyContainer.innerHTML = ""; 

    // Create album cards
    if (artistCatalog.length === 0) {
        discographyContainer.innerHTML = `<p class="text-gray-500">No songs or albums available for this artist</p>`;
        return;
    }

    artistCatalog.forEach((item) => {
    const songCard = document.createElement("div");
    songCard.className =
      "flex-none w-48 p-2 hover:bg-gray-700 text-left rounded-md shadow-md cursor-pointer duration-300";
    songCard.innerHTML = `
                    <img src="${
                      item.thumbnail ? item.thumbnail : item.cover_thumbnail
                    }" class="w-full h-32 object-cover rounded-md mb-2">
                    <h3 class="text-sm font-bold" >${item.title.toUpperCase()} </h3>
                    <p class="text-xs text-gray-500 mt-2">${item.type === 'album' ? 'Album' : 'Song'}</p>
                    <a href="" class="text-sm text-gray-500 hover:underline artist-name">${
                      item.artist
                    } </a>
                    
                `;
    // Add click event to redirect to the appropriate page
    songCard.addEventListener("click", () => {
        if (item.type === "song") {
            window.location.href = `/music/songs/${item.id}`;
        } else if (item.type === "album") {
            window.location.href = `/music/albums/${item.id}`;
        } else {
            console.error("Unknown item type:", item);
        }
    });
    const artistLink = songCard.querySelector(".artist-name");
    artistLink.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default link behavior
        const allArtists = await fetchArtists();
        const artist = allArtists.find(artist => artist.name === item.artist.trim());
        if (!artist) {
            console.error("Artist not found");
            return;
        }
        window.location.href = `/music/artists/${artist.id}`;
    });
    
    discographyContainer.appendChild(songCard);
  });
}

async function directUserToArtistPage(){
    const link = document.querySelector(".artist-name");
    const artistName = document.querySelector(".artist-name").textContent;
    
    const allArtists = await fetchArtists();
    const artist = allArtists.find(artist => artist.name === artistName.trim());
    
    if (artist) {
        link.href = `/music/artists/${artist.id}`;
    } else {
        console.error("Artist not found");
    }

}