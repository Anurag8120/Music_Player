//creating global variables
let c;
let currentSong = new Audio();
let a = document.querySelector(".SearchIcon");
let currFolder;
let Songs;


// convert seconds into minutes in format of 00:00
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Calculate the minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format the minutes and seconds to ensure they are two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  // Combine the formatted minutes and seconds
  return `${formattedMinutes}:${formattedSeconds}`;
}

//Crating function getSongs to fetch the songs from the folder
async function getSongs(folder) {
  currFolder = folder;
  let songsData = await fetch(`http://127.0.0.1:3000/${folder}`);
  let songsDatatxt = await songsData.text();
  // console.log(songsDatatxt);
  let div = document.createElement("div");
  div.innerHTML = songsDatatxt;
  let songsName = div.getElementsByTagName("a");
  // console.log(songsName);
  Songs = [];
  for (let index = 0; index < songsName.length; index++) {
    const element = songsName[index];
    if (element.href.endsWith(".opus")) {
      Songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUL = document
    .querySelector(".playlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of Songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<div class="songs">

    <div class="songs_info">

        <div class="songs_logo">
            <img src="/svg/songs_logo.svg" alt="">
        </div>
        <div class="intro">
            <div class="song_name">${decodeURI(song)}</div>
            <div class="artist">ADriGO</div>
        </div>
        <div class="play_pause">
            <div class="play_logo">
                <img id="playlogo" src="/svg/play_logo.svg" alt="">

            </div>
        </div>
    </div>
</div>`;
  }

  Array.from(
    document.querySelector(".songs_list").getElementsByClassName("song_name")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.innerHTML);
      playMusic(e.innerHTML);
    });
  });
  
  return Songs;
}

//creating playMusic function
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/${currFolder}/` + decodeURI(track);
  if (!pause) {
    currentSong.play();
    play_pause.src = "/svg/pause.svg";
  }
  document.querySelector(".ul_name").innerHTML =
    "Song Name : " + decodeURI(track);
  document.querySelector(".ltime").innerHTML = "00:00";
  document.querySelector(".rtime").innerHTML = "00:00";
};

//creating function for displaying albums as displayAllAlbum()
async function displayAllAlbums() {
  let card1 = document.querySelector(".lib_card");
  let b = await fetch("http://127.0.0.1:3000/songs/");
  let response = await b.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div);
  anchors = div.getElementsByTagName("a");
  // console.log(anchors);
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let b = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await b.json();
      // console.log(response);
      card1.innerHTML = card1.innerHTML +
        `<div  class="card1">
      <div class="card2">
          <img src="/svg/add.svg" alt="" class="card2_img1">
          <img src="/songs/${folder}/cover.jpg" alt="" class="card2_img2">
          <img src="/svg/play2.svg" data-folder="${folder}" alt="" class="card2_img3">
      </div>
      <div class="card3">
          <h3>${response.Title}</h3>
          <p>${response.Desription}</p>
      </div>
      </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card2_img3")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      Songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(Songs[0]);
    });
  });
}

//creating main1 function
async function main1() {
  await getSongs("songs/ncs");
  // console.log(c);
  playMusic(Songs[0], true);

  displayAllAlbums();

  //adding event listener to the play and pause button
  play_pause.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play_pause.src = "/svg/pause.svg";
    } else {
      currentSong.pause();
      play_pause.src = "/svg/play_pause.svg";
    }
  });

  //adding event listener to the time update
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".ltime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}`;
    document.querySelector(".rtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.duration
    )}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //adding event listener to the seeker
  document.querySelector(".seeker").addEventListener("click", (e) => {
    // console.log(e);
    // console.log(e.target , e.target.getBoundingClientRect() , e.target.getBoundingClientRect().width ,  e.offsetX , e.offsetY);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //adding event listener to the previous button
  prev.addEventListener("click", () => {
    // console.log("prev was clicked");
    let index = Songs.indexOf(
      currentSong.src.split(`/${currFolder}/`).slice(1)[0]
    );
    if (index - 1 >= 0) {
      playMusic(Songs[index - 1]);
    }
    // console.log(currentSong);
  });

  //adding event listener to nxt button
  next.addEventListener("click", () => {
    // console.log("next was clicked");
    let index = Songs.indexOf(
      currentSong.src.split(`/${currFolder}/`).slice(-1)[0]
    );
    if (index + 1 < Songs.length) {
      playMusic(Songs[index + 1]);
    }
    // currentSong.src.split("/songs/").slice(1)[0];
    // console.log(index,Songs.length);
  });

  //adding event listener to volume range
  document.querySelector(".volume_range").addEventListener("change", (e) => {
    // console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    document.querySelector(".volume_indicator1").innerHTML =
      `${e.target.value}` + " %";
    if (e.target.value == 0) {
      volume_logo.src = "/svg/no_volume.svg";
    } else if (e.target.value <= 50) {
      volume_logo.src = "/svg/low_volume.svg";
    } else {
      volume_logo.src = "/svg/high_volume.svg";
    }
  });

  //adding event listener to volume logo
  document.querySelector(".volume_logo>img").addEventListener("click" , e=>{
    // console.log(e.target.src);
    if(e.target.src.includes("volume_logo.svg")){
      e.target.src = e.target.src.replace("volume_logo.svg","no_volume.svg");
      currentSong.volume = 0;
      document.querySelector(".volume_range").value = 0;
      document.querySelector(".volume_indicator1").innerHTML =
      `${document.querySelector(".volume_range").value}` + " %";
    }
    else if(e.target.src.includes("low_volume.svg")){
      e.target.src = e.target.src.replace("low_volume.svg","no_volume.svg");
      currentSong.volume = 0;
      document.querySelector(".volume_range").value = 0;
      document.querySelector(".volume_indicator1").innerHTML =
      `${document.querySelector(".volume_range").value}` + " %";
    }
    else if(e.target.src.includes("high_volume.svg")){
      e.target.src = e.target.src.replace("high_volume.svg","no_volume.svg");
      currentSong.volume = 0;
      document.querySelector(".volume_range").value = 0;
      document.querySelector(".volume_indicator1").innerHTML =
      `${document.querySelector(".volume_range").value}` + " %";
    }
    else{
      e.target.src = e.target.src.replace("no_volume.svg","volume_logo.svg");
      currentSong.volume = 50/100;
      document.querySelector(".volume_range").value = 50;
      document.querySelector(".volume_indicator1").innerHTML =
      `${document.querySelector(".volume_range").value}` + " %";
    }
  })

  //adding event listener to the search button
  document.querySelector(".SearchIcon>img").addEventListener("click",e=>{
    // console.log(e.target);
    if(e.target.src.includes("SearchIcon.svg")){
      e.target.src = e.target.src.replace("SearchIcon.svg","cross.svg");
      document.querySelector(".play>img").style.opacity = "0";
      document.querySelector(".play>span").style.opacity = "0";
      document.querySelector(".search1").style.left = "2px";
    }
    else{
      e.target.src = e.target.src.replace("cross.svg","SearchIcon.svg");
      document.querySelector(".play>img").style.opacity = "unset";
      document.querySelector(".play>span").style.opacity = "unset";
      document.querySelector(".search1").style.left = "265px";
    }

  })

  document.querySelector(".SearchIcon1>img").addEventListener("click",e=>{
    // console.log(e.target);
    if(e.target.src.includes("SearchIcon1.svg")){
      e.target.src = e.target.src.replace("SearchIcon1.svg","cross.svg");
      document.querySelector(".search2").style.left = "2px";
    }
    else{
      e.target.src = e.target.src.replace("cross.svg","SearchIcon1.svg");
      document.querySelector(".search2").style.left = "265px";
    }

  })

  //adding event listener to the modes changer
  document.querySelector(".modes>img").addEventListener("click", e=>{
    if(e.target.src.includes("sun.svg")){
      e.target.src = e.target.src.replace("sun.svg","moon.svg");
      // document.querySelector(".body").style.backgroundColor="white";
      // document.querySelector(".body").style.color="black";
      // document.querySelector(".heading").style.backgroundColor="var(--c)";
      // document.querySelector(".playlist").style.background="var(--c)";
      // document.querySelector(".SearchIcon").style.backgroundColor="var(--c)";
      // document.querySelector(".footer").style.backgroundColor="var(--c)";
      // document.querySelector(".right_content").style.backgroundColor="var(--c)";
      // document.querySelector(".circle").style.backgroundColor="var(--c)";
      // document.querySelector(".songs").style.background="var(--e)";
    }
    else{
      e.target.src = e.target.src.replace("moon.svg","sun.svg");
      // document.querySelector(".body").style.backgroundColor="#0c0c0c";
      // document.querySelector(".body").style.color="white";
      // document.querySelector(".heading").style.backgroundColor="var(--b)";
      // document.querySelector(".playlist").style.backgroundColor="var(--b)";
      // document.querySelector(".SearchIcon").style.backgroundColor="var(--b)";
      // document.querySelector(".footer").style.backgroundColor="var(--b)";
      // document.querySelector(".right_content").style.backgroundColor="var(--b)";
      // document.querySelector(".circle").style.backgroundColor="var(--b)";
      // document.querySelector(".songs").style.background="var(--d)";
    }
  })
}
main1();