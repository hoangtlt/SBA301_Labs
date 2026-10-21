# SBA301 - Lab Assignments

Kho lưu trữ tổng hợp các bài thực hành môn **SBA301**.

---

## 📂 Danh sách các Lab

| Lab | Tên Đề Tài / Nội Dung | Công Nghệ |
|---|---|---|
| **[Lab 1](./lab1)** | Giới thiệu React & Component cơ bản | React, Vite, Tailwind CSS / Vanilla CSS |
| **[Lab 2](./lab2/orchid-gallery-spa)** | Orchid Gallery SPA | React, SPA, Vite, React Router / State |
| **[Lab 3](./lab3)** | Spring Boot Restful API cơ bản | Java, Spring Boot, Spring Data JPA, H2/MySQL |
| **[Lab 4](./lab4)** | Orchid Management Backend API | Java, Spring Boot, REST API, Validation, Swagger |
| **[Lab 5](./lab5)** | Full-Stack Orchid Management System | Spring Boot REST API + React Vite SPA |
| **[Lab 6](./lab6)** | Secure REST Services with JWT | Java 21, Spring Boot, Spring Security, JWT, SQL Server |

---

## 🛠️ Hướng Dẫn Chạy Dự Án

### Lab 5 (Full-Stack Orchid Management)

#### 1. Backend (Spring Boot)
```bash
cd lab5/backend
mvn spring-boot:run
```
API chạy tại: `http://localhost:8080` (Swagger UI: `http://localhost:8080/swagger-ui/index.html`)

#### 2. Frontend (React + Vite)
```bash
cd lab5/frontend
npm install
npm run dev
```
Giao diện chạy tại: `http://localhost:5173`

### Lab 6 (Spring Security & JWT)

Xem [hướng dẫn cấu hình SQL Server và JWT](./lab6/README.md), sau đó chạy:

```powershell
cd lab6
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```

API chạy tại `http://localhost:8005`. Khai báo `DB_USER`, `DB_PASSWORD` và `JWT_SECRET` trước khi khởi động.

---
*Tác giả: HoangTLT*
