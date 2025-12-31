const artistEndpoint = "http://127.0.0.1:8000/music/api/artists";
const songsEndpoint = "http://127.0.0.1:8000/music/api/songs";
const albumEndpoint = "http://127.0.0.1:8000/music/api/albums";

const artistContaier = document.getElementById("artist-container");
const moreByArtist = document.getElementById("more-by-artist");

// Get all the songs availiable
const fecthSongInfo = async () => {
  try {
    const response = await fetch(songsEndpoint);
    if (!response.ok) {
      throw new Error("Error fetching song data");
    }
    const songs = await response.json();
    return songs;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

// Get all artists and their infomation
const fecthArtistInfo = async () => {
  try {
    const response = await fetch(artistEndpoint);
    if (!response.ok) {
      throw new Error("Error fetching song data");
    }
    const artists = await response.json();
    return artists;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

// Get all albums availiable
const fecthArtistAlbums = async () => {
  try {
    const response = await fetch(albumEndpoint);
    if (!response.ok) {
      throw new Error("Error fetching song data");
    }
    const albums = await response.json();
    return albums;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

// Populate the UI with Artist profile
const displayArtistProfile = async () => {
  const artistname = artistContaier.getAttribute("data-artist-name");
  const songs = await fecthSongInfo();
  const artists = await fecthArtistInfo();

  const macthedSong = songs.find((song) => artistname === song.artist);
  const matchedArtist = artists.find(
    (artist) => artist.name === macthedSong.artist
  );
  console.log(matchedArtist);

  if (matchedArtist && macthedSong) {
    const artistProfile = document.createElement("button");
    artistProfile.className =
      "flex w-full gap-3 items-center px-3 mx-6 py-2 hover:bg-gray-700 rounded-lg duration-300";
    artistProfile.innerHTML = `
        <div class="">
            <img src="${matchedArtist.profile_pic}" class="h-[6rem] w-[6rem] rounded-full">
        </div>
        <div>
            <p>Artist</p>
            <a href="/music/artists/${matchedArtist.id}" class="font-bold hover:underline"> 
            ${matchedArtist.name} 
            </a>
        </div>    
        `;
    artistProfile.addEventListener("click", () => {
      window.location.href = `/music/artists/${matchedArtist.id}`;
    });
    artistContaier.appendChild(artistProfile);
  }
};

// Populate the UI with songs by artist
const displayMoreSongsByArtist = async () => {
  const songsContainer = document.getElementById("songs-container");

  const artistname = moreByArtist.getAttribute("data-artist-name");
  const allsongs = await fecthSongInfo();
  const allAblums = await fecthArtistAlbums();

  const artistAllSongs = allsongs.filter((song) => song.artist === artistname);
  const artistAllAlbums = allAblums.filter(
    (album) => album.artist === artistname
  );


  artistAllSongs.forEach((song) => {
    const songCard = document.createElement("div");
    songCard.className =
      "flex-none w-48 p-2 hover:bg-gray-700 text-left rounded-md shadow-md duration-300";
    songCard.innerHTML = `
                    <img src="${
                      song.thumbnail
                    }" class="w-full h-32 object-cover rounded-md mb-2">
                    <h3 class="text-sm font-bold" >${song.title.toUpperCase()} </h3>
                    <a href="#" class="text-sm text-gray-500 hover:underline artist-name">${
                      song.artist
                    } </a>
                `;
    songCard.addEventListener("click", () => {
      window.location.href = `/music/songs/${song.id}`;
    });

    const artistLink = songCard.querySelector(".artist-name").addEventListener("click", async (e) => {
        e.preventDefault();
        const artists = await fecthArtistInfo();
        const artistId = artists.find(artist => artist.name === song.artist).id;
        window.location.href = `/music/artists/${artistId}`;
    })

    songsContainer.appendChild(songCard);
  });
};

// Populate the UI albums by artist
const displayMoreAlbumsByArtist = async () => {
  const albulmsContainer = document.getElementById("albums-container");

  const artistname = moreByArtist.getAttribute("data-artist-name");
  const allsongs = await fecthSongInfo();
  const allAblums = await fecthArtistAlbums();

  const artistAllSongs = allsongs.filter((song) => song.artist === artistname);
  const artistAllAlbums = allAblums.filter(
    (album) => album.artist === artistname
  );

  // const artistCatalog = [...artistAllSongs, ...artistAllAlbums].sort(() => Math.random() - 0.5).slice(0, 10)

  artistAllAlbums.forEach((album) => {
    const albumCard = document.createElement("div");
    albumCard.className =
      "flex-none w-48 p-2 hover:bg-gray-700 text-left rounded-md shadow-md duration-300";
    albumCard.innerHTML = `
                    <img src="${
                      album.cover_thumbnail
                    }" class="w-full h-32 object-cover rounded-md mb-2">
                    <h3 class="text-sm font-bold" >${album.title.toUpperCase()} </h3>
                    <a href="#" class="text-sm text-gray-500 hover:underline artist-name">${
                      album.artist
                    } </a>
                `;
    albumCard.addEventListener("click", () => {
      window.location.href = `/music/albums/${album.id}`;
    });

    const artistLink = albumCard.querySelector(".artist-name").addEventListener("click", async (e) => {
        e.preventDefault();
        const artists = await fecthArtistInfo();
        const artistId = artists.find(artist => artist.name === album.artist).id;
        window.location.href = `/music/artists/${artistId}`;
    })

    albulmsContainer.appendChild(albumCard);
  });
};

async function directUserToArtistPage(){
    const link = document.querySelector(".artist-name");
    const artistName = document.querySelector(".artist-name").textContent;
    
    const allArtists = await fecthArtistInfo();
    const artist = allArtists.find(artist => artist.name === artistName.trim());
    
    if (artist) {
        link.href = `/music/artists/${artist.id}`;
    } else {
        console.error("Artist not found");
    }

}

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


  displayArtistProfile();
  displayMoreSongsByArtist();
  displayMoreAlbumsByArtist();
  directUserToArtistPage();
});
