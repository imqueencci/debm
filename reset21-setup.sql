-- ══════════════════════════════════════════════
-- RESET21 Database Setup
-- FIT-TI Behavior Redesign Platform
-- Supabase SQL Editor에서 실행하세요
-- ══════════════════════════════════════════════

-- 1. 회원 테이블
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  access_code TEXT UNIQUE NOT NULL,
  frequency INTEGER DEFAULT 3,        -- 주 2/3/5회
  start_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,                         -- 여왕쌤 메모
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 일일 체크인 테이블
CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_number INTEGER,

  -- 운동 전 체크
  pre_condition INTEGER,              -- 컨디션 1~5
  pre_goal TEXT,                      -- 오늘 목표

  -- 운동 기록
  workout_done BOOLEAN DEFAULT FALSE,
  workout_type TEXT,                  -- 어떤 운동
  post_feeling TEXT,                  -- 운동 후 기분 (이모지)
  post_note TEXT,                     -- 한 줄 소감

  -- 오늘의 리디자인
  redesign_moment TEXT,               -- 흔들렸던 순간
  redesign_choice TEXT,               -- 그 순간의 선택
  redesign_tomorrow TEXT,             -- 내일 하나 바꾼다면

  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, checkin_date)
);

-- 3. RLS 설정 (Row Level Security)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- 모든 접근 허용 (앱에서 access_code로 제어)
CREATE POLICY "allow_all_members"  ON members  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_checkins" ON checkins FOR ALL USING (true) WITH CHECK (true);
