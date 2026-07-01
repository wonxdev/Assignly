/**
 * ASSIGNLY - Core Logic & Authentication
 * Framework: Vanilla JS + Supabase JS v2
 */

// 1. SUPABASE INITIALIZATION
const SB_URL = "https://mpimqpnwriullovzpoow.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waW1xcG53cml1bGxvdnpwb293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MDI4MDEsImV4cCI6MjA4NTA3ODgwMX0.__al5S4KMIGa9YOPMQzL_2g9OsXg6kmlAVi5NDz-HJM";

if (typeof supabase !== 'undefined' && supabase.createClient) {
  window.supabase = supabase.createClient(SB_URL, SB_KEY);
} else {
  console.error("Assignly: Supabase library not found.");
}

// 2. CANONICAL DATA
// ------------------------------------------

const WAJIB_SUBJECTS = [
  "Bahasa Indonesia", "Bahasa Inggris", "Bahasa Jawa", "PPKn",
  "PKWU", "Agama", "Matematika Wajib", "Seni Musik",
  "Seni Rupa", "Sejarah", "Olahraga"
].sort();

const MOVING_SUBJECTS = [
  "Informatika", "Matematika Minat", "Bahasa Indonesia Minat",
  "Bahasa Inggris Minat", "Bahasa Mandarin Minat", "Bahasa Jerman Minat",
  "Fisika", "Ekonomi", "Antropologi", "Sosiologi",
  "Geografi", "Biologi", "Kimia"
].sort();

// 3. UTILS
// ------------------------------------------

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function roleRedirect(role) {
  if (role === 'admin') window.location.href = 'admin.html';
  else if (role === 'staff') window.location.href = 'teacher.html';
  else window.location.href = 'student.html';
}

// 4. AUTH LOGIC
// ------------------------------------------

async function checkAuth(requiredRole = null) {
  if (!supabase || !supabase.auth) return null;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (!window.location.pathname.includes('index.html') && !window.location.pathname.includes('register.html')) {
      window.location.href = 'index.html';
    }
    return null;
  }

  const { data: profile, error } = await supabase.from('users').select('*').eq('id', user.id).single();

  if (error || !profile) {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
    return null;
  }

  if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
    roleRedirect(profile.role);
  }
  return profile;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile, error: profileError } = await supabase.from('users').select('role').eq('id', data.user.id).single();
  if (profileError) throw profileError;
  roleRedirect(profile.role);
}

async function registerUser(email, password, fullName, grade, classLetter, movingSubjects) {
  // 1. Auth Signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error) throw error;
  if (!data.user) throw new Error("Check email for confirmation!");

  // 2. Update profile (Trigger handles initial INSERT)
  const { error: profileError } = await supabase
    .from('users')
    .update({
      grade: grade,
      class_letter: classLetter,
      moving1_subject: movingSubjects[0],
      moving2_subject: movingSubjects[1],
      moving3_subject: movingSubjects[2],
      moving4_subject: movingSubjects[3]
    })
    .eq('id', data.user.id);

  if (profileError) throw profileError;
  return data.user;
}

// Global Exports
window.WAJIB_SUBJECTS = WAJIB_SUBJECTS;
window.MOVING_SUBJECTS = MOVING_SUBJECTS;
window.formatDate = formatDate;
window.roleRedirect = roleRedirect;
window.checkAuth = checkAuth;
window.logout = logout;
window.loginUser = loginUser;
window.registerUser = registerUser;
