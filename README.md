# 🐓 Spurs Trivia Web App

A React-based trivia web application for Tottenham Hotspur fans to test their knowledge of the club. Features full user authentication, beautiful Spurs-themed UI, and comprehensive quiz tracking.

## 🌟 Features

### Authentication & User Management
- **Secure User Authentication** with Supabase Auth
- **Email/Password Registration** with email verification
- **User Profiles** with Spurs-specific fields (favorite player, etc.)
- **Protected Routes** - authentication required for app access
- **Session Management** with automatic login state persistence

### Quiz Experience
- **Interactive Quiz Taking** with multiple question types
- **Multiple Choice Questions** with instant feedback
- **Typing Questions** with intelligent answer checking
- **Progress Tracking** with visual indicators
- **Quiz History** with detailed performance analytics
- **Score Calculation** with percentage and feedback

### Quiz Library
- **Browse Quiz Library** with attractive card displays
- **Advanced Filtering** by categories, difficulty, quiz type, and speed quizzes
- **Real-time Search** by title, description, or category
- **Pagination** for easy navigation through multiple quizzes

### Design & UI
- **Responsive Design** optimized for all devices
- **Tottenham-themed Colors** (Navy #132257, Gold #FFD700)
- **Modern UI** built with Tailwind CSS
- **Beautiful Animations** and smooth transitions
- **Spurs Branding** throughout the application

## Components

- **QuizCard**: Individual quiz display with all metadata and start button
- **FilterPanel**: Comprehensive filtering options with collapsible interface
- **SearchBar**: Real-time search with clear functionality
- **QuizList**: Grid layout with pagination support

## Quiz Categories

- Premier League
- Players - Legends
- Players - Current
- History
- Stadium
- European Competition
- Derbies & Rivalries
- Tactics & Managers
- Academy
- Trophies
- Squad

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (for authentication and database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/spurs-trivia-app.git
   cd spurs-trivia-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the provided SQL migration in your Supabase SQL editor
   - Enable email authentication in Supabase Auth settings

5. **Start the development server**:
   ```bash
   npm start
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

### First Time Setup
- The app will show the login screen by default
- Click "Sign up here" to create your first account
- Check your email for verification
- Sign in and start taking quizzes!

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🛠️ Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for styling with custom Tottenham theme
- **Create React App** for build tooling
- **Modern ES6+ JavaScript**

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** (via Supabase) for data storage
- **Row Level Security (RLS)** for data protection

### Development Tools
- **ESLint** for code linting
- **React Hooks** for state management
- **Environment Variables** for configuration

## Sample Data

The app includes 10 hardcoded sample quizzes covering various aspects of Tottenham Hotspur:
- Club legends and current players
- Premier League history
- Stadium knowledge
- European competitions
- Derby matches
- Tactical knowledge
- Academy graduates
- Trophy history

## 🔐 Security

- **Environment Variables**: Sensitive data is stored in `.env` (not committed to git)
- **Supabase Authentication**: Industry-standard JWT-based auth
- **Row Level Security**: Database-level access controls
- **Input Validation**: Client and server-side validation
- **HTTPS Only**: Secure connections in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- **Dynamic Quiz Data**: Admin interface for quiz creation
- **Leaderboards**: Global and friend leaderboards
- **Social Features**: Share scores and challenge friends
- **Mobile App**: React Native version
- **Advanced Analytics**: Detailed performance insights
- **Quiz Categories**: Expandable quiz categories
- **Multiplayer**: Real-time quiz challenges

## 💙 COYS! 🐓⚽

Come On You Spurs!

---

**Made with ❤️ for Tottenham Hotspur fans everywhere**
