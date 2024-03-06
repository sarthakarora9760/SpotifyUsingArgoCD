//Declaring variables..
let currentfolder = null;
let currentsong = new Audio();
let currentsongduration;
let songs = [];

//Adding sidebar effect on lesser width
document
  .querySelector(".navbar .arrows img:first-child")
  .addEventListener("click", () => {
    let leftside = document.querySelector(".left");
    let rightside = document.querySelector(".right");
    leftside.classList.add("leftham");
    rightside.classList.add("rightham");
    let logoimg = document.querySelector(".left .home .logo");
    let closeimg = logoimg.lastElementChild;
    closeimg.classList.add("unhide");
    closeimg.addEventListener("click", () => {
      leftside.classList.remove("leftham");
      rightside.classList.remove("rightham");
      closeimg.classList.remove("unhide");
    });
  });

//Utility function to convert seconds to minutes...
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

//Utililty Function to getduration of current song because most browser returns infinity when using audio.duration property...
var getDuration = function (url, next) {
  var _player = new Audio(url);
  _player.addEventListener(
    "durationchange",
    function (e) {
      if (this.duration != Infinity) {
        var duration = this.duration;
        _player.remove();
        next(duration);
      }
    },
    false
  );
  _player.load();
  _player.currentTime = 24 * 60 * 60; //fake big time
  _player.volume = 0;
  _player.play();
  //waiting...
};

//Loading playlists as a card into the card container..
async function load_playlists() {
  let albums = await fetch(`/songs/`);
  let playlist_response = await albums.text();
  let div = document.createElement("div");
  div.innerHTML = playlist_response;
  let anchorsarray = Array.from(div.getElementsByTagName("a"));
  //Taking each folder out and fetching their cover image,title and description...
  for (item of anchorsarray) {
    let cardcont = document.getElementsByClassName("cardcontainer")[0];
    if (item.href.includes("songs") && !item.href.includes(".htaccess")) {
      let folder = item.href.split("/").slice(4, 5)[0];
      let response = await fetch(`/songs/${folder}/info.json`);
      let responsejson = await response.json();
      cardcont.innerHTML =
        cardcont.innerHTML +
        `<div data-folder="${folder}" class="card">
        <img src="/songs/${folder}/cover.jpg" alt="song1" />
        <h3>${responsejson.title}</h3>
        <p>${responsejson.description}</p>
        <img hidden class="play" src="assets/play.png" alt="" />
        </div>`;
    }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("Fetching Songs");
      await load_songs(item.currentTarget.dataset.folder);
    });
  });

  //Adding event listener to play button in the card
  Array.from(document.getElementsByClassName("play")).forEach((e)=>{
    e.addEventListener("click",async (item)=>{
      console.log("playing song");
      await load_songs(item.currentTarget.dataset.folder,true);
    })
  });
}

//Adding hover effect to cards in playlists..
function addhovereffect() {
  let cards = Array.from(document.getElementsByClassName("card"));
  for (let card of cards) {
    card.addEventListener("mouseover", () => {
      let playbtn = card.lastElementChild;
      playbtn.style.bottom = "40%";
      playbtn.removeAttribute("Hidden");
    });
  }
  for (let card of cards) {
    card.addEventListener("mouseleave", () => {
      let playbtn = card.lastElementChild;
      playbtn.style.bottom = "-300px";
      playbtn.setAttribute("Hidden", "true");
    });
  }
}

//Getting songs from a current folder..
async function getsongs(folder) {
  let songresponse = await fetch(`/songs/${folder}`);
  let songtext = await songresponse.text();
  let songsdiv = document.createElement("div");
  songsdiv.innerHTML = songtext;
  songs = [];
  let anchorsarray = Array.from(songsdiv.getElementsByTagName("a"));
  for (let item of anchorsarray) {
    if (item.href.includes(".mp3")) {
      songs.push(item.href.split("/")[5].replaceAll("%20", " "));
    }
  }
  return songs;
}

//Playing music functionality
async function playsong(songpath, pause = false) {
  getDuration(currentsong.src, function (duration) {
    currentsongduration = duration;
  });
  currentsong.src = songpath;
  currentsong.preload = "auto";
  if (!pause) {
    currentsong.play();
    play.src = "assets/pause.svg";
  }
  document.getElementsByClassName("duration")[0].innerHTML = "00:00 / 00:00";
  document.querySelector(".songinfo").innerHTML = songpath.split("/")[3];
}

//Adding event listener to playlist cards..
async function load_songs(folder,playfirst=false) {
  currentfolder = folder;
  let songcont = document.getElementsByClassName("songcontainer")[0];
  songs = await getsongs(folder);
  if (songs.length == 0) {
    songcont.innerHTML = "Oops no songs are available in this album currently!";
  } else {
    songcont.innerHTML = "";
    for (let song of songs) {
      songcont.innerHTML =
        songcont.innerHTML +
        `<div data-musicname="${song}" class="song">
          <div class="songdetails">
        <img width="40px" height="40px" src="/songs/${currentfolder}/cover.jpg" alt="">
        <div class="songname">${song}</div>
        </div>
        <div class="playdetails">
        <p>Play Now</p>
        <img src="assets/play.svg" alt="">
        </div>
      </div>`;
    }

    if(playfirst){
      let songname=document.getElementsByClassName("song")[0].dataset.musicname;
      playsong(`/songs/${currentfolder}/${songname}`);
    }


    //Adding event listener to play buttons in the song cards on the left side..
    let songcardsarray = Array.from(document.getElementsByClassName("song"));
    for (let songcard of songcardsarray) {
      songcard.addEventListener("click", (e) => {
        let songname = e.currentTarget.dataset.musicname;
        console.log(songname);
        playsong(`/songs/${currentfolder}/${songname}`);
      });
    }
  }
}

//Addding width observer for observing width of right section of our page to make sure certain styles apply only after correct right section width..
let rightobserver = new ResizeObserver((entries) => {
  entries.forEach((e) => {
    if (e.target.getBoundingClientRect().width < 620) {
      document.querySelector(".durationandvolume").classList.add("flexcol");
    }
    if (e.target.getBoundingClientRect().width > 620) {
      document.querySelector(".durationandvolume").classList.remove("flexcol");
    }
  });
});

//Main function
async function main() {
  await load_playlists();
  addhovereffect();
  await load_songs("karan_aujla");
  playsong(`/songs/karan_aujla/${songs[0]}`, true);
  //Adding event listeners to play,previous and next buttons..
  play.addEventListener("click", () => {
    getDuration(currentsong.src, function (duration) {
      currentsongduration = duration;
    });
    if (currentsong.paused) {
      play.src = "assets/pause.svg";
      currentsong.play();
    } else {
      play.src = "assets/play.svg";
      currentsong.pause();
    }
  });

  //Adding event listener to next button in playbar..
  next.addEventListener("click", () => {
    let currentsongname = currentsong.src.split("/")[5].replaceAll("%20", " ");
    let index = songs.indexOf(currentsongname);
    if (index + 1 >= songs.length) {
      playsong(`/songs/${currentfolder}/${songs[0]}`);
    } else {
      playsong(`/songs/${currentfolder}/${songs[index + 1]}`);
    }
  });

  //Adding event listener to previous button in playbar..
  previous.addEventListener("click", () => {
    let currentsongname = currentsong.src.split("/")[5].replaceAll("%20", " ");
    let index = songs.indexOf(currentsongname);
    if (index - 1 < 0) {
      playsong(`/songs/${currentfolder}/${songs[0]}`);
    } else {
      playsong(`/songs/${currentfolder}/${songs[index - 1]}`);
    }
  });

  // Listen for timeupdate event
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )} / ${secondsToMinutesSeconds(currentsongduration)}`;
    let percent = (currentsong.currentTime / currentsongduration) * 100;
    document.querySelector(".seekbar .circle").style.left = percent + "%";
  });

  // Adding seekness to our seekbar..
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekbar .circle").style.left = percent + "%";
    currentsong.currentTime = (currentsongduration * percent) / 100;
  });

  //Adding event listener to volume range..
  document.querySelector(".volume input").addEventListener("change", () => {
    let currenttvolume = document.querySelector(".volume input").value;
    if (currenttvolume == 0) {
      document.querySelector(".volume img").src = "assets/mute.svg";
    } else {
      document.querySelector(".volume img").src = "assets/volume.svg";
    }
    currentsong.volume = currenttvolume / 100;
  });

  // Adding event listener to volume button..
  document.querySelector(".volume img").addEventListener("click", () => {
    if (currentsong.volume == 0) {
      document.querySelector(".volume input").value = 50;
      currentsong.volume = 0.5;
      document.querySelector(".volume img").src = "assets/volume.svg";
    } else {
      document.querySelector(".volume input").value = 0;
      currentsong.volume = 0;
      document.querySelector(".volume img").src = "assets/mute.svg";
    }
  });

  let rightside = document.querySelector(".right");
  rightobserver.observe(rightside);
}
main();
