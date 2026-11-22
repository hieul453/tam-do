-- ============================================================================
-- M5 — đặt lại tiến độ của chính mình
--
-- Dùng để diễn lại bản demo từ đầu mà không phải tạo tài khoản mới.
--
-- security invoker + mọi lệnh đều ràng auth.uid(): người này chỉ xoá được dữ
-- liệu của chính họ. Hàm xoá mà chạy security definer thì chỉ cần một lỗi
-- nhỏ ở mệnh đề where là xoá sạch của người khác.
-- ============================================================================

create or replace function public.dat_lai_tien_do()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Chưa đăng nhập';
  end if;

  delete from public.tien_do_phan where user_id = v_uid;
  delete from public.daily_activity where user_id = v_uid;

  update public.profiles set
    tim = 5,
    chuoi_hien_tai = 0,
    chuoi_dai_nhat = 0,
    ngay_hoc_gan_nhat = null,
    updated_at = now()
  where id = v_uid;
  -- Mục tiêu ngày giữ nguyên: đó là tuỳ chọn, không phải tiến độ.

  return public.so_lieu_hoc();
end;
$$;

comment on function public.dat_lai_tien_do is
  'Xoá sạch tiến độ của chính người gọi: XP, chuỗi ngày, phần đã xong. Giữ tài khoản và mục tiêu ngày.';
