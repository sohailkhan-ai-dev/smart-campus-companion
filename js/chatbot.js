// ===== MOCK STUDENT DATA (Demo only) =====
const STUDENT_DATA = {
  profile: {
    name: "Sohail",
    course: "BTech (CSE-AI)",
    semester: 3,
    section: "A"
  },
  attendance: {
    overallPct: 82,
    status: "Safe"
  },
  fees: {
    due: 45000,
    status: "Pending"
  },
  timetable: {
    // OPTIONAL: If you want next-class logic to work properly,
    // store like Monday/Tuesday arrays (same format used below).
    Monday: [
      { subject: "DBMS", start: "10:00", end: "11:00", room: "C-204" },
      { subject: "COA", start: "11:00", end: "12:00", room: "C-201" }
    ],
    Tuesday: [
      { subject: "OS", start: "10:00", end: "11:00", room: "C-101" }
    ]
  },
  notices: [
    "Mid-sem exam form deadline is Feb 2",
    "Library books return by Jan 30"
  ]
};

console.log("✅ chatbot.js loaded (offline mode)");

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chatbotToggle");
  const box = document.getElementById("chatbotBox");
  const input = document.getElementById("chatInput");
  const askBtn = document.getElementById("chatAskBtn");
  const reply = document.getElementById("chatReply");

  if (!toggle || !box) {
    console.error("Chatbot elements missing (chatbotToggle/chatbotBox)");
    return;
  }

  // ✅ Toggle open/close
  toggle.addEventListener("click", () => {
    const isOpen = box.style.display === "block";
    box.style.display = isOpen ? "none" : "block";
    if (!isOpen && input) input.focus();
  });

  if (!input || !askBtn || !reply) {
    console.error("Chatbot input/button/reply missing");
    return;
  }

  // ---------- DATA HELPERS ----------
  function safeJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  // ✅ NEW: Use localStorage if available, otherwise fallback to STUDENT_DATA
  function getStudentData() {
    const profileLS = safeJSON("studentProfile", null);
    const feesLS = safeJSON("feesSummary", null);
    const attendanceLS = safeJSON("attendanceSummary", null);
    const timetableLS = safeJSON("timetableData", null);
    const noticesLS = safeJSON("notices", null);

    const logged = safeJSON("loggedInStudent", {});

    return {
      profile: profileLS && Object.keys(profileLS).length ? profileLS : (STUDENT_DATA.profile || logged || {}),
      fees: feesLS && Object.keys(feesLS).length ? feesLS : (STUDENT_DATA.fees || {}),
      attendance: attendanceLS && Object.keys(attendanceLS).length ? attendanceLS : (STUDENT_DATA.attendance || {}),
      timetable: timetableLS && Object.keys(timetableLS).length ? timetableLS : (STUDENT_DATA.timetable || {}),
      notices: Array.isArray(noticesLS) && noticesLS.length ? noticesLS : (STUDENT_DATA.notices || []),
      logged
    };
  }

  // ---------- TIME HELPERS ----------
  function parseTimeToMinutes(t) {
    if (!t) return null;
    const m = String(t).match(/(\d{1,2}):(\d{2})/);
    if (!m) return null;
    const hh = Number(m[1]);
    const mm = Number(m[2]);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
  }

  function nowMinutes() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function todayKey() {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[new Date().getDay()];
  }

  function formatClass(cls) {
    const parts = [];
    if (cls.subject) parts.push(cls.subject);
    if (cls.start && cls.end) parts.push(`${cls.start}–${cls.end}`);
    if (cls.room) parts.push(`Room: ${cls.room}`);
    return parts.join(" • ");
  }

  function getNextClass(timetable) {
    const schedule = timetable?.schedule || timetable;
    const day = todayKey();
    const classes = Array.isArray(schedule?.[day]) ? schedule[day] : [];

    if (!classes.length) return null;

    const now = nowMinutes();

    const sorted = [...classes].sort((a, b) => {
      const am = parseTimeToMinutes(a.start) ?? 99999;
      const bm = parseTimeToMinutes(b.start) ?? 99999;
      return am - bm;
    });

    for (const cls of sorted) {
      const startM = parseTimeToMinutes(cls.start);
      if (startM != null && startM >= now) return cls;
    }
    return null;
  }

  // ---------- SIMPLE “INTENT” MATCHING ----------
  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\w\s:%-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasAny(q, arr) {
    // arr can contain keywords or phrases
    return arr.some((w) => q.includes(w));
  }

  function answerOffline(question) {
    const q = normalize(question);
    const { profile, fees, attendance, timetable, notices, logged } = getStudentData();

   const name = profile?.name || STUDENT_DATA.profile?.name || logged?.name || "Student";
const course = profile?.course || STUDENT_DATA.profile?.course || logged?.course || "N/A";
const section = profile?.section || STUDENT_DATA.profile?.section || logged?.section || "N/A";
const semester = profile?.semester || STUDENT_DATA.profile?.semester || logged?.semester || "N/A";


    const feeDue = fees?.due ?? fees?.pending ?? fees?.balance ?? null;
    const feeDueStr = (feeDue == null || feeDue === "") ? null : `₹${feeDue}`;

    const overallPct =
      attendance?.overallPct ??
      attendance?.overall ??
      attendance?.percent ??
      attendance?.percentage ??
      null;

    const noticeList = Array.isArray(notices) ? notices : [];

    // greetings
    if (hasAny(q, ["hi", "hello", "hey", "hii"])) {
      return `Hi ${name}! 👋\nAsk me about: profile, attendance, fees, next class, notices.`;
    }

    // help
    if (hasAny(q, ["help", "commands", "options", "what can you do"])) {
      return (
        "Try asking:\n" +
        "• What is my course/semester/section?\n" +
        "• Do I have fee pending?\n" +
        "• What is my attendance?\n" +
        "• What is my next class today?\n" +
        "• Show latest notices\n" +
        "• Enable notifications"
      );
    }

    // profile
    if (hasAny(q, ["my profile", "profile", "about me"])) {
      return `👤 ${name}\nCourse: ${course}\nSemester: ${semester}\nSection: ${section}`;
    }
    if (hasAny(q, ["name"])) return `Your name is ${name}.`;
    if (hasAny(q, ["course", "branch", "program"])) return `Your course is: ${course}.`;
    if (hasAny(q, ["semester", "sem"])) return `Your semester is: ${semester}.`;
    if (hasAny(q, ["section"])) return `Your section is: ${section}.`;

    // fees
    if (hasAny(q, ["fee", "fees", "due", "pending", "balance"])) {
      if (feeDueStr) return `💰 Your pending fees are: ${feeDueStr}.`;
      return "💰 I don't have fee data right now.";
    }

    // attendance
    if (hasAny(q, ["attendance", "present", "percent", "%"])) {
      if (overallPct != null) return `📊 Your overall attendance is: ${overallPct}%.`;
      return "📊 I don't have attendance data right now.";
    }

    // next class
    if (hasAny(q, ["next class", "next lecture", "what s next", "what's next", "next period"])) {
      const next = getNextClass(timetable);
      if (next) return `📅 Next class today: ${formatClass(next)}`;
      return "📅 No upcoming class found for today (or timetable not saved).";
    }

    // notices
    if (hasAny(q, ["notice", "notices", "announcement", "headlines"])) {
      if (!noticeList.length) return "📢 No notices available.";
      const top = noticeList.slice(0, 3).map((n, i) => {
        if (typeof n === "string") return `${i + 1}) ${n}`;
        return `${i + 1}) ${n.title || "Notice"}${n.date ? " • " + n.date : ""}`;
      }).join("\n");
      return `📢 Latest notices:\n${top}`;
    }

    // notifications
    if (hasAny(q, ["enable notification", "turn on notification", "notifications on"])) {
      localStorage.setItem("notificationsEnabled", "true");
      return "✅ Notifications enabled.";
    }
    if (hasAny(q, ["disable notification", "turn off notification", "notifications off"])) {
      localStorage.setItem("notificationsEnabled", "false");
      return "✅ Notifications disabled.";
    }

    return "I can help with profile, attendance, fees, next class, and notices.\nType: help";
  }

  // ---------- SIMPLE NOTIFICATIONS (tab must be open) ----------
  function maybeNotify() {
    const enabled = localStorage.getItem("notificationsEnabled") === "true";
    if (!enabled) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const { fees, timetable } = getStudentData();

    // Fee reminder once per session
    const due = fees?.due ?? fees?.pending ?? fees?.balance ?? null;
    if (due && !sessionStorage.getItem("feeNotified")) {
      new Notification("Fee Pending 💰", { body: `You have pending fees: ₹${due}` });
      sessionStorage.setItem("feeNotified", "1");
    }

    // Next class reminder 10 minutes before
    const next = getNextClass(timetable);
    if (!next?.start) return;

    const startM = parseTimeToMinutes(next.start);
    if (startM == null) return;

    const diff = startM - nowMinutes();
    if (diff <= 10 && diff >= 9) {
      const key = `classNotified:${todayKey()}:${next.start}:${next.subject || ""}`;
      if (!sessionStorage.getItem(key)) {
        new Notification("Next Class Reminder 📚", { body: formatClass(next) });
        sessionStorage.setItem(key, "1");
      }
    }
  }

  setInterval(maybeNotify, 30000);

  // ---------- UI SEND ----------
  function send() {
    const q = input.value.trim();
    if (!q) return;

    reply.textContent = "Thinking… 🤖";
    input.value = "";

    // small delay to feel "smart"
    setTimeout(() => {
      reply.textContent = answerOffline(q);
    }, 300);
  }

  askBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
});
