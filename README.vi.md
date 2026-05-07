# My Portfolio Blog

Không gian cá nhân để trình bày hành trình nghề nghiệp và kỹ thuật. A personal space to showcase my journey, featuring automated CV rendering and technical blogging.

## Vấn đề

Nhiều kỹ sư phần mềm không có một nơi tập trung, dễ duy trì để:

- Trưng bày dự án và tiến trình nghề nghiệp;
- Giữ CV luôn cập nhật và xuất sang PDF khi cần;
- Lưu trữ và chia sẻ bài viết kỹ thuật một cách có tổ chức.

## Mục tiêu

- Trưng bày hành trình cá nhân và các dự án tiêu biểu.
- Cung cấp cơ chế xuất CV tự động (PDF) từ dữ liệu trong dự án.
- Lưu trữ và xuất bản bài viết kỹ thuật (blog).
- Hỗ trợ đa ngôn ngữ (EN / VI) và dễ triển khai bằng Vite + TypeScript.

## Tính năng chính

- Xuất CV sang PDF / in từ giao diện (CV export).
- Trang blog kỹ thuật với nội dung có thể quản lý trong mã nguồn.
- Trang portfolio với bộ lọc, chế độ hiển thị gọn (compact) và modal chi tiết dự án.
- Thiết lập và tuỳ chỉnh giao diện qua `Settings` (SettingsModal).

## Công nghệ

- Vite + React + TypeScript
- Tailwind CSS, PostCSS
- jsPDF / pdfjs-dist / react-to-print (xuất PDF)
- Supabase client (tùy chọn tích hợp dữ liệu)

## Chạy nhanh (Quick start)

1. Cài đặt phụ thuộc:

```bash
npm install
```

2. Chạy môi trường phát triển:

```bash
npm run dev
```

3. Sinh bản build và xem trước:

```bash
npm run build
npm run preview
```

## Cấu trúc chính

- [src/](src/) — mã nguồn React, component và trang.
- [data/](data/) — nội dung portfolio và blog (`portfolio.en.ts`, `portfolio.vi.ts`, `blog.en.ts`, `blog.vi.ts`).
- [i18n/](i18n/) — chuỗi dịch EN/VI cho các component.

## Cập nhật nội dung

- Sửa thông tin cá nhân và danh sách dự án trong [data/portfolio.\*.ts](data/).
- Thêm hoặc sửa bài viết trong [data/blog.\*.ts](data/).
- Giao diện và logic nằm ở [src/components/](src/components/).
