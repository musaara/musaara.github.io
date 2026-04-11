"use strict";

const EVENT_DATE = new Date("2026-05-21T10:00:00+04:00");
const DEFAULT_NAME = "ուսուցիչ";
const DEFAULT_GROUP_IMAGE = "LAST PAGE photo.png";
const PHONE_BREAKPOINT_QUERY = "(max-width: 740px)";
const PHONE_IMAGE_FILES = new Set([
  "FIrst page photo 1.png",
  "First page photo 2.png",
  "Second page Photo.png"
]);

const STUDENTS = Array.isArray(window.STUDENTS_DB) ? window.STUDENTS_DB : [];
const TEACHERS = Array.isArray(window.TEACHERS_DB) ? window.TEACHERS_DB : [];

const STORY_EXTRA_FILES = Object.freeze([
  "FIrst page photo 1.png",
  "First page photo 2.png",
  "First pahe hat detal.png",
  "Second page Photo.png",
  "LAST PAGE photo.png"
]);

let greetingTypingTimer = null;
let greetingTypingRunId = 0;
const phoneMediaQuery = typeof window !== "undefined" && window.matchMedia
  ? window.matchMedia(PHONE_BREAKPOINT_QUERY)
  : null;

function imagePath(fileName) {
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia(PHONE_BREAKPOINT_QUERY).matches &&
    PHONE_IMAGE_FILES.has(fileName)
  ) {
    return `IMG/Phone/${encodeURIComponent(fileName)}`;
  }

  return `IMG/${encodeURIComponent(fileName)}`;
}

function fallbackNameFromFile(fileName) {
  return (fileName || "").replace(/\.[^.]+$/, "").trim();
}

function formatTwoDigits(value) {
  return String(value).padStart(2, "0");
}

function setElementText(id, value) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  const nextValue = String(value);
  if (element.textContent === nextValue) {
    return;
  }

  element.textContent = nextValue;
  element.classList.remove("tick");
  void element.offsetWidth;
  element.classList.add("tick");
}

function renderCountdown() {
  const now = new Date();
  const diffMs = EVENT_DATE.getTime() - now.getTime();
  const status = document.getElementById("countdownStatus");

  if (diffMs <= 0) {
    setElementText("daysValue", "00");
    setElementText("hoursValue", "00");
    setElementText("minutesValue", "00");
    setElementText("secondsValue", "00");
    if (status) {
      status.textContent = "Միջոցառումը մեկնարկել է։ Սիրով սպասում ենք ձեզ։";
    }
    return true;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setElementText("daysValue", formatTwoDigits(days));
  setElementText("hoursValue", formatTwoDigits(hours));
  setElementText("minutesValue", formatTwoDigits(minutes));
  setElementText("secondsValue", formatTwoDigits(seconds));

  if (status) {
    status.textContent = "Սիրով սպասում ենք ձեզ";
  }

  return false;
}

function startCountdown() {
  const finished = renderCountdown();
  if (finished) {
    return;
  }

  const timerId = setInterval(() => {
    if (renderCountdown()) {
      clearInterval(timerId);
    }
  }, 1000);
}

function getVisualPool() {
  const studentFiles = STUDENTS.map((student) => student.file).filter(Boolean);
  const pool = [...STORY_EXTRA_FILES, ...studentFiles];
  return [...new Set(pool)];
}

function assignVisuals() {
  const pool = getVisualPool();
  if (pool.length === 0) {
    return;
  }

  const heroOne = document.getElementById("heroPolaroidOne");
  const heroTwo = document.getElementById("heroPolaroidTwo");
  const story = document.getElementById("storyPolaroid");
  const group = document.getElementById("groupPhoto");

  const heroOneFile = STORY_EXTRA_FILES[0] || pool[0];
  const heroTwoFile = STORY_EXTRA_FILES[1] || pool[1] || heroOneFile;
  const storyFile = STORY_EXTRA_FILES[3] || pool[3] || heroOneFile;
  const groupFile = pool.includes(DEFAULT_GROUP_IMAGE) ? DEFAULT_GROUP_IMAGE : pool[0];

  if (heroOne) {
    heroOne.src = imagePath(heroOneFile);
  }

  if (heroTwo) {
    heroTwo.src = imagePath(heroTwoFile);
  }

  if (story) {
    story.src = imagePath(storyFile);
  }

  if (group) {
    group.src = imagePath(groupFile);
  }
}

const STUDENT_LAYOUT_TEMPLATE = Object.freeze([
  { x: 2.0, y: 3.2, tilt: -7, w: 18.6, stack: 11 },
  { x: 18.7, y: 2.8, tilt: -8, w: 18.6, stack: 12 },
  { x: 35.3, y: 3.4, tilt: 4, w: 18.6, stack: 13 },
  { x: 52.0, y: 2.9, tilt: -2, w: 18.6, stack: 14 },
  { x: 68.6, y: 3.1, tilt: 7, w: 18.6, stack: 15 },
  { x: 2.3, y: 19.1, tilt: -5, w: 18.6, stack: 21 },
  { x: 18.9, y: 19.5, tilt: -4, w: 18.6, stack: 22 },
  { x: 35.4, y: 19.2, tilt: -4, w: 18.6, stack: 23 },
  { x: 52.0, y: 19.4, tilt: 13, w: 18.6, stack: 24 },
  { x: 68.4, y: 19.1, tilt: -3, w: 18.6, stack: 25 },
  { x: 3.0, y: 35.3, tilt: 8, w: 18.6, stack: 31 },
  { x: 19.5, y: 35.7, tilt: -8, w: 18.6, stack: 32 },
  { x: 36.0, y: 35.5, tilt: 8, w: 18.6, stack: 33 },
  { x: 52.4, y: 35.8, tilt: -5, w: 18.6, stack: 34 },
  { x: 68.8, y: 35.4, tilt: 6, w: 18.6, stack: 35 },
  { x: 3.2, y: 51.9, tilt: -6, w: 18.6, stack: 41 },
  { x: 19.8, y: 52.3, tilt: 5, w: 18.6, stack: 42 },
  { x: 36.3, y: 52.0, tilt: -9, w: 18.6, stack: 43 },
  { x: 52.9, y: 52.3, tilt: 4, w: 18.6, stack: 44 },
  { x: 69.3, y: 51.9, tilt: -4, w: 18.6, stack: 45 },
  { x: 2.3, y: 68.2, tilt: -5, w: 18.6, stack: 51 },
  { x: 18.9, y: 68.5, tilt: -4, w: 18.6, stack: 52 },
  { x: 35.4, y: 68.2, tilt: -4, w: 18.6, stack: 53 },
  { x: 52.0, y: 68.4, tilt: 13, w: 18.6, stack: 54 },
  { x: 68.4, y: 68.1, tilt: -3, w: 18.6, stack: 55 }
]);

const STUDENT_LAYOUT_X_OFFSET = (() => {
  const minX = Math.min(...STUDENT_LAYOUT_TEMPLATE.map((item) => item.x));
  const maxRight = Math.max(...STUDENT_LAYOUT_TEMPLATE.map((item) => item.x + item.w));
  const usedWidth = maxRight - minX;
  return ((100 - usedWidth) / 2) - minX;
})();

function getPolaroidStyle(index) {
  if (index < STUDENT_LAYOUT_TEMPLATE.length) {
    const item = STUDENT_LAYOUT_TEMPLATE[index];
    return {
      tilt: item.tilt,
      hoverTilt: item.tilt,
      x: item.x + STUDENT_LAYOUT_X_OFFSET,
      y: item.y,
      width: item.w,
      stack: item.stack,
      delay: "0s"
    };
  }

  const fallbackTilt = (index % 2 === 0 ? -6 : 6) + ((index % 5) - 2);
  const fallbackX = 2 + ((index % 5) * 18.5);
  const fallbackY = 3 + (Math.floor(index / 5) * 16.4);
  return {
    tilt: fallbackTilt,
    hoverTilt: fallbackTilt,
    x: fallbackX,
    y: fallbackY,
    width: 18.6,
    stack: 100 + index,
    delay: "0s"
  };
}

function renderStudents() {
  const grid = document.getElementById("studentsGrid");
  if (!grid) {
    return;
  }

  const fragment = document.createDocumentFragment();

  STUDENTS.forEach((student, index) => {
    const file = student.file;
    if (!file) {
      return;
    }

    const displayName = (student.name || "").trim() || fallbackNameFromFile(file);
    const style = getPolaroidStyle(index);

    const card = document.createElement("article");
    card.className = "student-card";
    card.dataset.name = displayName;
    card.style.setProperty("--tilt", `${style.tilt}deg`);
    card.style.setProperty("--hover-tilt", `${style.hoverTilt}deg`);
    card.style.setProperty("--x", `${style.x}%`);
    card.style.setProperty("--y", `${style.y}%`);
    card.style.setProperty("--w", `${style.width}%`);
    card.style.setProperty("--stack", String(style.stack));
    card.style.setProperty("--delay", style.delay);

    const image = document.createElement("img");
    image.className = "student-image";
    image.loading = "lazy";
    image.decoding = "async";
    image.src = imagePath(file);
    image.alt = `${displayName} - աշակերտ`;

    card.append(image);
    fragment.appendChild(card);
  });

  grid.replaceChildren(fragment);
}

function findTeacherById(id) {
  return TEACHERS.find((teacher) => teacher.id === id) || null;
}

function getInviteContext() {
  const params = new URLSearchParams(window.location.search);
  const teacherId = params.get("teacher");
  const customName = (params.get("name") || "").trim();
  const teacher = teacherId ? findTeacherById(teacherId) : null;
  return { teacher, customName };
}

function highlightStudents(names) {
  const selected = new Set((names || []).map((name) => name.trim()));
  const cards = document.querySelectorAll(".student-card");

  cards.forEach((card) => {
    card.classList.toggle("highlighted", selected.has(card.dataset.name));
  });
}

function typeGreeting(element, text) {
  if (!element) {
    return;
  }

  const targetText = String(text || "");
  const prefersReducedMotion = Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  if (greetingTypingTimer) {
    clearTimeout(greetingTypingTimer);
    greetingTypingTimer = null;
  }

  greetingTypingRunId += 1;
  const currentRunId = greetingTypingRunId;

  if (prefersReducedMotion || targetText.length === 0) {
    element.textContent = targetText;
    element.classList.remove("typing");
    element.classList.add("typed");
    return;
  }

  const characters = Array.from(targetText);
  const delayMs = targetText.length > 18 ? 44 : 58;
  let index = 0;

  element.textContent = "";
  element.classList.add("typing");
  element.classList.remove("typed");

  const typeNext = () => {
    if (currentRunId !== greetingTypingRunId) {
      return;
    }

    element.textContent += characters[index];
    index += 1;

    if (index < characters.length) {
      greetingTypingTimer = setTimeout(typeNext, delayMs);
      return;
    }

    element.classList.remove("typing");
    element.classList.add("typed");
    greetingTypingTimer = null;
  };

  typeNext();
}

function applyPersonalization(context) {
  const greeting = document.getElementById("heroGreeting");
  const personalWish = document.getElementById("heroPersonalWish");
  if (!greeting) {
    return;
  }

  const { teacher, customName } = context;

  if (teacher) {
    const name = (teacher.name || DEFAULT_NAME).trim();
    typeGreeting(greeting, `Սիրելի ${name}`);

    if (personalWish && teacher.personalWish) {
      personalWish.hidden = false;
      personalWish.textContent = teacher.personalWish;
    } else if (personalWish) {
      personalWish.hidden = true;
      personalWish.textContent = "";
    }

    if (teacher.highlightStudents) {
      highlightStudents(teacher.highlightStudents);
    }
    return;
  }

  const printableName = customName || DEFAULT_NAME;
  typeGreeting(greeting, `Սիրելի ${printableName}`);
  if (personalWish) {
    personalWish.hidden = true;
    personalWish.textContent = "";
  }
  highlightStudents([]);
}

function init() {
  assignVisuals();
  renderStudents();
  applyPersonalization(getInviteContext());
  startCountdown();

  if (phoneMediaQuery) {
    const onBreakpointChange = () => assignVisuals();
    if (typeof phoneMediaQuery.addEventListener === "function") {
      phoneMediaQuery.addEventListener("change", onBreakpointChange);
    } else if (typeof phoneMediaQuery.addListener === "function") {
      phoneMediaQuery.addListener(onBreakpointChange);
    }
  }
}

init();
