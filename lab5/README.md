# SBA301 - LAB 05: SINGLE PAGE APPLICATION WITH SPRING BOOT RESTFUL API

Ứng dụng Full-Stack quản lý hoa lan (**Orchid Management**) theo kiến trúc hiện đại:
- **Backend:** Spring Boot 3.4.3, Spring Data JPA, MS SQL Server, Maven, Java 21
- **Frontend:** ReactJS, Vite, Axios, React Router DOM, React Bootstrap 5
- **Giao thức tích hợp:** RESTful API với cấu hình CORS cho origin `http://localhost:5173`

---

## 1. Cấu trúc thư mục dự án

```text
lab5/
├── backend/                      # Backend Spring Boot 3
│   ├── pom.xml
│   └── src/main/
│       ├── java/fu/se/chapter15api/
│       │   ├── Chapter15apiApplication.java
│       │   ├── configs/CorsConfig.java
│       │   ├── controllers/OrchidController.java
│       │   ├── pojos/Orchid.java
│       │   ├── repositories/IOrchidRepository.java
│       │   └── services/
│       │       ├── IOrchidService.java
│       │       └── OrchidService.java
│       └── resources/application.properties
├── frontend/                     # Frontend ReactJS (Vite)
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── services/orchidApi.js
│       └── components/
│           ├── NavBar.jsx
│           ├── ListOfOrchids.jsx
│           ├── OrchidDetail.jsx
│           └── EditOrchid.jsx
└── README.md
```

---

## 2. Hướng dẫn chạy hệ thống (Quick Run Card)

### Bước 1: Khởi động SQL Server và Database
1. Mở SQL Server Management Studio (SSMS) hoặc Azure Data Studio.
2. Kiểm tra database `SBA301_OrchidDB`:
   ```sql
   IF DB_ID('SBA301_OrchidDB') IS NULL
       CREATE DATABASE SBA301_OrchidDB;
   GO
   USE SBA301_OrchidDB;
   GO
   ```

### Bước 2: Chạy Backend (Spring Boot)
1. Mở terminal và di chuyển vào thư mục backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. Backend sẽ khởi động tại: `http://localhost:8080`.
3. Kiểm tra nhanh API qua trình duyệt hoặc curl:
   ```bash
   curl http://localhost:8080/orchids/
   ```

### Bước 3: Chạy Frontend (React/Vite)
1. Mở terminal thứ 2 và di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   npm install        # Chỉ cần chạy lần đầu
   npm run dev
   ```
2. Mở trình duyệt tại: `http://localhost:5173`.

---

## 3. Danh sách Endpoint RESTful API

| Method | Endpoint | Mô tả | Mã phản hồi HTTP |
|---|---|---|---|
| `GET` | `/orchids/` | Lấy danh sách toàn bộ loài lan | `200 OK` |
| `GET` | `/orchids/{id}` | Lấy chi tiết lan theo ID | `200 OK` hoặc `404 Not Found` |
| `POST` | `/orchids/` | Thêm mới 1 loài lan | `201 Created` |
| `PUT` | `/orchids/{id}` | Cập nhật thông tin lan theo ID | `200 OK` hoặc `404 Not Found` |
| `DELETE` | `/orchids/{id}` | Xóa lan theo ID | `204 No Content` hoặc `404 Not Found` |
| `OPTIONS` | `/orchids/` | CORS Preflight check | `200 OK` (kèm header `Access-Control-Allow-Origin: http://localhost:5173`) |

---

## 4. End-to-End Request Flow & Trace

```text
Trình duyệt (React @ http://localhost:5173)
  │
  ▼
ListOfOrchids.jsx / EditOrchid.jsx
  │
  ▼
orchidApi.js (Axios Client với BaseURL = http://localhost:8080/orchids)
  │
  ▼ HTTP Request (GET/POST/PUT/DELETE)
CorsConfig.java (Kiểm tra Origin: http://localhost:5173)
  │
  ▼
OrchidController.java (@RestController @RequestMapping("/orchids"))
  │
  ▼
OrchidService.java (Xử lý nghiệp vụ & validation)
  │
  ▼
IOrchidRepository.java (Spring Data JPA)
  │
  ▼ Hibernate SQL Driver
Cơ sở dữ liệu Microsoft SQL Server (Bảng Orchid trong DB SBA301_OrchidDB)
  │
  ▲ (Trả kết quả dạng Entity -> JSON Response)
Trình duyệt nhận JSON -> React State re-render giao diện
```

---

## 5. Break-It → Diagnose → Fix Workshop

| Tình huống giả định | Triệu chứng | Chẩn đoán qua DevTools / Console | Cách khắc phục |
|---|---|---|---|
| **Sai URL API** (`.env` để port `9999`) | Không load được danh sách, giao diện báo lỗi | DevTools Network hiển thị `ERR_CONNECTION_REFUSED` | Sửa lại file `.env`: `VITE_API_URL=http://localhost:8080/orchids` và khởi động lại Vite server. |
| **Chặn CORS** (Chưa config origin `5173`) | Network request fail, console báo đỏ | DevTools Console báo `CORS policy: No 'Access-Control-Allow-Origin' header is present` | Cấu hình `CorsConfig.java` cho phép `.allowedOrigins("http://localhost:5173")` và restart Spring Boot. |
| **Truy vấn ID không tồn tại** | Click sửa/xóa ID đã bị xóa | Network trả HTTP `404 Not Found` | Backend xử lý trả về `ResponseEntity.notFound().build()`, Frontend hiển thị thông báo lỗi phù hợp. |
