const socket = io();

const clientsTotal = document.getElementById("client-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

// -----------add messsages to html------------
socket.on("new-message", (data) => {
  addMessage(false, data);
});

// -------------Set number of users----------
socket.on("users", (data) => {
  clientsTotal.innerText = `Total Users : ${data}`;
});

function sendMessage() {
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    date: new Date(),
  };

  socket.emit("user-msg", data);
  addMessage(true, data);
  messageInput.value = "";
}

function addMessage(ownMsg, data) {
  const element = ` <li class="${ownMsg ? "message-right" : "message-left"}">
    <p class="message">
      ${data.message}
      <span>${data.name} ● ${moment(data.date).fromNow()}</span>
    </p>
  </li>`;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// -------------Updating typing note of user-------------------
messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clear();
  const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `;
  messageContainer.innerHTML += element;
});

function clear() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
