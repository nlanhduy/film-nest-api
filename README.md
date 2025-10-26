# 🎬 Film API

A RESTful API built with **NestJS** and **TypeScript**.  
This guide explains how to install, run, test, and build the project.

---

## ⚙️ Requirements

- **Node.js** ≥ 18.x  
- **npm** or **yarn**  
- (Optional) **Nest CLI** for easier development:
  ```bash
  npm install -g @nestjs/cli
  ```

---

## 🚀 Setup & Run

### 1️⃣ Install dependencies
```bash
npm install
```
or
```bash
yarn install
```

---

### 2️⃣ Create an `.env` file
Add your environment variables as needed:
```env
LOKI_ENABLED=true
LOKI_HOST=http://localhost:3100
NODE_ENV=development
DATABASE_URL=
```

---

### 3️⃣ Run the app

#### Development mode (auto reload)
```bash
npm run dev
```

#### Watch + Debug mode
```bash
npm run start:debug
```

#### Production mode
```bash
npm run build
npm run start:prod
```

---

## 📚 API Documentation

When running locally, open:
```
http://localhost:3000/api
```
to view the **Swagger API documentation**.

---

## 👤 Authors

- 22127086 - Nguyễn Lâm Anh Duy  
- 22127277 - Võ Thị Hồng Minh
