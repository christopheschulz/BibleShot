# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BibleShot is a React Native mobile application that displays daily Bible verse "shots" to users. Built with Expo Router for file-based routing, the app automatically selects and displays a random Bible verse each day on the home screen. The app uses TypeScript and follows modern React Native development patterns, with primary focus on iOS (future widget and complication support planned).

### Core Features
- **Daily Bible Shots**: Random shot selection from curated data each day
- **Home Page**: Displays only the daily selected shot
- **Quiz Page**: Challenge to find the original Bible verse corresponding to the shot
- **iOS-First**: Designed primarily for iOS with future widget/complication support

### App Concept
The app displays a daily "shot" (inspirational message derived from a Bible verse) on the home screen. The challenge is to find the corresponding original verse in the quiz section, creating an engaging way to discover Scripture.

## Development Commands

### Core Development
- `npm install` - Install dependencies
- `npx expo start` - Start development server with Metro bundler
- `npx expo start --android` - Start with Android emulator
- `npx expo start --ios` - Start with iOS simulator
- `npx expo start --web` - Start with web browser

### Code Quality
- `npx expo lint` - Run ESLint with expo configuration
- No test framework is currently configured

### Project Management
- `npx expo install` - Install Expo-compatible packages
- `npm run reset-project` - Move starter code to app-example/ and create blank app/ directory

## Architecture

### File-Based Routing
The app uses Expo Router with file-based routing in the `app/` directory:
- `app/_layout.tsx` - Root layout with Stack navigator pointing to tabs
- `app/(tabs)/` - Tab-based navigation group with three main screens
- `app/(tabs)/_layout.tsx` - Tab layout configuration with Home, Quiz, Profile
- `app/(tabs)/index.tsx` - Home screen (daily Bible shot display)
- `app/(tabs)/quiz.tsx` - Quiz screen (Bible knowledge quizzes)
- `app/(tabs)/profile.tsx` - Profile screen (user information)

### Project Structure
- `app/` - Main application screens and layouts (file-based routing)
- `components/` - Reusable React components
  - `components/ui/` - UI-specific components (IconSymbol, Collapsible)
  - Themed components (ThemedText, ThemedView)
  - Feature components (HelloWave, ParallaxScrollView, ExternalLink, HapticTab)
- `constants/` - Application constants
  - `constants/theme.ts` - Color schemes and theme definitions (primary theme source)
- `hooks/` - Custom React hooks
  - `hooks/use-color-scheme.ts` - Color scheme detection (with web variant)
  - `hooks/use-theme-color.ts` - Theme color utilities
- `assets/` - Static assets (images, fonts, etc.)
  - `assets/Data/Bibleshotdata.json` - Bible shots data for daily selection
- `scripts/` - Build and utility scripts

### Key Technologies
- **Expo SDK 54** with new architecture enabled
- **React Native 0.81.4** with React 19.1.0
- **TypeScript** with strict mode
- **Expo Router** for navigation and routing
- **React Navigation** for tab and stack navigation
- **Reanimated 4** for animations
- **Expo Symbols** for cross-platform icons

### Theme System
The app has infrastructure for theming:
- Color constants defined in `constants/theme.ts`
- Custom hooks for color scheme detection (`use-color-scheme.ts`)
- Themed components available (ThemedText, ThemedView)
- Note: Theme provider and automatic theme switching removed from root layout

### Path Aliases
- `@/*` maps to the project root for cleaner imports

## Platform Support
- iOS with tablet support
- Android with adaptive icons and edge-to-edge display
- Web with static output and favicon support

## UI/UX Guidelines
- **No page titles**: Never add titles to any page in the application
- **Clean interface**: Keep pages focused on content without header text
- **Tab navigation**: Page identity comes from tab icons and labels, not page titles

## Configuration Notes
- TypeScript strict mode is enabled
- ESLint uses expo configuration
- Experimental features: typed routes and React compiler
- VSCode configured with auto-fix on save and import organization