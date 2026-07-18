# User Management System - Frontend

A modern, responsive user management dashboard built with React 18, Tailwind CSS, and Vite. Features include authentication, user management, team management, task management, role-based access control, and a beautiful UI with dark mode support.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Key Features Implementation](#key-features-implementation)
- [Browser Support](#browser-support)
- [Performance Optimizations](#performance-optimizations)

---

## Features

### 🔐 Authentication System
- Login with role-based credentials (Admin, Manager, Developer, Tester, Viewer)
- Register new users
- JWT token management with HttpOnly cookies
- Automatic token refresh
- Protected routes

### 👥 User Management
- View all users with pagination
- Create, edit, delete users
- Assign roles to users
- User status management (active/inactive)
- Search and filter users

### 🧑‍🤝‍🧑 Team Management
- Create, edit, delete teams
- Add/remove team members
- Team lead assignment
- Team statistics
- My Teams vs All Teams view with collapsible sections

### ✅ Task Management
- Create, edit, delete tasks
- Assign tasks to users
- Task status management (Pending, In Progress, Completed, Cancelled)
- Task priority levels (Low, Medium, High, Critical)
- My Tasks vs All Tasks view
- Task filtering by status, priority, team, and assignee
- Responsive task cards for mobile with expand/collapse

### 📊 Dashboard
- Statistics overview (Users, Teams, Tasks)
- Recent tasks activity
- Quick actions
- Real-time data from backend

### 🙍 Profile Management
- View and edit profile
- Change password
- View teams and permissions
- Avatar with initials

### 🛡️ Role-Based Access Control
| Role | Access Level |
|------|---------------|
| **Admin** | Full access |
| **Manager** | Team management access |
| **Developer** | Task creation and work permissions |
| **Tester** | Task testing permissions |
| **Viewer** | Read-only access |

Permission-based UI rendering ensures each role only sees actions and pages relevant to their access level.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS (v4) |
| Routing | React Router v6 |
| State Management | React Context API |
| HTTP Client | Axios (with interceptors) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Authentication | JWT with HttpOnly cookies |

---

## Project Structure

```
src/
├── api/
│   └── axios.js                # Axios configuration with interceptors
├── components/
│   ├── Navbar.jsx               # Main navigation with mobile slide-out menu
│   ├── ProtectedRoute.jsx       # Route protection
│   ├── common/                  # Reusable components
│   │   ├── ConfirmDialog.jsx
│   │   └── LoadingSpinner.jsx
│   ├── tasks/                   # Task components
│   │   ├── TaskStats.jsx
│   │   ├── TaskStatusBadge.jsx
│   │   └── TaskPriorityBadge.jsx
│   └── teams/                   # Team components
│       ├── TeamStats.jsx
│       └── TeamMembers.jsx
├── context/
│   └── AuthContext.jsx          # Authentication context
├── hooks/
│   ├── useAuth.js                # Auth hook
│   ├── useUsers.js               # User management hook
│   ├── useTeams.js               # Team management hook
│   └── useTasks.js               # Task management hook
├── layouts/
│   ├── MainLayout.jsx            # Main application layout
│   └── AuthLayout.jsx            # Authentication layout
├── pages/
│   ├── auth/                     # Authentication pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── users/                    # User pages
│   │   ├── Users.jsx
│   │   ├── UserDetails.jsx
│   │   ├── CreateUser.jsx
│   │   └── EditUser.jsx
│   ├── teams/                    # Team pages
│   │   ├── Teams.jsx
│   │   ├── TeamDetails.jsx
│   │   ├── CreateTeam.jsx
│   │   └── EditTeam.jsx
│   ├── tasks/                    # Task pages
│   │   ├── Tasks.jsx
│   │   ├── TaskDetails.jsx
│   │   ├── CreateTask.jsx
│   │   └── EditTask.jsx
│   ├── Dashboard.jsx              # Dashboard page
│   └── Profile.jsx                # User profile page
├── services/
│   ├── user.service.js            # User API calls
│   ├── team.service.js            # Team API calls
│   └── task.service.js            # Task API calls
├── utils/
│   ├── auth.js                    # Auth utilities
│   └── token.js                   # Token management
├── App.jsx                        # Main app component
├── AppRouter.jsx                  # Routing configuration
└── index.css                      # Global styles with Tailwind v4
```

---

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` by default (Vite's default port).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot module replacement |
| `npm run build` | Builds the app for production |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Runs the linter to check code quality |

---

## Environment Variables

Create a `.env` file in the root of the project based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=User Management System
```

| Variable | Description |
|----------|--------------|
| `VITE_API_URL` | Base URL for the backend API |
| `VITE_APP_NAME` | Display name of the application |

---

## Key Features Implementation

### Authentication Flow

1. User logs in with credentials
2. Server sets HttpOnly cookies (`accessToken`, `refreshToken`)
3. Axios interceptor handles token refresh automatically
4. Protected routes redirect to login if unauthenticated
5. Role-based UI rendering

### API Integration

- Axios instance with automatic token refresh
- Request/response interceptors
- Error handling with toast notifications
- Credentials included for cookie-based auth

### Responsive Design

- Mobile-first approach
- Slide-out navigation from right (70% width)
- Collapsible sections
- Responsive tables and cards
- Touch-friendly interactions
- Dark mode support

### State Management

- React Context for global state
- Custom hooks for data fetching
- Local state for UI interactions
- Optimistic updates where applicable

### Security Features

- HttpOnly cookies for token storage
- JWT authentication
- Role-based access control
- Protected routes
- Input validation
- CORS configuration

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

---

## Performance Optimizations

- Lazy loading with React Router
- Code splitting with Vite
- Optimized bundle size
- Memoized components
- Debounced search inputs

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.