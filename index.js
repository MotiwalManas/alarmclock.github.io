const CurrentTime = document.querySelector("#current-time");
const Hours = document.querySelector("#hours");
const Minutes = document.querySelector("#minutes");
const Seconds = document.querySelector("#seconds");
const AmPm = document.querySelector("#am-pm");
const SetAlarm = document.querySelector("#submitButton");
const AlarmContainer = document.querySelector("#alarms-container");

//getting time from local machine
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  CurrentTime.innerHTML = time;
  return time;
}

SetAlarm.addEventListener("click", getInput);

//Dropdown menu for selecting hour, minute, second to set alarm
window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, Hours);
  dropDownMenu(0, 59, Minutes);
  dropDownMenu(0, 59, Seconds);
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}
function getInput(e) {
  e.preventDefault();
  const hourValue = Hours.value;
  const minuteValue = Minutes.value;
  const secondValue = Seconds.value;
  const amPmValue = AmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// alarms set by user. Dislayed in html
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) =>
    deleteAlarm(e, time, intervalId)
  );

  AlarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}
// getting alarms details from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

//deleting alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
