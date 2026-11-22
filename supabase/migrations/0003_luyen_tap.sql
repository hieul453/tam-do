-- ============================================================================
-- M4 — XP cho phiên luyện tập
--
-- Luyện tập trộn câu hỏi từ nhiều phần đã học nên không thuộc phần nào cả.
-- Dùng ghi_nhan_phien thì phải bịa ra một phan_id giả và làm bẩn bảng
-- tien_do_phan; một hàm riêng rẻ hơn và nói đúng việc nó làm.
-- ============================================================================

create or replace function public.ghi_nhan_luyen_tap(
  p_xp          integer,
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

  p_xp := greatest(0, least(coalesce(p_xp, 0), 500));
  if p_tim_con_lai is not null then
    p_tim_con_lai := greatest(0, least(p_tim_con_lai, 5));
  end if;

  v_hom_nay := public.ngay_cua(v_uid);
  select ngay_hoc_gan_nhat into v_ngay_cu from public.profiles where id = v_uid;

  insert into public.daily_activity (user_id, activity_date, xp, lessons_opened)
  values (v_uid, v_hom_nay, p_xp, 1)
  on conflict (user_id, activity_date) do update
    set xp = public.daily_activity.xp + excluded.xp,
        lessons_opened = public.daily_activity.lessons_opened + 1;

  -- Luyện tập cũng giữ chuỗi ngày. Đó là điểm của nó: hôm nào không có thời
  -- gian học phần mới thì vẫn ôn được năm phút và không đứt chuỗi.
  update public.profiles set
    chuoi_hien_tai = case
      when v_ngay_cu = v_hom_nay then chuoi_hien_tai
      when v_ngay_cu = v_hom_nay - 1 then chuoi_hien_tai + 1
      else 1
    end,
    ngay_hoc_gan_nhat = v_hom_nay,
    tim = case
      when p_tim_con_lai is not null then p_tim_con_lai
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

comment on function public.ghi_nhan_luyen_tap is
  'Ghi một phiên luyện tập: cộng XP hôm nay, giữ chuỗi ngày, cập nhật tim. Không gắn vào phần nào.';
