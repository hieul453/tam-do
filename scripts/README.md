# scripts/

Công cụ dùng chung cho việc vibe-code dự án này. Chúng từng nằm trong `.git/`
— chạy được nhưng **git không theo dõi**, nên clone lại repo là mất sạch. Để ở
đây thì chúng sống cùng dự án.

| | |
|---|---|
| `sql.mjs` | Chạy SQL trên Supabase qua Management API, đọc từ file để shell không làm hỏng dấu nháy |
| `nhan-tep.mjs` | Cổng nhận tệp cục bộ, để lấy dữ liệu nhị phân ra khỏi trình duyệt mà không qua base64 |

Cả hai lấy token từ kho DPAPI ở `%LOCALAPPDATA%\ai-tokens`, không đọc gì trong repo.
