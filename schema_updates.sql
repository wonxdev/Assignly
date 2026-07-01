-- ==========================================
-- ASSIGNLY DATABASE SCHEMA & SECURITY
-- ==========================================

-- 1. TABLES
-- ------------------------------------------

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin')),
  grade TEXT, -- "10", "11", "12"
  class_letter TEXT, -- "A", "B", "C", etc.
  moving1_subject TEXT,
  moving2_subject TEXT,
  moving3_subject TEXT,
  moving4_subject TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  guru_pengampu TEXT,
  class TEXT NOT NULL, -- Specified class (e.g. "10-A") OR "MOVING"
  due_date DATE NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: assignment_status
CREATE TABLE IF NOT EXISTS public.assignment_status (
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('DONE', 'NOT DONE')) DEFAULT 'NOT DONE',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (assignment_id, student_id)
);

-- 2. ENABLE RLS
-- ------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_status ENABLE ROW LEVEL SECURITY;

-- 3. USERS POLICIES
-- ------------------------------------------

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON public.users FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 4. ASSIGNMENTS POLICIES
-- ------------------------------------------

-- VISIBILITY LOGIC:
-- Students see assignment if it's for their Kelas Wajib OR matches one of their 4 Moving Subjects
CREATE POLICY "Students see relevant assignments" 
ON public.assignments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'student' AND (
      public.assignments.class = (grade || '-' || class_letter) OR 
      public.assignments.subject IN (moving1_subject, moving2_subject, moving3_subject, moving4_subject)
    )
  )
);

CREATE POLICY "Staff manage own assignments" ON public.assignments FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'staff') AND teacher_id = auth.uid());
CREATE POLICY "Admins manage all assignments" ON public.assignments FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 5. ASSIGNMENT_STATUS POLICIES
-- ------------------------------------------

CREATE POLICY "Students manage own status" ON public.assignment_status FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Staff view status for own assignments" ON public.assignment_status FOR SELECT USING (EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_status.assignment_id AND teacher_id = auth.uid()));
CREATE POLICY "Admins manage all status" ON public.assignment_status FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 6. AUTOMATION
-- ------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
