const playlist = [
    {
        audio: 'BTS - Magic Shop.mp3',
        image: 'BTS - Magic Shop.png',
        title: 'BTS - Magic Shop'
    },
    {
        audio: 'TXT - MOA Diary.mp3',
        image: 'TXT - MOA Diary.jpg',
        title: 'TXT - MOA Diary'
    }, 
];

let currentIndex = 0; 
const audio = document.getElementById('audio'); 
const imageElement = document.getElementById('cover-image'); 
const titleElement = document.getElementById('song-title'); 
const seekBar = document.getElementById('seek-bar'); 
const timestamp = document.getElementById('timestamp'); 

// Set initial values for audio, image, and title
audio.src = playlist[currentIndex].audio;
imageElement.src = playlist[currentIndex].image;
titleElement.textContent = playlist[currentIndex].title;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateUI() {
    audio.src = playlist[currentIndex].audio;
    imageElement.src = playlist[currentIndex].image;
    titleElement.textContent = playlist[currentIndex].title;

    timestamp.textContent = `0:00 / ${formatTime(audio.duration || 0)}`;
    seekBar.value = 0;

    audio.play();
    document.getElementById('logo_play').classList.remove('bi-caret-right-fill');
    document.getElementById('logo_play').classList.add('bi-pause-fill');
}


function playPreviousSong() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length; 
    updateUI();
}

// function playNextSong() {
//     if (repeatMode) {
//         updateUI();
//     } else {
//         currentIndex = (currentIndex + 1) % playlist.length;
//         updateUI();
//     }
// }

function playNextSong() {
    if (repeatMode) {
        updateUI(); // If repeat mode is active, play the current song again
    } else if (currentIndex === playlist.length - 1) {
        // If the current song is the last in the playlist
        currentIndex = 0; // Go back to the first song
        audio.src = playlist[currentIndex].audio;
        imageElement.src = playlist[currentIndex].image;
        titleElement.textContent = playlist[currentIndex].title;

        // Reset the UI and pause the audio
        timestamp.textContent = `0:00 / ${formatTime(audio.duration || 0)}`;
        seekBar.value = 0;
        audio.pause();

        document.getElementById('logo_play').classList.remove('bi-pause-fill');
        document.getElementById('logo_play').classList.add('bi-caret-right-fill');
    } else {
        // If not the last song, proceed to the next song in the playlist
        currentIndex = (currentIndex + 1) % playlist.length;
        updateUI();
    }
}



function playMusic() {
    if (audio.paused) {
        audio.play();
        document.getElementById('logo_play').classList.remove('bi-caret-right-fill');
        document.getElementById('logo_play').classList.add('bi-pause-fill'); 
    } else {
        audio.pause(); 
        document.getElementById('logo_play').classList.remove('bi-pause-fill');
        document.getElementById('logo_play').classList.add('bi-caret-right-fill'); 
    }
}

audio.addEventListener('timeupdate', function () {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration || 0);
    timestamp.textContent = `${currentTime} / ${duration}`;

    // Update the seek bar value
    if (!seekBar.dragging) {
        seekBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    }
});

// Update the audio duration when metadata is loaded
audio.addEventListener('loadedmetadata', function () {
    const duration = formatTime(audio.duration || 0);
    timestamp.textContent = `0:00 / ${duration}`;
    seekBar.max = 100; // Ensure the range slider max is 100
});

// Seek to the new position when the range slider is changed
seekBar.addEventListener('input', function () {
    const seekTo = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTo;
});

// Detect dragging to avoid conflicting with timeupdate events
seekBar.addEventListener('mousedown', function () {
    seekBar.dragging = true;
});
seekBar.addEventListener('mouseup', function () {
    seekBar.dragging = false;
});

// audio.addEventListener('ended', playNextSong);

function goToMainPage(){
    window.location.href = "main.html";
}

let repeatMode = false;

function toggleRepeat() {
    const repeatIcon = document.getElementById('logo_repeat');
    repeatMode = !repeatMode; // Toggle the repeat mode

    if (repeatMode) {
        repeatIcon.classList.add('active');
    } else {
        repeatIcon.classList.remove('active');
    }
}

// Add an event listener to the repeat icon
document.getElementById('logo_repeat').addEventListener('click', toggleRepeat);


audio.addEventListener('ended', function () {
    // if (!repeatMode && !shuffleMode) { 
    if (!repeatMode) { 
        // If neither repeat nor shuffle mode is active
        if (currentIndex === playlist.length - 1) { 
            // If the current song is the last in the playlist
            currentIndex = 0; // Go back to the first song
            audio.src = playlist[currentIndex].audio;
            imageElement.src = playlist[currentIndex].image;
            titleElement.textContent = playlist[currentIndex].title;

            // Reset the UI and pause the audio
            timestamp.textContent = `0:00 / ${formatTime(audio.duration || 0)}`;
            seekBar.value = 0;
            audio.pause();

            document.getElementById('logo_play').classList.remove('bi-pause-fill');
            document.getElementById('logo_play').classList.add('bi-caret-right-fill');
        } else {
            // If not the last song, proceed to the next song in the playlist
            playNextSong();
        }
    } else {
        // Handle other modes (repeat or shuffle)
        playNextSong();
    }
});










let shuffleMode = false;
let shuffledPlaylist = [];
let playedSongs = new Set();

// Shuffle function (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create shuffled playlist while keeping the current song fixed
function createShuffledPlaylist() {
    const remainingSongs = playlist.filter((_, index) => index !== currentIndex);
    shuffledPlaylist = shuffleArray([...remainingSongs]);
    shuffledPlaylist.unshift(playlist[currentIndex]); // Keep the current song as the first song
    playedSongs.clear(); // Reset the played songs tracker
    playedSongs.add(currentIndex); // Mark the current song as played
}

// Toggle shuffle mode
function toggleShuffle() {
    const shuffleIcon = document.getElementById('logo_shuffle');
    shuffleMode = !shuffleMode; // Toggle the shuffle mode

    if (shuffleMode) {
        shuffleIcon.classList.add('active');
        createShuffledPlaylist();
    } else {
        shuffleIcon.classList.remove('active');
        playedSongs.clear(); // Clear the played songs tracker
    }
}

// Add an event listener to the shuffle icon
document.getElementById('logo_shuffle').addEventListener('click', toggleShuffle);

// Updated playNextSong function
function playNextSong() {
    if (repeatMode) {
        updateUI(); // Repeat the current song
    } else if (shuffleMode) {
        if (playedSongs.size >= shuffledPlaylist.length) {
            // Stop playback if all songs in the shuffled playlist have been played
            audio.pause();
            document.getElementById('logo_play').classList.remove('bi-pause-fill');
            document.getElementById('logo_play').classList.add('bi-caret-right-fill');
        } else {
            // Play the next unplayed song in the shuffled playlist
            currentIndex = playlist.findIndex(song => song === shuffledPlaylist[playedSongs.size]);
            playedSongs.add(currentIndex);
            updateUI();
        }
    } else if (currentIndex === playlist.length - 1) {
        // If it's the last song in the playlist
        currentIndex = 0;
        audio.pause();
        document.getElementById('logo_play').classList.remove('bi-pause-fill');
        document.getElementById('logo_play').classList.add('bi-caret-right-fill');
    } else {
        // Play the next song in order
        currentIndex = (currentIndex + 1) % playlist.length;
        updateUI();
    }
}

// Reset the played songs tracker on song end
audio.addEventListener('ended', playNextSong);







