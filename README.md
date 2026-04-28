<<<<<<< HEAD
# profile-app-raj
Simple js application to view profile details instead of physical resume
=======
# Profile App

A simple React application for building and sharing a public profile/resume. Authentication has been removed in this branch — the app stores profile data locally by default and provides an optional example backend for persistence.

## Features

- Profile and resume sections (summary, skills, experience, education, projects)
- Editable profile with local persistence (`localStorage`)
- Shareable read-only profile link and QR code
- Responsive design and clean UI
- Optional backend-ready API (Express example)

## Project Structure

```
profile-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   └── Profile.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── Navbar.css
│   │   ├── Dashboard.css
│   │   └── Profile.css
│   ├── App.js
│   └── index.js
├── server/
│   ├── index.js
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd profile-app
```

2. Install dependencies:
```bash
npm install
```

### Running the App (development)

Start the frontend development server:
```bash
npm start
```

Run the example backend (optional):
```bash
cd server
npm install
npm start
# backend runs on http://localhost:4000 by default
```

The frontend will open in your browser at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create an optimized production build:
```bash
npm run build
```

## Pages

### Home Page (`/`)
Landing page with feature highlights and navigation buttons

### Dashboard (`/dashboard`)
Main dashboard showing user info, quick stats, and activity.

### Profile (`/profile`)
Editable profile/resume with sections for summary, skills, experience, education, projects, and certifications.

## Authentication

This branch removes the login/signup flow. The app uses a simplified auth context that provides a default `user` object and keeps compatibility with components. Integrate a real auth/backend later if needed.

## Technologies Used

- React 18
- React Router v6
- Context API (State Management)
- CSS3 (Styling)
- HTML5

## Available Scripts

- `npm start`: Run the development server
- `npm run build`: Create a production build
- `npm test`: Run tests
- `npm eject`: Eject from Create React App (irreversible)

## Future Enhancements

- Backend API integration (optional)
- Database persistence
- Real user authentication
- Email verification and password reset

## License

This project is open source and available under the MIT License.
>>>>>>> 2624742 (Initial commit — profile app)
