// Select all the elements in the HTML page
// and assign them to a variable
const now_playing = document.querySelector<HTMLDivElement>(".now-playing");
const track_art = document.querySelector<HTMLDivElement>(".track-art");
const track_name = document.querySelector<HTMLDivElement>(".track-name");
const track_artist = document.querySelector<HTMLDivElement>(".track-artist");

const playpause_btn = document.querySelector<HTMLButtonElement>(".playpause-track");
const next_btn = document.querySelector<HTMLButtonElement>(".next-track");
const prev_btn = document.querySelector<HTMLButtonElement>(".prev-track");

const seek_slider = document.querySelector<HTMLInputElement>(".seek_slider");
const volume_slider = document.querySelector<HTMLInputElement>(".volume_slider");
const curr_time = document.querySelector<HTMLSpanElement>(".current-time");
const total_duration = document.querySelector<HTMLSpanElement>(".total-duration");

// Specify globally used values
let track_index: number = 0;
let isPlaying: boolean = false;
let updateTimer: NodeJS.Timeout;


// Dependency Injection Used Here:
// Create an interface for the audio player
interface AudioPlayer {
  play(): void;
  pause(): void;
  next(): void;
  prev(): void;
}

// Create a concrete implementation of the AudioPlayer interface
class ConcreteAudioPlayer implements AudioPlayer {
  private audioElement: HTMLAudioElement;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
  }

  play(): void {
    this.audioElement.play();
    isPlaying = true;
    
    // Replace icon with the pause icon
    playpause_btn!.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
  }

  pause(): void {
    // Pause the loaded track
    this.audioElement.pause();
    isPlaying = false;
  
    // Replace icon with the play icon
    playpause_btn!.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
  }

  next(): void {
    if (track_index < track_list.length - 1)
      track_index += 1;
    else track_index = 0;

    loadTrack(track_index);
  }

  prev(): void {
    if (track_index > 0)
      track_index -= 1;
    else track_index = track_list.length - 1;

    loadTrack(track_index);
  }
}

// Function that uses the audio player
function playTrack() {
  audioPlayer.play();
}

function pauseTrack() {
  audioPlayer.pause();
}

function playpauseTrack() {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function nextTrack(): any {
  audioPlayer.next();
  playTrack();
}

function prevTrack() {
  audioPlayer.prev();
  playTrack();
}

function loadTrack(track_index: number) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();

  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  // Update details of the track
  track_art!.style.backgroundImage =
    "url(" + track_list[track_index].image + ")";
  track_name!.textContent = track_list[track_index].name;
  track_artist!.textContent = track_list[track_index].artist;
  now_playing!.textContent =
    "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);

  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);
}


// Factory Method Used Here:
interface Track {
  name: string;
  artist: string;
  image: string;
  path: string;
}

class TrackFactory {
  static createTrack(name: string, artist: string, image: string, path: string): Track {
    return { name, artist, image, path };
  }

  static createTrackByFileType(
    name: string,
    artist: string,
    image: string,
    path: string
  ): Track {
    const fileExtension = path.split('.').pop();

    if (fileExtension === 'mp3') {
      return TrackFactory.createMP3Track(name, artist, image, path);
    } else if (fileExtension === 'wav') {
      return TrackFactory.createWAVTrack(name, artist, image, path);
    } else {
      return TrackFactory.createTrack(name, artist, image, path);
    }
  }

  private static createMP3Track(name: string, artist: string, image: string, path: string): Track {
    return TrackFactory.createTrack(name, artist, image, path);
  }

  private static createWAVTrack(name: string, artist: string, image: string, path: string): Track {
    return TrackFactory.createTrack(name, artist, image, path);
  }
}


const track_list: Track[] = [];

const track1 = TrackFactory.createTrackByFileType(
  "Dream speedrun",
  "Dream",
  "/images/images.jpg",
  "/musics/dream-speedrun-minecraf-By-tuna.voicemod.net.mp3"
);

const track2 = TrackFactory.createTrackByFileType(
  "Let me do it 4 u",
  "weird dog",
  "/images/artworks-bY3urlG4g0nzwquw-4rMuzw-t500x500.jpg",
  "/musics/let-me-do-it-for-you-By-tuna.voicemod.net.mp3"
);

const track3 = TrackFactory.createTrackByFileType(
  "Better Call Saul",
  "Saul Goodman",
  "images/communityIcon_2g6eqpguule91.png",
  "/musics/3d-saul-goodman-extended-to-full-song-1080p-fu-made-with-Voicemod-technology.mp3"
);

const track4 = TrackFactory.createTrackByFileType(
  "THE BOYS",
  "Imagine Lizards",
  "images/steamuserimages-a.akamaihd.jpg",
  "musics/the-boys-meme-By-tuna.voicemod.net.mp3"
);

const track5 = TrackFactory.createTrackByFileType(
  "bing chilling",
  "John Cena",
  "images/bingchilling.jpg",
  "musics/bing-chilling-made-with-Voicemod-technology.wav"
);

track_list.push(track1);
track_list.push(track2);
track_list.push(track3);
track_list.push(track4);
track_list.push(track5); //wav file


// Function to create a playlist item element
function createPlaylistItem(track: any, track_index: number) {
  const playlistItem = document.createElement("div");
  playlistItem.classList.add("playlist-item");
  
  // You can customize the HTML structure for each playlist item here
  playlistItem.innerHTML = `
      <div class="track-name">${track.name}</div>
      <div class="track-artist">${track.artist}</div>
  `;
  
  // Add an event listener to play the track when clicked
  playlistItem.addEventListener("click", () => {
    loadTrack(track_index);
    playTrack();
  });
  
  return playlistItem;
}

// Function to reset all values to their default
function resetValues() {
  curr_time!.textContent = "00:00";
  total_duration!.textContent = "00:00";
  seek_slider!.value = "0";
}

function seekTo() {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  const seekto = curr_track.duration * (parseFloat(seek_slider!.value) / 100);

  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}

function setVolume() {
  // Set the volume according to the
  // percentage of the volume slider set
  curr_track.volume = parseFloat(volume_slider!.value) / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider!.value = seekPosition.toString();

    // Calculate the time left and the total duration
    let currentMinutes: number | string = Math.floor(curr_track.currentTime / 60);
    let currentSeconds: number | string = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes: number | string = Math.floor(curr_track.duration / 60);
    let durationSeconds: number | string = Math.floor(curr_track.duration - durationMinutes * 60);

    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    // Display the updated duration
    curr_time!.textContent = currentMinutes + ":" + currentSeconds;
    total_duration!.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// // Create an empty playlist array
// const userPlaylist: Track[] = [];

// // Function to add selected songs to the user's playlist
// function addSelectedSongsToPlaylist() {
//   const songCheckboxes = document.querySelectorAll(".song-checkbox:checked");

//   songCheckboxes.forEach((checkbox) => {
//     const name = checkbox.getAttribute("data-name");
//     const artist = checkbox.getAttribute("data-artist");
//     const image = checkbox.getAttribute("data-image");
//     const path = checkbox.getAttribute("data-path");

//     const track = TrackFactory.createTrack(name, artist, image, path);
//     userPlaylist.push(track);
//   });

//   // Display the user's playlist on the right side
//   displayUserPlaylist();
// }

// // Function to display the user's playlist
// function displayUserPlaylist() {
//   const playlistContainer = document.querySelector(".playlist-items");
//   playlistContainer!.innerHTML = "";

//   userPlaylist.forEach((track, index) => {
//     const playlistItem = createPlaylistItem(track, index);
//     playlistContainer!.appendChild(playlistItem);
//   });
// }

// // Initialize your track_list as you did before

// // Call this function to display the initial playlist (if any)
// displayUserPlaylist();


class Playlist {
  name: string;
  description: string;
  tracks: Track[];

  constructor(name: string, description: string, tracks: Track[]) {
    this.name = name;
    this.description = description;
    this.tracks = tracks || [];
  }

  addTrack(track: any) {
    this.tracks.push(track);
  }

  display() {
    console.log(`Playlist Name: ${this.name}`);
    console.log(`Description: ${this.description}`);
    console.log('Tracks:');
    this.tracks.forEach((track: { name: any; artist: any; }, index: number) => {
      console.log(`${index + 1}. ${track.name} by ${track.artist}`);
    });
  }
}

//BUILDER METHOD
class PlaylistBuilder {
  name: string;
  description: string;
  tracks: Track[];
  
  constructor() {
    this.name = '';
    this.description = '';
    this.tracks = [];
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  addTrack(track: Track) {
    this.tracks.push(track);
    return this;
  }

  build() {
    return new Playlist(this.name, this.description, this.tracks);
  }
}

// Usage:

const playlist = new PlaylistBuilder()
  .setName('My Awesome Playlist')
  .setDescription('A collection of great songs')
  .addTrack(track1)
  .addTrack(track2)
  .addTrack(track3)
  .build();

playlist.display();



// Create the audio element
const curr_track: HTMLAudioElement = document.createElement('audio');

// Create an instance of the audio player
const audioPlayer: AudioPlayer = new ConcreteAudioPlayer(curr_track);

// Use Dependency Injection to play a track
// playTrack(audioPlayer);


// Get the playlist container
const playlistContainer = document.querySelector(".playlist-items");

// Loop through the track_list and create playlist items
for (let i = 0; i < track_list.length; i++) {
  const playlistItem: HTMLDivElement = createPlaylistItem(track_list[i], i);
  playlistContainer!.appendChild(playlistItem);
}

// Load the first track in the tracklist
loadTrack(track_index);
