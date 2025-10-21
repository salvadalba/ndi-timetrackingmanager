# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commonly Used Commands

- **Install dependencies**: `npm install`
- **Run tests**: `npm test`
- **Run a single test file**: `npm test -- test/filename.test.js`
- **Lint files**: `npm run lint`
- **Format files**: `npm run format`
- **Run e2e tests**: `npm run e2e`

## High-level code architecture

This is a vanilla JavaScript single-page application for time tracking and task management.

- **`index.html`**: The main entry point of the application.
- **`styles.css`**: Contains all the styles for the application.
- **`script.js`**: Contains the main application logic, including task management, time tracking, and real-time collaboration simulation.
- **`lib/`**: Contains modularized JavaScript files for specific functionalities:
    - **`columns.js`**: Manages the Kanban board columns and task movements.
    - **`presence.js`**: Handles real-time user presence simulation.
    - **`utils.js`**: Provides utility functions used throughout the application.
- **`test/`**: Contains the test files for the application.
- **`scripts/`**: Contains scripts for end-to-end testing.

The application is architected to be modular, with a focus on separating concerns. It simulates real-time collaboration features like Operational Transforms and live user presence updates without a backend, using in-memory data structures and mock WebSocket communication.
