const apiEndpoint = "http://127.0.0.1:8000/music/api";

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

displayPopularSongs();
displayDiscography()
})

async function fetchAllSongs() {

    try {
        const response = await fetch(`${apiEndpoint}/songs`);
        if (!response.ok) {
            throw new Error("Error fetching song data");
        }
        const allSongs = await response.json();
        return allSongs
       
    } catch (err) {
        console.error(`Error: ${err}`);
        return [];
    }
};

async function fetchAllAbums() {
    try {
        const response = await fetch(`${apiEndpoint}/albums`);
        if (!response.ok) {
            throw new Error("Error fetching album data");
        }
        const allBums = await response.json();
        return allBums;
    }
    catch (err) {
        console.error(`Error: ${err}`);
        return [];
    }
}
async function fetchAllArtists() {
    try {
        const response = await fetch(`${apiEndpoint}/artists`);
        if (!response.ok) {
            throw new Error("Error fetching album data");
        }
        const artist = await response.json();
        return artist;
    }
    catch (err) {
        console.error(`Error: ${err}`);
        return [];
    }
}

async function displayPopularSongs(){
    const popularSongsContainer = document.getElementById("popular-songs");
    const artistName = popularSongsContainer.getAttribute("data-artist-name");
    
    const allsongs = await fetchAllSongs();
    const artistsAllsongs = allsongs.filter(song => song.artist === artistName); 
    
    const aritstPopularSongs = artistsAllsongs.sort(() => Math.random() - 0.5).slice(0, 5);

    // clear existing content
    popularSongsContainer.innerHTML = "";

    // create popular songs cards
    if (aritstPopularSongs.length === 0 ){
        popularSongsContainer.innerHTML = 
        `<p class="text-gray-500 text-center">Sorry, No songs available for this artist.</p>`
        return;
    } 

    
    aritstPopularSongs.forEach((song, id) => {
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
        popularSongsContainer.appendChild(songElement);
    });

};

async function displayDiscography() {
    const discographyContainer = document.getElementById("artist-discography");
    
    const artistName = discographyContainer.getAttribute("data-artist-name");
    
    discographyContainer.style.display = "none"; // Hide the container initially

    // Fetch all albums and songs
    const allAlbums = await fetchAllAbums();
    const allsongs = await fetchAllSongs();


    const artistAlbums = allAlbums
        .filter(album => album.artist === artistName)
        .map(album => ({
            ...album,
            type: 'album'
        }));
    const artistSongs = allsongs
        .filter(song => song.artist === artistName)
        .map(song => ({
            ...song,
            type: 'song'
        }));

    const artistCatalog = [...artistAlbums, ...artistSongs]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    // Clear existing content
    discographyContainer.innerHTML = "";

    // Create song and album cards
    if (artistCatalog.length === 0) {
        document.querySelector(".discography-wrapper").innerHTML = '';
        return;
    }

    discographyContainer.style.display = "flex"; // Show the container after fetching data

    artistCatalog.forEach((item) => {
    const songCard = document.createElement("div");
    songCard.className =
      "flex-none w-48 p-2 hover:bg-gray-700 text-left rounded-md shadow-md duration-300 cursor-pointer";
    songCard.innerHTML = `
                    <img src="${
                      item.thumbnail ? item.thumbnail : item.cover_thumbnail
                    }" class="w-full h-32 object-cover rounded-md mb-2">
                    <h3 class="text-sm font-bold" >${item.title.toUpperCase()} </h3>
                    <p class="text-xs text-gray-500 mt-2">${item.type === 'album' ? 'Album' : 'Song'}</p>
                    <a href="#" class="text-sm text-gray-500 hover:underline artist-name">${
                      item.artist
                    } </a>
                `;

    // Add click event to redirect to song or album page
    songCard.addEventListener("click", () => {
      item.type === 'song' 
        ? window.location.href = `/music/songs/${item.id}` 
        : window.location.href = `/music/albums/${item.id}`;
    });
    const artistLink = songCard.querySelector(".artist-name").addEventListener("click", async (e) => {
        e.preventDefault();
        const artists = await fetchAllArtists();
        const artistId = artists.find(artist => artist.name === item.artist).id;
        window.location.href = `/music/artists/${artistId}`;
    })
    discographyContainer.appendChild(songCard);
  });
}

