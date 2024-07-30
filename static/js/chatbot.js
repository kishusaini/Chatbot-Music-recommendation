const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let userName = "";
let songType = "";
let messageQueue = [];

const validSongTypes = ["hindi", "punjabi", "english", "sad", "rock", "classical", "pop", "western", "romantic", "happy", "angry", "jazz", "blues", "metal", "folk", "country", "electronic", "rap", "indie", "disco", "reggae"];

function updateChatLog(message, isUserMessage) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isUserMessage ? "user-message" : "bot-message";
  messageDiv.textContent = message;

  if (isUserMessage) {
    messageDiv.classList.add("left");
  } else {
    messageDiv.classList.add("right");
  }

  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight; // Ensure the chat log scrolls down to the latest message
}

function sendAutomaticMessage(message) {
  messageQueue.push(message);
  processMessageQueue();
}

function processMessageQueue() {
  if (messageQueue.length > 0) {
    const message = messageQueue.shift();
    updateChatLog(message, false);
    setTimeout(processMessageQueue, 1000); 
  }
}

sendAutomaticMessage("Welcome to Musicana. What is your name?");

sendButton.addEventListener("click", () => {
  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  if (!userName) {
    userName = extractName(userMessage);
    updateChatLog(`You: ${userMessage}`, true);
    if (userName) {
      sendAutomaticMessage(`Hi dear ${userName}, I hope you are doing great. What type of songs do you want to listen to?`);
    } else {
      sendAutomaticMessage("I'm sorry, I didn't catch your name. Could you please tell me your name?");
    }
  } else if (!songType) {
    songType = userMessage.toLowerCase();
    updateChatLog(`You: ${userMessage}`, true);
    
    if (validSongTypes.includes(songType)) {
      sendAutomaticMessage("Thanks for chatting! Please click the Fetch Recommendation button, and I will recommend some songs for you.");
      sendUserMessageToBackend(userName, songType);
    } else {
      sendAutomaticMessage("Sorry, I didn't recognize that song type. Please try one of the following: " + validSongTypes.join(", ")+". Kindly enter type of song only.");
      songType = ""; // Reset songType to prompt user again
    }
  }

  userInput.value = "";
});

function extractName(userMessage) {
  const namePatterns = [
    /^my name is (.+)$/i,
    /^i am (.+)$/i,
    /^i'm (.+)$/i,
    /^this is (.+)$/i,
    /^it's (.+)$/i,
    /^me (.+)$/i
  ];

  for (let pattern of namePatterns) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return userMessage; // Fallback if no pattern matches
}

function sendUserMessageToBackend(userName, songType) {
  const data = {
    userName: userName,
    songType: songType
  };

  fetch("/save_song_type", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(responseData => {
    // Handle response if needed
  })
  .catch(error => {
    console.error("Error sending data to backend:", error);
  });
}

const fetchRecommendationsButton = document.getElementById("fetch-recommendations-button");
fetchRecommendationsButton.addEventListener("click", () => {
  fetchRecommendations(songType);
});

function fetchRecommendations(songType) {
  if (validSongTypes.includes(songType)) {
    window.location.href = `/recommendation?songType=${songType}`;
  } else {
    console.error("Invalid song type:", songType);
  }
}
