# Utveksling_Database

A Vue 3 project designed to facilitate database management for exchange programs, built with Vite. This repository provides a streamlined setup for developing modern web applications.

## Features

- **Vue 3**: Leverages the power of Vue 3 for building a dynamic user interface.
- **Vite**: Fast build tool ensuring efficient development and production workflows.
- **Responsive Design**: Includes CSS styles for various UI components.
- **Firebase Integration**: Configuration for Firebase is included for backend support.
- **Localization**: Multi-language support with English and Norwegian JSON files.
- **Reusable Components**: Modular and reusable Vue components for various parts of the application.
- **Dynamic Data**: Includes sample JSON data for countries, universities, and exchanges.

## Recommended Development Setup

For the best experience, use:

- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)
- [Volar Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Disable Vetur for improved support).

## File Structure

- **src**: Main source code
  - **assets/css**: Contains various CSS files for styling components like buttons, forms, and cards.
  - **assets/images**: Image resources used in the application.
  - **components**: Vue components organized into subfolders for common, exchanges, profile, and more.
  - **data**: JSON data files for countries, universities, and related information.
  - **js**: JavaScript utilities and configurations (e.g., Firebase, router, store).
  - **languages**: Localization files (English and Norwegian).
  - **mixins**: Vue mixins for common functionality.
  - **plugins**: Vuetify setup for UI components.
- **public**: Public static assets (e.g., `favicon.ico`).
- **index.html**: Main entry point for the application.
- **vite.config.js**: Configuration file for Vite.
- **package.json**: Dependencies and project scripts.

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/kristiangoystdal/Utveksling_Database.git
   ```

2. Navigate to the project directory:

   ```sh
   cd Utveksling_Database
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

## Development Workflow

### Start Development Server

Run the development server with hot-reload:

```sh
npm run dev
```

### Build for Production

Compile and optimize the project for production:

```sh
npm run build
```

## Customize Configuration

For advanced configuration options, refer to the [Vite Documentation](https://vitejs.dev/config/).
