# FarhanBlog

**Farhan's Blog App** is a full-stack MERN-powered platform for effortless content creation and user interaction. It features secure authentication, rich content tools, and a seamless, dynamic blogging experience.

---

### Live Demo

[🔗 View Live Demo](https://farhanblog.vercel.app)


### Built By
**Farhan** – MERN Stack & Next.js Developer. 

[🔗 Portfolio](https://farhandev.vercel.app)

## 🚀 Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Clerk
- **Image Hosting**: ImageKit

---

## ✨ Features

- 📝 Create, edit, and delete blog posts with rich content formatting
- 🔐 Secure user authentication via Clerk
- 🖼️ Post Cover images are being stored in ImageKit
- 💾 Persistent blog storage using MongoDB
- ⚡ Dynamic data fetching and caching with TanStack Query
- 🧑‍💻 Clean and modern UI
---

## 📦 Getting Started

Clone the repo:

```bash
git clone https://github.com/your-username/farhanblog.git
cd farhanblog
```

### Frontend Setup
Go to the frontend folder and install dependencies
```bash
cd frontend
npm install
```

Set up your environment variables in a .env file:
```bash
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_url
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_B&nbsp;&nbsp;ACKEND_URL=http://localhost:5000  # or your deployed backend URL
```
Run the development server:

```bash
npm run dev
```
### Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd ../backend
npm install
```
Create a ```.env``` file inside ```./backend``` folder with the following keys:
```bash
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
CLIENT_URL=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_URL_ENDPOINT=
MONGODB_URI=
```
Run the backend server:
```bash
npm run dev
```
