-- ============================================================================
-- M5 — hai con số cho huy hiệu
--
-- Huy hiệu tính ở client từ số liệu sẵn có, không cần bảng riêng: suy ra thì
-- không bao giờ lệch với thực tế, còn lưu thành dòng thì có ngày lệch. Nhưng
-- hai con số dưới đây chỉ database mới biết, nên phải trả kèm.
--
--   soPhien   — tổng số phiên đã học, mọi ngày cộng lại
--   soNgayHoc — số ngày khác nhau đã học
--
-- Đổi lại: không ghi được "đạt huy hiệu lúc nào", nên chưa báo được khoảnh
-- khắc vừa đạt. Ghi vào backlog.
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
      'daHocHomNay', false, 'soPhien', 0, 'soNgayHoc', 0, 'daXong', '[]'::jsonb
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
    -- coalesce: người mới có ngay_hoc_gan_nhat = NULL, mà NULL = date ra NULL
    -- chứ không ra false. Không bọc thì client nhận null và hiện sai.
    'daHocHomNay',   coalesce(v_hs.ngay_hoc_gan_nhat = v_hom_nay, false),
    'soPhien',       coalesce((select sum(lessons_opened) from public.daily_activity
                               where user_id = v_uid), 0),
    'soNgayHoc',     (select count(*) from public.daily_activity
                      where user_id = v_uid and xp > 0),
    'daXong',        coalesce((
                       select jsonb_agg(jsonb_build_object(
                                'phanId', phan_id, 'huong', huong,
                                'xp', xp, 'soLan', so_lan))
                       from public.tien_do_phan where user_id = v_uid), '[]'::jsonb)
  );
end;
$$;

comment on function public.so_lieu_hoc is
  'Chuỗi ngày, tim, XP, mục tiêu, số phiên, số ngày học và danh sách phần đã xong — tính theo múi giờ của chính người dùng.';
