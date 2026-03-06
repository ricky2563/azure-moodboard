# 🎨 MoodBoard AI

![Project Status](https://img.shields.io/badge/status-live-success)  
![Tech Stack](https://img.shields.io/badge/stack-Next.js_16_|_Azure_|_Tailwind-blue)

**A visual inspiration tool for designers, featuring an infinite canvas, drag-and-drop interactions, and cloud-native asset management.**

🔗 **Live Demo:** [https://azure-moodboard.vercel.app](https://azure-moodboard.vercel.app)

---

## 🚀 About The Project

MoodBoard AI is a web application designed to simulate professional tools like **Miro** or **Pinterest**. Unlike simple CRUD apps, it focuses on:

- Handling **unstructured visual data**.
- Maintaining **interactive UI states**.
- Providing **cloud-backed storage** for user assets.

It solves a common problem for creatives: gathering visual assets in a free-form canvas while ensuring everything is stored securely in the cloud.

---

## ✨ Key Features

- ☁️ **Cloud Storage:** Images are securely hosted on **Azure Blob Storage**.  
- 🖱️ **Drag & Drop Canvas:** Intuitive, physics-based interactions using `react-draggable`.  
- 📚 **Asset Library:** Reuse previously uploaded images via a modal connected to Azure.  
- 📝 **Sticky Notes:** Add and edit notes directly on the board.  
- ⚡ **Hybrid Architecture:** Frontend on **Vercel** for edge performance; backend storage on **Azure**.  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Lucide Icons.  
- **Backend / Cloud:** Azure Blob Storage (`@azure/storage-blob`), Next.js API Routes.  
- **Deployment:** Vercel (CI/CD).  
- **Language:** TypeScript.  

---

## ⚙️ Getting Started (Local Development)

To run this project locally, you need an **Azure Storage Account**.

### 1. Clone the repository
```bash
git clone https://github.com/ricky2563/azure-moodboard.git
cd azure-moodboard/moodboard-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Azure

Create a .env.local file in the root directory with your Azure Connection String:
```bash
AZURE_STORAGE_CONNECTION_STRING="your_azure_connection_string_here"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000
 to view the app.
