# Portfolio Website

A modern, full-stack portfolio application built with Next.js and Express.js. Features include dynamic content management, secure authentication, contact form with email notifications, and a comprehensive admin dashboard for content updates.

## Overview

This project demonstrates a production-ready architecture with a decoupled frontend and backend, suitable for personal portfolios, agency websites, or small business web applications.

### Key Features

- **Dynamic Content Management** - Full CRUD operations for projects, skills, and achievements
- **Secure Admin Panel** - JWT-based authentication with protected routes
- **Contact Form Integration** - Email notifications with support for SMTP and SendGrid API
- **File Upload System** - Image handling for projects and profile pictures
- **Responsive Design** - Mobile-first UI built with Tailwind CSS
- **RESTful API** - Well-structured backend with comprehensive error handling
- **Production Ready** - Configured for deployment on Vercel (frontend) and Render (backend)

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **Font Awesome** - Icon library

### Backend
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **Nodemailer / SendGrid** - Email service integration
- **Multer** - File upload middleware
- **Helmet & CORS** - Security middleware

## Project Structure

```
Portfolio-Sajin/
├── frontend/sajxx/
│   ├── src/
│   │   ├── app/              # Next.js pages and layouts
│   │   ├── components/       # Reusable React components
│   │   └── lib/              # Utilities and configurations
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/sajxx/
│   ├── controllers/          # Business logic
│   ├── models/               # Database schemas
│   ├── routes/               # API endpoints
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Helper functions
│   ├── uploads/              # File storage
│   └── package.json
│
└── docs/                     # Documentation
```

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB (local installation or MongoDB Atlas account)
- Package manager (npm or yarn)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sajxx/Portfolio-Sajxx.git
   cd Portfolio-Sajin
   ```

2. **Backend setup**
   ```bash
   cd backend/sajxx
   npm install
   cp .env.example .env  # Create your environment file
   # Configure .env with your credentials (see Configuration section)
   ```

3. **Frontend setup**
   ```bash
   cd ../../frontend/sajxx
   npm install
   cp .env.local.example .env.local  # Create your environment file
   # Configure .env.local with API URL
   ```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/sajxx/` directory with the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration (choose one method)
# Option 1: SMTP (not recommended for Render free tier)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Option 2: SendGrid API (recommended for Render free tier)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_ADDRESS=your_verified_sender@example.com

# Notification Settings
CONTACT_NOTIFICATION_EMAIL=where_you_receive_messages@example.com

# Frontend URL
FRONTEND_BASE_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin

# File Upload
MAX_FILE_SIZE=5242880
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/sajxx/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, update this to your deployed backend URL.

## Development

### Running Locally

Start both servers in development mode with hot-reload enabled:

**Terminal 1 - Backend:**
```bash
cd backend/sajxx
npm run dev
```
Server runs at `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend/sajxx
npm run dev
```
Application runs at `http://localhost:3000`

### Production Build

**Frontend:**
```bash
cd frontend/sajxx
npm run build
npm start
```

**Backend:**
```bash
cd backend/sajxx
npm start
```

## 📦 Features

- **Dynamic Portfolio Content**: Projects, skills, and achievements management
- **Contact Form**: With email notifications
- **Admin Dashboard**: Manage all content through a web interface
- **Authentication**: JWT-based secure admin access
- **File Uploads**: Image upload support for projects and profile
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (React 19)
- Tailwind CSS 4
- Axios for API calls
- Font Awesome icons

### Backend
- Express.js 5
- MongoDB with Mongoose
- JWT authentication
- Nodemailer / SendGrid for emails
- Multer for file uploads
- Helmet & CORS for security

## API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Retrieve profile information |
| GET | `/api/projects` | Get all projects |
| GET | `/api/skills` | Get all skills |
| GET | `/api/achievements` | Get all achievements |
| POST | `/api/contact` | Submit contact form |

### Protected Endpoints

Requires `Authorization: Bearer <token>` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin authentication |
| PUT | `/api/profile` | Update profile |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/skills` | Create new skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| POST | `/api/achievements` | Create new achievement |
| PUT | `/api/achievements/:id` | Update achievement |
| DELETE | `/api/achievements/:id` | Delete achievement |

## Deployment

### Frontend Deployment (Vercel)

1. Import your repository in Vercel dashboard
2. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy (automatic on subsequent pushes to main branch)

### Backend Deployment (Render)

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure environment variables (all variables from `.env`)
4. **Important**: For Render's free tier, SMTP may be unreliable. Use SendGrid API instead:
   - Set `SENDGRID_API_KEY`
   - Set `FROM_ADDRESS` to your verified sender email
5. Deploy

### Email Configuration for Production

**Recommended**: Use SendGrid API (works reliably on Render free tier)
- Sign up at [SendGrid](https://sendgrid.com)
- Verify a Single Sender or authenticate your domain
- Generate an API key with Mail Send permissions
- Add `SENDGRID_API_KEY` and `FROM_ADDRESS` to environment variables

**Alternative**: SMTP (may not work on some free hosting platforms)
- Configure SMTP credentials in environment variables
- Note: Port 25 and 587 are often blocked on free tiers

## Security Considerations

- All sensitive credentials are stored in environment variables
- JWT tokens are used for authentication
- CORS is configured to accept requests only from trusted origins
- Helmet middleware provides additional security headers
- File uploads are validated and size-limited
- Rate limiting is implemented on API endpoints

**Important**: Never commit `.env` files or expose API keys in client-side code.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/sajxx/Portfolio-Sajxx/issues) if you want to contribute.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Environment Setup Required

This application requires environment configuration files to function properly:

### Required Files

- `backend/sajxx/.env` - Backend configuration (database, authentication, email)
- `frontend/sajxx/.env.local` - Frontend configuration (API URL)

### Setup Instructions

1. Copy the environment variable templates from the Configuration section above
2. Create the respective `.env` files in each directory
3. Replace placeholder values with your actual credentials
4. Ensure these files are listed in `.gitignore` (they are by default)
5. For deployment, configure the same variables in your hosting platform's environment settings

The application will not start without these configuration files. Refer to the Configuration section for complete templates and required variables.
