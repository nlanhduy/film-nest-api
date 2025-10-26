# Promtail → Loki → Grafana (tail `./logs`)

Tài liệu này hướng dẫn cách cấu hình Promtail để tail các file log trong thư mục `./logs` của project và gửi vào Loki, sau đó dùng Grafana để visualize.

Mục tiêu:

- Promtail đọc file `./logs/*.log` và push lên Loki (`http://loki:3100`).
- Grafana kết nối tới Loki để xem logs.

Nội dung:

- Files đã thêm / chỉnh
- Cách chạy (PowerShell)
- Cách kiểm tra / debug
- Tùy chọn: parse JSON, pattern, notes

---

## Files liên quan (đã có trong project)

- `promtail-config.yaml` — cấu hình Promtail (ở root)
- `docker-compose.yml` — có service `loki`, `grafana`, `promtail` (Promtail mount `./logs`)
- `loki-config.yaml` — config Loki (nếu dùng local filesystem)

Nếu bạn chưa có những file này, xem phần "Cách chạy" để tạo hoặc yêu cầu mình tạo file tự động.

---

## promtail-config.yaml (hiện có)

Promtail đã được cấu hình để tail tất cả file `*.log` trong thư mục `/logs` (container path). File config nằm ở `promtail-config.yaml`.

Chú ý: Promtail container sẽ mount `./logs` của project vào `/logs` trong container; do đó `__path__: /logs/*.log` sẽ match các file log trong thư mục project `logs`.

Nếu log của bạn là JSON (structured), bạn có thể bật `pipeline_stages` để parse và extract các trường (ví dụ `level`, `message`, `timestamp`). Trong `promtail-config.yaml` mình để sẵn commented example để tiện bật.

---

## Chạy (PowerShell)

1. Start Loki, Grafana và Promtail:

```powershell
docker-compose up -d loki grafana promtail
```

2. Kiểm tra containers chạy:

```powershell
docker-compose ps
```

3. Kiểm tra Loki sẵn sàng (cần chờ một thời gian -15s để container của Loki sẵn sàng):

```powershell
curl http://localhost:3100/ready
# expected: ready
```

4. Kiểm tra logs của Promtail để xác nhận nó khởi thành công và mở file:

```powershell
docker logs film-promtail --tail 200
docker exec -it film-promtail ls -la /logs
docker exec -it film-promtail tail -n 50 /logs/app-2025-10-23.log
```

5. Ghi thử 1 dòng vào file log (test):

```powershell
Add-Content -Path .\logs\app-2025-10-23.log -Value '{"level":"info","timestamp":"'"$(Get-Date -Format o)"'","message":"promtail test message"}'
```

6. Mở Grafana (ví dụ `http://localhost:3001`) → Explore → chọn datasource `Loki` → query:

```
{app="film-nest-api"}
```

Hoặc filter bằng job/label bạn cấu hình trong `promtail-config.yaml` (mình set `job: film-logs`, `app: film-nest-api`).

---

## Troubleshooting (nếu không thấy logs)

- Kiểm tra Promtail logs:

```powershell
docker logs film-promtail --tail 200
```

- Kiểm tra Promtail có thấy files trong `/logs`:

```powershell
docker exec -it film-promtail ls -la /logs
```

- Kiểm tra Loki ready:

```powershell
curl http://localhost:3100/ready
```

- Kiểm tra Grafana datasource (cần user/pass admin):

```powershell
curl -s -u admin:admin http://localhost:3001/api/datasources | ConvertFrom-Json
```

- Kiểm tra logs trực tiếp từ Loki (ví dụ tìm message test):

```powershell
curl -s "http://localhost:3100/loki/api/v1/query_range?query={app=\"film-nest-api\"}|=promtail%20test%20message&limit=20"
```

---

## Parse JSON logs (optional)

Nếu file log có dòng là JSON, bạn có thể bật `pipeline_stages` để Promtail parse. Ví dụ (in `promtail-config.yaml`):

```yaml
pipeline_stages:
  - json:
      expressions:
        level: level
        msg: message
        ts: timestamp
  - timestamp:
      source: ts
      format: RFC3339
```

Sau khi bật, trong Grafana bạn có thể dùng `| json` để parse fields và filter theo `level`:

```
{app="film-nest-api"} | json | level="info"
```

---

## Notes & Security

- Promtail cần quyền đọc thư mục `./logs`; ta mount với `:ro` trong `docker-compose.yml` để an toàn.
- Nếu bạn triển khai production, cân nhắc storage backend cho Loki (S3/Cloud) và bật authentication cho Grafana/Loki.

---

Nếu bạn muốn, mình có thể:

- Thêm `pipeline_stages` vào `promtail-config.yaml` để tự parse JSON từ log hiện tại.
- Tạo một Grafana dashboard mẫu và provision nó.

Hoặc mình có thể chạy các lệnh kiểm tra giúp bạn (ví dụ `docker-compose up -d promtail`) nếu bạn cho phép.
