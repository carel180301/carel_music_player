const playlist = [
    {
        audio: 'BTS - Magic Shop.mp3',
        image: 'BTS - Magic Shop.png',
        title: 'BTS - Magic Shop'
    },
    {
        audio: 'NCT Dream - To My First.mp3',
        image: 'NCT Dream - To My First.png',
        title: 'NCT Dream - To My First'
    },
    {
        audio: 'TXT - MOA Diary.mp3',
        image: 'TXT - MOA Diary.jpg',
        title: 'TXT - MOA Diary'
    }, 
    {
        audio: 'The Wind - Hello My First Love.mp3',
        image: 'The Wind - Hello My First Love.jpeg',
        title: 'The Wind - Hello, My First Love'
    }
];

let currentIndex = 0; // Current song index
const audio = document.getElementById('audio'); // Get the audio element
const imageElement = document.getElementById('cover-image'); // Get the image element
const titleElement = document.getElementById('song-title'); // Get the title element
const seekBar = document.getElementById('seek-bar'); // Get the seek bar element
const timestamp = document.getElementById('timestamp'); // Get the timestamp element

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
    // Update audio, image, and title
    audio.src = playlist[currentIndex].audio;
    imageElement.src = playlist[currentIndex].image;
    titleElement.textContent = playlist[currentIndex].title;

    // Reset the seek bar and timestamp
    timestamp.textContent = `0:00 / ${formatTime(audio.duration || 0)}`;
    seekBar.value = 0;

    // Play the updated audio
    audio.play();
    document.getElementById('logo_play').classList.remove('bi-caret-right-fill');
    document.getElementById('logo_play').classList.add('bi-pause-fill');
}

function playPreviousSong() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length; // Move to the previous song, loop back if at the beginning
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

function playMusic() {
    if (audio.paused) {
        audio.play(); // Play audio if it's paused
        document.getElementById('logo_play').classList.remove('bi-caret-right-fill');
        document.getElementById('logo_play').classList.add('bi-pause-fill'); // Change icon to pause when playing
    } else {
        audio.pause(); // Pause audio if it's already playing
        document.getElementById('logo_play').classList.remove('bi-pause-fill');
        document.getElementById('logo_play').classList.add('bi-caret-right-fill'); // Change icon back to play
    }
}

// Update the seek bar and timestamp as the audio plays
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

// Automatically play the next song when the current song ends
audio.addEventListener('ended', playNextSong);

function goToMainPage(){
    window.location.href = "main.html";
}

let repeatMode = false; // Track repeat mode status

function toggleRepeat() {
    const repeatIcon = document.getElementById('logo_repeat');
    repeatMode = !repeatMode; // Toggle the repeat mode

    if (repeatMode) {
        repeatIcon.classList.add('active'); // Add the active class to indicate repeat mode is on
    } else {
        repeatIcon.classList.remove('active'); // Remove the active class to indicate repeat mode is off
    }
}

// Add an event listener to the repeat icon
document.getElementById('logo_repeat').addEventListener('click', toggleRepeat);


let shuffleMode = false; // Track shuffle mode status
let shuffledIndexes = []; // Array to store shuffled song indexes
let shuffleIndex = 0; // Pointer for the current position in the shuffled playlist

// Function to generate a shuffled array of song indexes
function generateShuffledPlaylist() {
    shuffledIndexes = [...Array(playlist.length).keys()]; // [0, 1, 2, 3]
    for (let i = shuffledIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [shuffledIndexes[i], shuffledIndexes[j]] = [shuffledIndexes[j], shuffledIndexes[i]]; // Swap
    }
    shuffleIndex = 0; // Reset the shuffle pointer
}

// Function to toggle shuffle mode
function toggleShuffle() {
    const shuffleIcon = document.getElementById('logo_shuffle');
    shuffleMode = !shuffleMode; // Toggle shuffle mode

    if (shuffleMode) {
        shuffleIcon.classList.add('active'); // Highlight shuffle icon
        generateShuffledPlaylist(); // Create a new shuffled playlist
    } else {
        shuffleIcon.classList.remove('active'); // Remove highlight
        shuffledIndexes = []; // Clear the shuffled playlist
        shuffleIndex = 0; // Reset shuffle index
    }

    // Enable the "Next" button again when shuffle is turned off
    document.getElementById('logo_next').disabled = false;
}

// Modify playNextSong to handle shuffle mode
function playNextSong() {
    if (shuffleMode) {
        if (shuffleIndex < shuffledIndexes.length) {
            // Play the next song in the shuffled playlist
            currentIndex = shuffledIndexes[shuffleIndex];
            shuffleIndex++;
            updateUI();

            // Disable "Next" button if all shuffled songs have been played
            if (shuffleIndex >= shuffledIndexes.length) {
                document.getElementById('logo_next').disabled = true;
            }
        }
    } else if (repeatMode) {
        updateUI(); // Replay the current song if repeat mode is active
    } else {
        currentIndex = (currentIndex + 1) % playlist.length; // Move to the next song
        updateUI();
    }
}

// Add an event listener to the shuffle icon
document.getElementById('logo_shuffle').addEventListener('click', toggleShuffle);


