# Lifeline Monorepo

This repository contains the Lifeline IoT Emergency System in a monorepo structure.

## Structure

- mobile-app/ — React Native (Expo) app
- web-dashboard/ — Next.js 15 dashboard
- shared/ — Shared TypeScript types, constants, and utilities

## Getting Started

Install dependencies for all workspaces:

`ash
npm install --workspaces
`

### Mobile App (Expo)
- Start web (Expo for web):
`ash
npm run web
`
- Start Android:
`ash
npm run android
`
- Start iOS (macOS only):
`ash
npm run ios
`

### Web Dashboard (Next.js)
In the root:
`ash
npm run dev --workspace web-dashboard
`
Then open http://localhost:3000.

## Shared Module
Import shared types/constants in either project:

`	s
import { COLORS, APP_CONFIG, type User } from 'shared'
`

## Notes
- No UI or functionality changes were made during restructuring.
- Expo SDK aligned with workspace; Next.js uses React 19.
