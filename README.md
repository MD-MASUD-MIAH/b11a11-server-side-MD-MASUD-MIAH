# SpeakFlow Server 🔧

This is the **backend/server-side** codebase for the [SpeakFlow] blog platform. It handles authentication, user management, blog storage, wishlist, comments, and more using Node.js, Express, MongoDB, Firebase, and JWT.

---

## 🌐 Live API

> 🌍 **Base URL:** `https://blogsite-b11a11-server.vercel.app`  


---

## 🎯 Purpose

The backend provides secure and structured APIs for the SpeakFlow frontend, including:
- Blog CRUD operations
- User authentication (Firebase)
- Wishlist & comment management
- JWT-based route protection

---

## ⚙️ Technologies & Packages Used

| Package       | Purpose                                      |
|---------------|----------------------------------------------|
| **Express.js**| Web server framework                         |
| **MongoDB**   | NoSQL database for storing all data          |
| **Firebase Admin SDK** | User identity and token verification |
| **JWT**       | JSON Web Token for securing protected routes |
| **CORS**      | Cross-origin resource sharing                |
| **dotenv**    | Manage environment variables securely        |
| **nodemon** *(dev)* | Auto-restart server on changes         |

---

🔐 Environment Variables

MONGODB_URL = ..
FB_SERVICE_KEY = ..


📢 API Endpoints (Simple Overview)

GET /blogs → All public blogs

GET /blogs/:id → Blog by ID

POST /blogs → Create a new blog

PATCH /blogs/:id → Update blog

DELETE /blogs/:id → Delete blog

GET /wishlist?email= → User's wishlisted blogs

POST /wishlist → Add to wishlist

DELETE /wishlist/:id → Remove from wishlist

POST /comments → Add a comment

GET /comments/:blogId → Get comments for a blog

