-- ============================================================================
-- M3 — XP, chuỗi ngày, tim, mục tiêu ngày
--
-- Migration 0001 được thiết kế cho mô hình nội dung cũ. Không sửa nó (đã chạy
-- trên database thật); thêm vào đây những gì mô hình mới cần.
--
-- Nguyên tắc giữ nguyên: mọi bảng bật RLS, mỗi bảng một policy auth.uid().
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: thêm các chỉ số của người học
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists muc_tieu_xp_ngay smallint not null default 20
    check (muc_tieu_xp_ngay between 10 and 200),
  add column if not exists tim smallint not null default 5
    check (tim between 0 and 5),
  add column if not exists chuoi_hien_tai integer not null default 0,
  add column if not exists chuoi_dai_nhat integer not null default 0,
  -- Ngày địa phương của người dùng, không phải ngày UTC. Tính chuỗi theo UTC
  -- sẽ làm người học buổi tối ở Việt Nam mất chuỗi oan.
  add column if not exists ngay_hoc_gan_nhat date;

-- ----------------------------------------------------------------------------
-- tien_do_phan: đã học xong hướng nào của phần nào
--
-- Bảng mới thay vì dùng lại lesson_progress: bảng cũ ràng buộc tier vào bộ giá
-- trị của mô hình nội dung cũ ('hieu-nhanh'…), không khớp 'nhanh' bây giờ.
-- ----------------------------------------------------------------------------
create table if not exists public.tien_do_phan (
  user_id        uuid        not null references auth.users (id) on delete cascade,
  phan_id        text        not null,
  huong          text        not null check (huong in ('nhanh', 'dao-sau', 'ap-dung')),
  xp             smallint    not null default 0 check (xp >= 0),
  so_lan         integer     not null default 1 check (so_lan > 0),
  hoan_thanh_luc timestamptz not null default now(),
  primary key (user_id, phan_id, huong)
);

create index if not exists tien_do_phan_user_idx on public.tien_do_phan (user_id);

alter table public.tien_do_phan enable row level security;

drop policy if exists "chu so huu toan quyen" on public.tien_do_phan;
create policy "chu so huu toan quyen" on public.tien_do_phan
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- daily_activity: thêm XP
-- ----------------------------------------------------------------------------
alter table public.daily_activity
  add column if not exists xp integer not null default 0 check (xp >= 0);

-- ----------------------------------------------------------------------------
-- ngay_cua — "hôm nay" theo múi giờ của chính người dùng
--
-- Tách ra một hàm vì cả hàm đọc lẫn hàm ghi đều cần đúng một định nghĩa về
-- "hôm nay". Hai định nghĩa khác nhau là mất chuỗi ngày.
-- ----------------------------------------------------------------------------
create or replace function public.ngay_cua(p_uid uuid)
returns date
language sql
stable
security invoker
set search_path = public
as $$
  select (now() at time zone coalesce(
    (select timezone from public.profiles where id = p_uid),
    'Asia/Ho_Chi_Minh'
  ))::date
$$;

-- ============================================================================
-- ghi_nhan_phien — ghi lại một phiên học, tất cả trong một lượt
--
-- Gộp vào một hàm thay vì để client gọi ba lần, vì ba việc dưới đây phải xảy
-- ra cùng nhau hoặc không xảy ra gì cả:
--   1. đánh dấu phần đã xong
--   2. cộng XP vào hoạt động hôm nay
--   3. cập nhật chuỗi ngày và tim
--
-- Tim: client gửi SỐ TIM CÒN LẠI, không gửi số câu sai. Vì phiên học cho nạp
-- lại tim giữa đường (xem TrangHoc), nếu server tự trừ theo số câu sai thì hai
-- bên lệch nhau — người học thấy 5 tim trong bài mà thanh bên hiện 0.
--
-- security invoker: RLS vẫn áp dụng, người này không ghi được cho người khác.
-- ============================================================================

-- Postgres phân biệt hàm theo KIỂU tham số, nên đổi tên tham số phải drop
-- trước; nếu không sẽ thành hai hàm trùng chữ ký.
drop function if exists public.ghi_nhan_phien(text, text, integer, integer);

create or replace function public.ghi_nhan_phien(
  p_phan_id     text,
  p_huong       text,
  p_xp          integer,
  -- NULL = phiên này không liên quan tới tim (bài đọc, phần áp dụng), giữ
  -- nguyên số tim đang có. Chỉ phiên NHANH mới gửi số thật.
  p_tim_con_lai integer default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_hom_nay date;
  v_ngay_cu date;
begin
  if v_uid is null then
    raise exception 'Chưa đăng nhập';
  end if;
  if p_huong not in ('nhanh', 'dao-sau', 'ap-dung') then
    raise exception 'Hướng tiếp cận không hợp lệ: %', p_huong;
  end if;

  -- Không tin số từ client: chặn cả hai đầu.
  p_xp := greatest(0, least(coalesce(p_xp, 0), 500));
  if p_tim_con_lai is not null then
    p_tim_con_lai := greatest(0, least(p_tim_con_lai, 5));
  end if;

  v_hom_nay := public.ngay_cua(v_uid);
  select ngay_hoc_gan_nhat into v_ngay_cu from public.profiles where id = v_uid;

  -- 1. Đánh dấu phần đã xong. Làm lại thì giữ XP cao nhất, đếm số lần.
  insert into public.tien_do_phan (user_id, phan_id, huong, xp, so_lan)
  values (v_uid, p_phan_id, p_huong, p_xp, 1)
  on conflict (user_id, phan_id, huong) do update
    set xp = greatest(public.tien_do_phan.xp, excluded.xp),
        so_lan = public.tien_do_phan.so_lan + 1,
        hoan_thanh_luc = now();

  -- 2. Cộng XP vào hoạt động hôm nay. Học lại vẫn được XP, như Duolingo.
  insert into public.daily_activity (user_id, activity_date, xp, lessons_opened)
  values (v_uid, v_hom_nay, p_xp, 1)
  on conflict (user_id, activity_date) do update
    set xp = public.daily_activity.xp + excluded.xp,
        lessons_opened = public.daily_activity.lessons_opened + 1;

  -- 3. Chuỗi ngày và tim.
  update public.profiles set
    chuoi_hien_tai = case
      when v_ngay_cu = v_hom_nay then chuoi_hien_tai              -- đã học hôm nay rồi
      when v_ngay_cu = v_hom_nay - 1 then chuoi_hien_tai + 1      -- nối tiếp hôm qua
      else 1                                                      -- đứt chuỗi, bắt đầu lại
    end,
    ngay_hoc_gan_nhat = v_hom_nay,
    tim = case
      when p_tim_con_lai is not null then p_tim_con_lai
      -- Phiên không liên quan tới tim: giữ nguyên, nhưng sang ngày mới thì
      -- vẫn đầy lại — đúng quy tắc mà so_lieu_hoc đang hiện cho người dùng.
      when v_ngay_cu is distinct from v_hom_nay then 5
      else tim
    end,
    updated_at = now()
  where id = v_uid;

  update public.profiles
    set chuoi_dai_nhat = greatest(chuoi_dai_nhat, chuoi_hien_tai)
    where id = v_uid;

  return public.so_lieu_hoc();
end;
$$;

comment on function public.ghi_nhan_phien is
  'Ghi một phiên học: đánh dấu phần xong, cộng XP hôm nay, cập nhật chuỗi ngày và tim. Trả về số liệu mới.';

-- ============================================================================
-- so_lieu_hoc — mọi số liệu thanh bên cần, trong một lượt gọi
--
-- Gộp lại vì server là nơi duy nhất biết "hôm nay" theo múi giờ của người
-- dùng. Để client tự tính ngày rồi truy vấn ba bảng là mở đường cho lệch
-- ngày giữa máy và database.
--
-- Tim đã được điều chỉnh theo ngày: sang ngày mới là đầy lại 5. Quy tắc nằm ở
-- đây, không nằm ở client, nên hai bên không thể nói khác nhau.
-- ============================================================================
create or replace function public.so_lieu_hoc()
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_hom_nay date;
  v_hs      public.profiles;
begin
  if v_uid is null then
    raise exception 'Chưa đăng nhập';
  end if;

  v_hom_nay := public.ngay_cua(v_uid);
  select * into v_hs from public.profiles where id = v_uid;

  -- Hồ sơ do trigger handle_new_user tạo. Nếu vì lý do gì chưa có, trả về mặc
  -- định chứ không nổ: app vẫn chạy được, chỉ là chưa có gì để hiện.
  if v_hs.id is null then
    return jsonb_build_object(
      'chuoi', 0, 'chuoiDaiNhat', 0, 'tim', 5,
      'xpHomNay', 0, 'xpTong', 0, 'mucTieuXpNgay', 20,
      'daHocHomNay', false, 'daXong', '[]'::jsonb
    );
  end if;

  return jsonb_build_object(
    'chuoi',         case when v_hs.ngay_hoc_gan_nhat >= v_hom_nay - 1
                          then v_hs.chuoi_hien_tai else 0 end,
    'chuoiDaiNhat',  v_hs.chuoi_dai_nhat,
    'tim',           case when v_hs.ngay_hoc_gan_nhat = v_hom_nay
                          then v_hs.tim else 5 end,
    'xpHomNay',      coalesce((select xp from public.daily_activity
                               where user_id = v_uid and activity_date = v_hom_nay), 0),
    'xpTong',        coalesce((select sum(xp) from public.daily_activity
                               where user_id = v_uid), 0),
    'mucTieuXpNgay', v_hs.muc_tieu_xp_ngay,
    -- coalesce: nguoi moi co ngay_hoc_gan_nhat = NULL, ma NULL = date ra NULL
    -- chu khong ra false. Khong boc thi client nhan null va hien sai.
    'daHocHomNay',   coalesce(v_hs.ngay_hoc_gan_nhat = v_hom_nay, false),
    'daXong',        coalesce((
                       select jsonb_agg(jsonb_build_object(
                                'phanId', phan_id, 'huong', huong,
                                'xp', xp, 'soLan', so_lan))
                       from public.tien_do_phan where user_id = v_uid), '[]'::jsonb)
  );
end;
$$;

comment on function public.so_lieu_hoc is
  'Chuỗi ngày, tim, XP hôm nay, mục tiêu và danh sách phần đã xong — tính theo múi giờ của chính người dùng.';

-- ============================================================================
-- dat_muc_tieu_ngay — đổi mục tiêu XP mỗi ngày
-- ============================================================================
create or replace function public.dat_muc_tieu_ngay(p_xp integer)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Chưa đăng nhập';
  end if;
  if p_xp not in (10, 20, 30, 50) then
    raise exception 'Mục tiêu không hợp lệ: %', p_xp;
  end if;
  update public.profiles
    set muc_tieu_xp_ngay = p_xp, updated_at = now()
    where id = auth.uid();
  return public.so_lieu_hoc();
end;
$$;

-- ============================================================================
-- nap_lai_tim — người học chọn nạp lại giữa phiên
--
-- Duolingo chặn ở đây để bán tim. Tâm Đồ không bán gì, nên cho nạp lại miễn
-- phí; hàm này tồn tại để con số ở database khớp với con số trong bài.
-- ============================================================================
create or replace function public.nap_lai_tim()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Chưa đăng nhập';
  end if;
  update public.profiles set tim = 5, updated_at = now() where id = auth.uid();
  return public.so_lieu_hoc();
end;
$$;
