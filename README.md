﻿# React-Native-Expo-ToDoList-App
## 📌 To-Do List App
A powerful and user-friendly To-Do List Application built using React Native (Expo) for the frontend and Node.js with MongoDB for the backend. This app allows users to manage their tasks efficiently with features such as task creation, completion, deletion, prioritization, and authentication.

## 🚀 Features
- ✔️ User Authentication (Login/Logout using JWT)
- ✔️ Add, Edit, and Delete Tasks
- ✔️ Mark Tasks as Completed
- ✔️ Task Prioritization & Starred Tasks
- ✔️ Responsive UI with Light/Dark Mode
- ✔️ Secure API with Token-based Authentication
- ✔️ Realtime Task Updates from MongoDB

## 🏗️ Tech Stack
### 🖥️ Frontend
- **React Native (Expo)** – For cross-platform mobile development
- **React Navigation** – For handling screen navigation
- **Axios** – For API requests
- **AsyncStorage & SecureStore** – For storing user authentication tokens

### 🖥️ Backend
- **Node.js & Express.js** – For API development
- **MongoDB Atlas** – As the database for storing tasks and user data
- **JWT (JSON Web Tokens)** – For authentication

## 📁 Project Structure
- **/ToDoListApp**
- │── /frontend
- │   ├── /components
- │   │   ├── AddTaskButton.tsx
- │   │   ├── Header.tsx
- │   │   ├── TaskList.tsx
- │   ├── /screens
- │   │   ├── Home.tsx
- │   │   ├── SignIn.tsx
- │   │   ├── SignUp.tsx
- │   ├── /storage
- │   │   ├── authStore.ts
- │   ├── App.tsx
- │── /backend
- │   ├── /routes
- │   │   ├── tasks.js
- │   │   ├── auth.js
- │   ├── /models
- │   │   ├── Task.js
- │   │   ├── User.js
- │   ├── server.js
- │── .gitignore
- │── README.md
  
## 🔧 Setup & Installation
### Backend
- **1️⃣ Install Node.js and MongoDB Atlas**
- **2️⃣ Clone the repository:**
-- git clone https://github.com/your-repo/ToDoListApp.git
-- cd ToDoListApp/backend
- **3️⃣ Install dependencies:**
-- npm install
- **4️⃣ Create a .env file and add:**
-- env
-- MONGO_URI=your_mongodb_connection_string
-- JWT_SECRET=your_secret_key
-- PORT=5000
- **5️⃣ Run the server:**
-- npm start
### Frontend
- **1️⃣ Install Expo CLI if not already installed:**
-- npm install -g expo-cli
- **2️⃣ Navigate to the frontend folder:**
-- cd ../frontend
- **3️⃣ Install dependencies:**
-- npm install
- **4️⃣ Run the app:**
-- expo start
  
## 📌 API Endpoints
--  Method	Endpoint	Description
--  POST	/auth/signup	Register a new user
--  POST	/auth/login	Login and get token
--  GET	/tasks/	Get all tasks
--  POST	/tasks/	Add a new task
--  PATCH	/tasks/:id	Update task status
--  DELETE	/tasks/:id	Delete a task

🤝 Contributors
**Mithun Kumar** – Developer
- **email**= mithunkumarkulal33@gmail.com

Feel free to contribute! 🚀

📜 License
This project is licensed under the MIT License.
