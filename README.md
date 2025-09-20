# Real-Time-Employee-Task-Management-Tool
Real-time employee task management tool with secure login, role-based access, employee management, task assignment, and real-time messaging.
## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Screenshots](#screenshots)

## Features
- **User Authentication:** Secure login/logout with role-based access (manager/employee)
- **Employee Management:** Managers can add, edit, remove employees and view assigned tasks
- **Task Management:** Create, assign, and track tasks in real-time
- **Real-time Messaging:** Managers can chat with employees instantly
- **Live Updates:** Task status and messages update dynamically for all connected users

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express
- Database: Firebase / Firestore
- Authentication: Firebase Auth
- Realtime: Firebase Realtime Database / Firestore

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/1uisngxn/Real-Time-Employee-Task-Management-Tool.git
2. Install dependencies:
   ```bash
   npm install
3. Setup Firebase config in .env file
4. Start the app:
  # Start backend
   cd employee-management/src/backend
   npm start
   # Start frontend
   cd employee-management
   npm start
## Environment Setup
1. Create a .env file in the root directory. Example:
PORT=5000
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
MOCK_MODE=true
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
SENDGRID_API_KEY=your_sendgrid_key_here
FROM_EMAIL=your_email@example.com
2. Firsebase Setup
   - Go to Firebase Console
   - Create a new project
   - Enable Authentication, Firestore Database, and Realtime Database
   - Generate a service account key from Project Settings → Service Accounts
   - Save it as employee-management/src/backend/serviceAccountKey.json
   - Update your .env file to point to this file
## Usage
- **Owner: Can manage employees, assign and monitor tasks, chat with employees in real-time.
- **Employee: Can view assigned tasks, update task status, and chat with owner.
## Screenshots
**Default path** 
<img width="1870" height="1007" alt="image" src="https://github.com/user-attachments/assets/0f2ddffc-0923-4f28-bdc8-4b2a3b70c76f" />

**Role Owner**
*Login Owner* 
<img width="1872" height="1003" alt="image" src="https://github.com/user-attachments/assets/c96e339d-606b-45e9-971f-42d3e549e030" />
*Mock OTP*
<img width="1871" height="1003" alt="image" src="https://github.com/user-attachments/assets/273a7760-a2ef-4142-8fbb-1cdaa48aa0c3" />
*Validate OTP*
<img width="1874" height="1008" alt="image" src="https://github.com/user-attachments/assets/85be7bfa-6af3-4277-9e03-893c88699daf" />
*Dashboard Owner*
<img width="1871" height="1005" alt="image" src="https://github.com/user-attachments/assets/62af6506-6119-48aa-85b1-7bd5d4e2efa2" />
*Create Employee*
<img width="1871" height="1005" alt="image" src="https://github.com/user-attachments/assets/de321f4d-54bd-4955-a58c-6d9908754b86" />
*Send email*
<img width="1872" height="1004" alt="image" src="https://github.com/user-attachments/assets/25b2b2c6-5912-4be6-a6fd-22f878812766" />
*Edit Employee*
<img width="1870" height="1007" alt="image" src="https://github.com/user-attachments/assets/c0766050-bc96-47ad-969d-0d71e8a94128" />
*Delete Employee*
<img width="1875" height="1003" alt="image" src="https://github.com/user-attachments/assets/8098abd4-6524-4306-9fa5-35dc25e6be92" />
*Manage Task*
<img width="1875" height="1003" alt="image" src="https://github.com/user-attachments/assets/b2d6e3b6-5e0e-44f0-ac21-296339bbecb5" />
*Create Task*
<img width="1869" height="1003" alt="image" src="https://github.com/user-attachments/assets/8928f19d-ba38-41a3-91ad-4acc5a2330e3" />
*Message*
<img width="1875" height="1007" alt="image" src="https://github.com/user-attachments/assets/1da9accd-3737-4285-b6b6-8a79d7ae1d31" />

**Role Employee**
*Setup Account*
<img width="1872" height="1006" alt="image" src="https://github.com/user-attachments/assets/718e0f78-980f-48b8-9c11-941c9a929d80" />
*Send OTP to email*
<img width="1875" height="1004" alt="image" src="https://github.com/user-attachments/assets/c6711aea-f877-4c9d-b61d-d54579650d40" />
*Setup username / password *
<img width="1875" height="1008" alt="image" src="https://github.com/user-attachments/assets/d0756cd1-6fd5-409d-8fa8-afddcfc501b1" />
*Login employee*
<img width="1870" height="1003" alt="image" src="https://github.com/user-attachments/assets/dd72e645-2daf-4fa9-b201-3c2ec28eacbd" />
*Dashboard Employee*
<img width="1868" height="1005" alt="image" src="https://github.com/user-attachments/assets/e9671f7f-17d9-4239-a37a-2266c59540c4" />
*Edit profile*
<img width="1871" height="1006" alt="image" src="https://github.com/user-attachments/assets/48ca0a50-b28f-4e7d-8c21-2dfbaab22537" />
*Message*
<img width="1872" height="1006" alt="image" src="https://github.com/user-attachments/assets/e82153ea-e157-45d7-bfe9-4db7fa82f1fc" />










