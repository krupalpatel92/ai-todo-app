# Secured TODO App with Local Authentication and AI Voice Agent

A production-grade React Native TODO application with biometric authentication, built with Expo for Paidy's technical assessment.

## Tech Stack

- **Framework**: React Native with Expo (managed workflow)
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router v3+ (file-based routing)
- **State Management**: Zustand + TanStack Query v5
- **Authentication**: expo-local-authentication (Biometric/PIN)
- **Styling**: React Native StyleSheet with centralized theme
- **Forms**: React Hook Form + Zod validation
- **Storage**: AsyncStorage (local persistence)
- **Animations**: React Native Reanimated
- **Testing**: Jest + React Native Testing Library

## Features

### Current Features

- ✅ Biometric authentication (Face ID, Touch ID, PIN)
- ✅ Secure TODO management (Create, Read, Update, Delete)
- ✅ Date-based TODO categorization (Today, Tomorrow, Other)
- ✅ Offline-first architecture with local storage
- ✅ Smooth animations and transitions
- ✅ Authentication required for sensitive operations

### UPCOMING Features

#### 1. AI Voice Agent

**iOS Voice Commands:**

- "Hey Siri, add buy milk tomorrow morning to [App Name]"
- "Hey Siri, talk to [App Name]" (opens app with voice interaction, works even when screen is locked)
- "Hey Siri, what are my pending tasks in [App Name]?" (Siri responds with task list)

**Android Voice Commands:**

- "Hey [App Name], remind me to renew my passport next Friday"
- "Hey [App Name], add a task"
  - "What is it?"
  - "Prepare investor pitch"
  - "Deadline?"
  - "Next Monday"
  - "Priority?"
  - "Critical"

#### 2. Calendar Integration

- Sync tasks with multiple calendar providers
- Two-way synchronization
- Calendar event detection and task creation

#### 3. Smart Alerts

- Calendar conflict detection and warnings
- Create tasks from multiple sources:
  - Slack messages
  - WhatsApp messages
  - Microsoft Teams
  - Email
  - Calendar events
- Context-aware notifications

#### 4. AI-Powered Task Preparation

- Intelligent reminders for tasks requiring early preparation
- ML-based deadline suggestions
- Smart task prioritization

#### 5. Cloud Sync

- Work offline with full functionality
- Automatic cloud synchronization when online
- Conflict resolution for multi-device usage

## Setup

### Prerequisites

- Node.js 18+ and npm
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-native-expo-cli-todo-local-auth

# Install dependencies
npm install

# Start the development server
npm start
```

## Available Commands

### Development

```bash
# Start Expo development server
npm start

# Start on iOS simulator
npm run ios

# Start on Android emulator
npm run android

# Start on web browser
npm run web
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Run TypeScript type check
npm run typecheck

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Build

```bash
# Validate project before commit
npm run validate

# Build production bundle (requires EAS CLI)
eas build --platform ios
eas build --platform android
```

## Project Structure

```
src/
├── features/          # Feature-based modules (auth, todos)
├── shared/           # Shared components, hooks, utilities
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries
│   ├── styles/       # Theme and global styles
│   └── types/        # Shared TypeScript types
├── config/           # App configuration
└── providers/        # React context providers

app/                  # Expo Router screens
__tests__/           # Test files mirroring src structure
```

## Authentication Flow

1. **Viewing TODOs** - No authentication required
2. **Creating/Editing/Deleting TODOs** - Biometric authentication required
3. **App Restart** - Re-authentication required for security

## Contributing

This project follows strict code quality standards:

- TypeScript strict mode enabled
- ESLint with conventional commit rules
- Prettier for code formatting
- All functions use arrow syntax
- Components use single return statement pattern
- Styles separated into `.styles.ts` files

### Commit Message Format

```bash
<type>: <description>

# Types: feat, fix, docs, style, refactor, test, chore
# Example:
git commit -m "feat: add voice command support for task creation"
```
