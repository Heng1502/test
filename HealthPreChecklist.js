const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD
const lastUsed = localStorage.getItem('lastUsedDate');

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

if (lastUsed === today) {
  // Restore checkbox states
  checkboxes.forEach((box, i) => {
    const state = localStorage.getItem('checkbox-' + i);
    box.checked = state === 'true';
  });
} else {
  // New day: clear previous checkbox states
  checkboxes.forEach((box, i) => {
    box.checked = false;
    localStorage.setItem('checkbox-' + i, 'false');
  });
  localStorage.setItem('lastUsedDate', today);
}

// Save checkbox changes
checkboxes.forEach((box, i) => {
  box.addEventListener('change', () => {
    localStorage.setItem('checkbox-' + i, box.checked);
  });
});

// 1. Request permission to show notifications
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// 2. Define your alarm times and messages (24-hour format)
const alarms = [
  { time: "07:00", message: "Wake up & drink water" },
  { time: "07:15", message: "Stretching or yoga" },
  { time: "07:30", message: "Healthy breakfast" },
  { time: "08:00", message: "Light exercise" },
  { time: "09:00", message: "Free time/study" },
  { time: "12:00", message: "Balanced lunch" },
  { time: "15:00", message: "Healthy snack" },
  { time: "18:00", message: "Light dinner" },
  { time: "21:30", message: "Prepare for bed" },
  { time: "22:00", message: "Sleep" }
];

let notifiedToday = {};

function checkTimeAndNotify() {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"

  alarms.forEach(alarm => {
    if (alarm.time === hhmm && !notifiedToday[alarm.time]) {
      if (Notification.permission === 'granted') {
        new Notification("🕒 Reminder", {
          body: alarm.message,
          icon: "https://cdn-icons-png.flaticon.com/512/833/833472.png"
        });
      }
      notifiedToday[alarm.time] = true;
    }
  });

  // Reset notification record at midnight
  if (hhmm === "00:00") {
    notifiedToday = {};
  }
}

// 3. Check every minute
setInterval(checkTimeAndNotify, 60 * 1000);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'));
}