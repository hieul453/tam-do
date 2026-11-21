-- ============================================================================
-- Tâm Đồ — migration khởi tạo
--
-- Nguyên tắc:
--   * NỘI DUNG bài học KHÔNG nằm ở đây. Nội dung là file markdown trong repo,
--     build ra JSON và ship cùng app. Database chỉ giữ dữ liệu của người dùng.
--   * Mọi bảng đều có user_id và Row Level Security. Không có bảng nào
--     cho phép người này đọc dữ liệu người kia.
--   * lesson_id / card_id là text, trỏ tới id sinh từ markdown
--     (ví dụ 'tlhdc-06-06', 'tlhdc-06-06-c4'). Không có khoá ngoại tới
--     nội dung, vì nội dung không ở trong database.
--
-- Cách chạy: supabase db push     (hoặc dán file này vào SQL Editor)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles — hồ sơ và cài đặt. Tạo tự động khi có người dùng mới.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  display_name        text,
  -- Múi giờ quyết định "hôm nay" là ngày nào khi tính chuỗi ngày.
  -- Tính theo UTC sẽ làm người học buổi tối bị mất chuỗi.
  timezone            text        not null default 'Asia/Ho_Chi_Minh',
  daily_goal_minutes  smallint    not null default 10
                                  check (daily_goal_minutes between 5 and 60),
  -- Chế độ người học: v1 chỉ dùng 'on-tap', hai chế độ kia để sau.
  learner_mode        text        not null default 'on-tap'
                                  check (learner_mode in ('on-tap', 'dang-hoc', 'moi')),
  settings            jsonb       not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on column public.profiles.timezone is
  'Dùng để tính ngày địa phương cho chuỗi ngày và hàng đợi ôn tập.';

-- ----------------------------------------------------------------------------
-- lesson_progress — đã học xong tầng nào của bài nào.
-- Một bài có 3 tầng: hieu-nhanh, dao-sau, ap-dung.
-- ----------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  lesson_id    text        not null,
  tier         text        not null check (tier in ('hieu-nhanh', 'dao-sau', 'ap-dung')),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id, tier)
);

create index if not exists lesson_progress_user_lesson_idx
  on public.lesson_progress (user_id, lesson_id);

-- ----------------------------------------------------------------------------
-- card_reviews — lịch ôn giãn cách từng thẻ. Đây là trái tim của chế độ ôn tập.
-- Thuật toán SM-2 giản lược, 3 mức tự đánh giá: quen / mo / ro.
-- ----------------------------------------------------------------------------
create table if not exists public.card_reviews (
  user_id          uuid    not null references auth.users (id) on delete cascade,
  card_id          text    not null,
  lesson_id        text    not null,
  ease             real    not null default 2.5 check (ease between 1.3 and 3.0),
  interval_days    real    not null default 0,
  repetitions      integer not null default 0,
  -- Lưu DATE theo múi giờ người dùng, không lưu timestamp.
  -- "Đến hạn hôm nay" là khái niệm theo ngày, không theo giờ.
  due_on           date    not null default (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  last_rating      text    check (last_rating in ('quen', 'mo', 'ro')),
  last_reviewed_at timestamptz,
  primary key (user_id, card_id)
);

-- Truy vấn nóng nhất của app: "hôm nay cần ôn thẻ nào".
create index if not exists card_reviews_due_idx
  on public.card_reviews (user_id, due_on);

-- ----------------------------------------------------------------------------
-- saved_cards — thẻ đã lưu vào Sổ tay (giữ lâu để lưu).
-- ----------------------------------------------------------------------------
create table if not exists public.saved_cards (
  user_id   uuid        not null references auth.users (id) on delete cascade,
  card_id   text        not null,
  lesson_id text        not null,
  saved_at  timestamptz not null default now(),
  primary key (user_id, card_id)
);

-- ----------------------------------------------------------------------------
-- notes — ghi chú tự do của người học, gắn vào một bài.
-- ----------------------------------------------------------------------------
create table if not exists public.notes (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  lesson_id  text,
  body       text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_idx on public.notes (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- journal_entries — NHẬT KÝ ÁP DỤNG. DỮ LIỆU NHẠY CẢM.
--
-- Đây là nơi người học viết chuyện riêng của mình khi làm thử thách.
-- Quy tắc đã chốt (CLAUDE.md mục 10):
--   * Không phân tích, không chia sẻ, không đưa vào analytics.
--   * Không index full-text lên dịch vụ ngoài.
--   * Phải xoá được hoàn toàn khi người dùng xoá tài khoản
--     (on delete cascade ở trên lo việc này).
-- ----------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users (id) on delete cascade,
  lesson_id    text,
  challenge_id text,
  body         text        not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists journal_entries_user_idx
  on public.journal_entries (user_id, created_at desc);

comment on table public.journal_entries is
  'NHẠY CẢM. Không analytics, không chia sẻ, không index ra ngoài.';

-- ----------------------------------------------------------------------------
-- daily_activity — một dòng mỗi người mỗi ngày. Nguồn của chuỗi ngày
-- và vòng mục tiêu ở tab Hôm nay.
-- ----------------------------------------------------------------------------
create table if not exists public.daily_activity (
  user_id        uuid     not null references auth.users (id) on delete cascade,
  activity_date  date     not null,
  minutes_spent  integer  not null default 0 check (minutes_spent >= 0),
  cards_reviewed integer  not null default 0 check (cards_reviewed >= 0),
  lessons_opened integer  not null default 0 check (lessons_opened >= 0),
  primary key (user_id, activity_date)
);

-- ----------------------------------------------------------------------------
-- badges — huy hiệu đã nhận.
-- ----------------------------------------------------------------------------
create table if not exists public.badges (
  user_id   uuid        not null references auth.users (id) on delete cascade,
  badge_id  text        not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- Bật RLS trên mọi bảng, rồi cấp đúng một quyền: người dùng chỉ thao tác được
-- trên dòng có user_id là chính mình. Không bảng nào có policy đọc công khai.
--
-- Nếu quên dòng "enable row level security" ở một bảng, bảng đó sẽ mở cho
-- bất kỳ ai có anon key. Đừng thêm bảng mới mà bỏ bước này.
-- ============================================================================

alter table public.profiles        enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.card_reviews    enable row level security;
alter table public.saved_cards     enable row level security;
alter table public.notes           enable row level security;
alter table public.journal_entries enable row level security;
alter table public.daily_activity  enable row level security;
alter table public.badges          enable row level security;

-- profiles dùng cột id làm khoá người dùng, nên tách riêng.
drop policy if exists "chu so huu toan quyen" on public.profiles;
create policy "chu so huu toan quyen" on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Các bảng còn lại đều có cột user_id.
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'lesson_progress', 'card_reviews', 'saved_cards',
      'notes', 'journal_entries', 'daily_activity', 'badges'
    ])
  loop
    execute format('drop policy if exists "chu so huu toan quyen" on public.%I', t);
    execute format(
      'create policy "chu so huu toan quyen" on public.%I
         for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t
    );
  end loop;
end
$$;

-- ============================================================================
-- Tự tạo profiles khi có người dùng mới (kể cả người dùng ẩn danh).
-- security definer để trigger ghi được vào public.profiles.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Tự cập nhật updated_at.
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in select unnest(array['profiles', 'notes', 'journal_entries'])
  loop
    execute format('drop trigger if exists touch_%s on public.%I', t, t);
    execute format(
      'create trigger touch_%s before update on public.%I
         for each row execute function public.touch_updated_at()',
      t, t
    );
  end loop;
end
$$;
