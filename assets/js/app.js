/**
 * ASSIGNLY - Core Logic (Demo Mode)
 * Frontend Portfolio Version
 */

// ==================================================
// CONFIG
// ==================================================
const DEMO_MODE = true;
const STORAGE_KEY = "assignly-db";

// ==================================================
// CANONICAL DATA
// ==================================================

const WAJIB_SUBJECTS = [
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Bahasa Jawa",
  "PPKn",
  "PKWU",
  "Agama",
  "Matematika Wajib",
  "Seni Musik",
  "Seni Rupa",
  "Sejarah",
  "Olahraga"
].sort();

const MOVING_SUBJECTS = [
  "Informatika",
  "Matematika Minat",
  "Bahasa Indonesia Minat",
  "Bahasa Inggris Minat",
  "Bahasa Mandarin Minat",
  "Bahasa Jerman Minat",
  "Fisika",
  "Ekonomi",
  "Antropologi",
  "Sosiologi",
  "Geografi",
  "Biologi",
  "Kimia"
].sort();

// ==================================================
// UTILITIES
// ==================================================

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toIsoDate(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
}

function formatDate(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function roleRedirect(role) {
  switch (role) {
    case "admin":
      window.location.href = "/pages/admin.html";
      break;
    case "staff":
      window.location.href = "/pages/teacher.html";
      break;
    default:
      window.location.href = "/pages/student.html";
      break;
  }
}

// ==================================================
// DEMO DATABASE LAYER
// ==================================================

const db = {
  init() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      this.seed();
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.assignments) || !Array.isArray(parsed.assignment_status)) {
        this.seed();
        return;
      }

      this._state = parsed;
    } catch (error) {
      console.error("Assignly: invalid demo database, reseeding.", error);
      this.seed();
    }
  },

  getState() {
    if (!this._state) {
      this.init();
    }

    return this._state;
  },

  save() {
    const state = this.getState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  getUsers() {
    return clone(this.getState().users);
  },

  getAssignments() {
    return clone(this.getState().assignments);
  },

  getStatuses() {
    return clone(this.getState().assignment_status);
  },

  getUserById(id) {
    return this.getUsers().find((user) => user.id === id) || null;
  },

  getUserByRole(role) {
    return this.getUsers().find((user) => user.role === role) || null;
  },

  getAssignmentsForTeacher(teacherId) {
    return this.getAssignments().filter((assignment) => assignment.teacher_id === teacherId);
  },

  getVisibleAssignmentsForStudent(student) {
    const statuses = this.getStatuses();
    const movingSubjects = [student.moving1_subject, student.moving2_subject, student.moving3_subject, student.moving4_subject].filter(Boolean);
    const targetClass = `${student.grade}-${student.class_letter}`;

    return this.getAssignments()
      .filter((assignment) => assignment.class === targetClass || movingSubjects.includes(assignment.subject))
      .map((assignment) => {
        const statusEntry = statuses.find((item) => item.assignment_id === assignment.id && item.student_id === student.id);
        return {
          ...assignment,
          status: statusEntry?.status || "NOT DONE"
        };
      })
      .sort((left, right) => new Date(left.due_date) - new Date(right.due_date));
  },

  getStatusRowsForAssignment(assignmentId) {
    const users = this.getUsers();
    return this.getStatuses()
      .filter((item) => item.assignment_id === assignmentId)
      .map((item) => {
        const user = users.find((entry) => entry.id === item.student_id);
        return {
          id: item.assignment_id,
          student_id: item.student_id,
          status: item.status,
          full_name: user?.full_name || user?.email || "Unknown Student",
          email: user?.email || ""
        };
      });
  },

  createUser(payload) {
    const user = {
      id: createId("user"),
      ...payload
    };

    this.getState().users.push(user);
    this.save();
    return user;
  },

  createAssignment(payload) {
    const assignment = {
      id: createId("assignment"),
      created_at: new Date().toISOString(),
      ...payload
    };

    this.getState().assignments.push(assignment);
    this.save();
    return assignment;
  },

  updateAssignment(id, payload) {
    const assignments = this.getState().assignments;
    const index = assignments.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    assignments[index] = {
      ...assignments[index],
      ...payload
    };

    this.save();
    return assignments[index];
  },

  deleteAssignment(id) {
    this.getState().assignments = this.getState().assignments.filter((item) => item.id !== id);
    this.getState().assignment_status = this.getState().assignment_status.filter((item) => item.assignment_id !== id);
    this.save();
  },

  updateStatus(assignmentId, studentId, status) {
    const statuses = this.getState().assignment_status;
    const index = statuses.findIndex((item) => item.assignment_id === assignmentId && item.student_id === studentId);

    if (index === -1) {
      statuses.push({
        assignment_id: assignmentId,
        student_id: studentId,
        status,
        updated_at: new Date().toISOString()
      });
    } else {
      statuses[index] = {
        ...statuses[index],
        status,
        updated_at: new Date().toISOString()
      };
    }

    this.save();
  },

  updateUser(id, payload) {
    const users = this.getState().users;
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      ...payload
    };

    this.save();
    return users[index];
  },

  seed() {
    const now = new Date().toISOString();
    const teacher = {
      id: createId("user"),
      email: "teacher@assignly.local",
      full_name: "Demo Teacher",
      role: "staff",
      grade: null,
      class_letter: null,
      moving1_subject: null,
      moving2_subject: null,
      moving3_subject: null,
      moving4_subject: null
    };

    const student = {
      id: createId("user"),
      email: "student@assignly.local",
      full_name: "Demo Student",
      role: "student",
      grade: "12",
      class_letter: "B",
      moving1_subject: "Informatika",
      moving2_subject: "Fisika",
      moving3_subject: "Bahasa Inggris Minat",
      moving4_subject: "Ekonomi"
    };

    const admin = {
      id: createId("user"),
      email: "admin@assignly.local",
      full_name: "Demo Administrator",
      role: "admin",
      grade: null,
      class_letter: null,
      moving1_subject: null,
      moving2_subject: null,
      moving3_subject: null,
      moving4_subject: null
    };

    const assignments = [
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Bahasa Indonesia Essai",
        subject: "Bahasa Indonesia",
        guru_pengampu: "Bu Rina",
        class: "12-B",
        due_date: toIsoDate(2),
        description: "Tulislah esai 800 kata tentang peran literasi digital.",
        priority: "High",
        created_at: now
      },
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Latihan Matematika Wajib",
        subject: "Matematika Wajib",
        guru_pengampu: "Pak Hendra",
        class: "12-B",
        due_date: toIsoDate(5),
        description: "Kerjakan soal limit dan turunan dari lembar latihan.",
        priority: "Medium",
        created_at: now
      },
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Praktikum Fisika",
        subject: "Fisika",
        guru_pengampu: "Pak Damar",
        class: "MOVING",
        due_date: toIsoDate(7),
        description: "Siapkan laporan praktikum tentang gaya dan energi.",
        priority: "High",
        created_at: now
      },
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Presentasi Informatika",
        subject: "Informatika",
        guru_pengampu: "Bu Sari",
        class: "MOVING",
        due_date: toIsoDate(9),
        description: "Buat presentasi singkat mengenai sistem informasi.",
        priority: "Medium",
        created_at: now
      },
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Reading Journal",
        subject: "Bahasa Inggris Minat",
        guru_pengampu: "Ms. Laila",
        class: "MOVING",
        due_date: toIsoDate(12),
        description: "Lengkapi jurnal bacaan dari novel yang dibaca minggu ini.",
        priority: "Low",
        created_at: now
      },
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Ekonomi Kelas XII",
        subject: "Ekonomi",
        guru_pengampu: "Pak Bima",
        class: "MOVING",
        due_date: toIsoDate(14),
        description: "Analisis kebutuhan pasar dan strategi penjualan sederhana.",
        priority: "Medium",
        created_at: now
      },
      {
        id: createId("assignment"),
        teacher_id: teacher.id,
        title: "Ulangan Sejarah",
        subject: "Sejarah",
        guru_pengampu: "Bu Yuli",
        class: "12-B",
        due_date: toIsoDate(16),
        description: "Persiapkan diri untuk ulangan bab reformasi dan orde baru.",
        priority: "High",
        created_at: now
      }
    ];

    const statuses = [
      {
        assignment_id: assignments[0].id,
        student_id: student.id,
        status: "DONE",
        updated_at: new Date().toISOString()
      },
      {
        assignment_id: assignments[2].id,
        student_id: student.id,
        status: "DONE",
        updated_at: new Date().toISOString()
      },
      {
        assignment_id: assignments[3].id,
        student_id: student.id,
        status: "NOT DONE",
        updated_at: new Date().toISOString()
      },
      {
        assignment_id: assignments[4].id,
        student_id: student.id,
        status: "NOT DONE",
        updated_at: new Date().toISOString()
      }
    ];

    this._state = {
      users: [admin, teacher, student],
      assignments,
      assignment_status: statuses
    };

    this.save();
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("assignly-demo-role");
    this.seed();
  }
};

// ==================================================
// AUTH
// ==================================================

function getDemoUser() {
  const role = localStorage.getItem("assignly-demo-role") || "student";
  return db.getUserByRole(role) || db.getUserByRole("student");
}

async function checkAuth(requiredRole = null) {
  const demoUser = getDemoUser();

  if (!demoUser) {
    window.location.href = "/index.html";
    return null;
  }

  if (requiredRole && demoUser.role !== requiredRole && demoUser.role !== "admin") {
    roleRedirect(demoUser.role);
    return null;
  }

  return demoUser;
}

async function logout() {
  localStorage.removeItem("assignly-demo-role");
  window.location.href = "/index.html";
}

async function loginUser() {
  roleRedirect(getDemoUser().role);
}

async function registerUser(email, password, fullName, grade, classLetter, movingSubjects) {
  const existingUser = db.getUsers().find((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  if (!email || !fullName || !grade || !classLetter || !Array.isArray(movingSubjects) || movingSubjects.length !== 4) {
    throw new Error("Please complete the registration form.");
  }

  const user = db.createUser({
    email,
    full_name: fullName,
    role: "student",
    grade,
    class_letter: classLetter,
    moving1_subject: movingSubjects[0],
    moving2_subject: movingSubjects[1],
    moving3_subject: movingSubjects[2],
    moving4_subject: movingSubjects[3]
  });

  localStorage.setItem("assignly-demo-role", user.role);
  return user;
}

// ==================================================
// DEMO
// ==================================================
function enterDemo(role) {
  localStorage.setItem("assignly-demo-role", role);
  roleRedirect(role);
}

function resetDemoDatabase() {
  db.reset();
}

// ==================================================
// INITIALIZE
// ==================================================

db.init();

// ==================================================
// EXPORTS
// ==================================================

window.DEMO_MODE = DEMO_MODE;
window.STORAGE_KEY = STORAGE_KEY;
window.WAJIB_SUBJECTS = WAJIB_SUBJECTS;
window.MOVING_SUBJECTS = MOVING_SUBJECTS;
window.db = db;

window.formatDate = formatDate;
window.roleRedirect = roleRedirect;

window.checkAuth = checkAuth;
window.logout = logout;
window.loginUser = loginUser;
window.registerUser = registerUser;

window.enterDemo = enterDemo;
window.getDemoUser = getDemoUser;
window.resetDemoDatabase = resetDemoDatabase;