const apiUrl = "http://127.0.0.1:8000/music/api";

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

  fetchInfo();
  toggleSearchBar();
});


async function fetchInfo() {
  try {
    const songsList = await fetch(`${apiUrl}/songs/`);
    const artistList = await fetch(`${apiUrl}/artists/`);
    const albumList = await fetch(`${apiUrl}/albums/`);
    if (!songsList.ok && !artistList.ok && !albumList) {
      throw new Error(
        `HTTP error! status: ${
          songsList.status || artistList.status || albumList.status
        }`
      );
    }
    const songs = await songsList.json();
    const albums = await albumList.json();
    const artists = await artistList.json();

    // Display 10 random songs in the UI
    displayTrendingSongs(songs);

    // Display current artists in the UI
    displayTrendingArtists(artists);

    // Display current albums in the UI
    displayTrendingAlbums(albums);
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

function displayTrendingSongs(songs) {
  const TrendingSongs = document.getElementById("curr-songs");
  const randomSongs = songs.sort(() => Math.random() - 0.5).slice(0, 10);

  // Clear existing content
  TrendingSongs.innerHTML = "";

  // Create song cards
  if (randomSongs.length === 0) {
    TrendingSongs.innerHTML = `<p class="text-gray-500">No songs available</p>`;
    return;
  }
  randomSongs.forEach((song) => {
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
    songCard.querySelector(".artist-name").addEventListener("click", async (e) => {
      e.preventDefault();
      const artistsResponse = await fetch(`${apiUrl}/artists/`);
      if (!artistsResponse.ok) {
        console.error("Error fetching artist:", artistsResponse.statusText);
        return;
      }
      const artists = await artistsResponse.json();

      // Find the artist object based on the song's artist name
      const artist = artists.find((a) => a.name === song.artist);
      console.log(artist);
      window.location.href = `/music/artists/${artist.id}`;
    });


    TrendingSongs.appendChild(songCard);
  });
}

function displayTrendingArtists(artists) {
  const TrendingArtists = document.getElementById("curr-artists");
  const randomArtists =  artists.sort(() => Math.random() - 0.5).slice(0, 10);

  // Clear existing content
  TrendingArtists.innerHTML = "";

  // Create artist cards
  if (randomArtists.length === 0) {
    TrendingArtists.innerHTML = `<p class="text-gray-500">No artists available</p>`;
    return;
  }
  randomArtists.forEach((artist) => {
    const artistCard = document.createElement("div");
    artistCard.className =
      "flex flex-col w-[200px] rounded-md shadow-2xl items-center gap-2 mr-4 bg-gray-800 hover:bg-gray-700 p-2 duration-300";
    artistCard.innerHTML = `
              <div class="w-[150px] h-[150px] flex justify-center items-center rounded-full overflow-hidden bg-gray-700">
                <img src="${artist.profile_pic}" class="w-full h-full object-cover">
              </div>
              <a href="/artists/${artist.id}" class="text-center text-sm font-medium"><h3 >${artist.name}</h3></a>
              <p class="text-gray-500 text-sm">Artist</p>
                `;
    artistCard.addEventListener("click", () => {
      window.location.href = `/music/artists/${artist.id}`;
    });
    TrendingArtists.appendChild(artistCard);
  });
}

function displayTrendingAlbums(albums) {
  const TrendingAlbums = document.getElementById("curr-albums");
  const randomAlbums = albums.sort(() => Math.random() - 0.5).slice(0, 10);
  
  // Clear existing content
  TrendingAlbums.innerHTML = ""; 

  // Create album cards
  if (randomAlbums.length === 0) {
    TrendingAlbums.innerHTML = `<p class="text-gray-500">No albums available</p>`;
    return;
  }
  randomAlbums.forEach((album) => {
    const albumCard = document.createElement("div");
    albumCard.className =
      "flex-none w-48 p-2 hover:bg-gray-700 text-left rounded-md shadow-md duration-300";
    albumCard.innerHTML = `
              <img src="${
                  album.cover_thumbnail
              }" class="w-full h-32 object-cover rounded-md mb-2">
              <a href="#" class="font-semibold"><h3>${album.title.toUpperCase()}</h3></a>
              <a href="#" class="text-sm text-gray-500 hover:underline artist-name">${
                  album.artist
              }</a>
                `;
    albumCard.addEventListener("click", () => {
      window.location.href = `/music/albums/${album.id}`;
    });

    albumCard.querySelector(".artist-name").addEventListener("click", async (e) => {
      e.preventDefault();
      const artistsResponse = await fetch(`${apiUrl}/artists/`);
      if (!artistsResponse.ok) {
        console.error("Error fetching artist:", artistsResponse.statusText);
        return;
      }
      const artists = await artistsResponse.json();

      // Find the artist object based on the album's artist name
      const artist = artists.find((a) => a.name === album.artist);
      console.log(artist);
      window.location.href = `/music/artists/${artist.id}`;
    });

    // Append the album card to the container
    TrendingAlbums.appendChild(albumCard);
  });
}

// Toggle the visibility of the search bar
function toggleSearchBar() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const toggleButton = document.getElementById("toggle-search");

  toggleButton.addEventListener("click", () => {
    if(window.innerWidth < 768) {
      searchInput.classList.toggle("hidden");
      
    }
    searchInput.focus();
  });
}
