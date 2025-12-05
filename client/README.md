# Nexom Frontend Guide

This is the frontend for the Nexom project, a premium home cleaning service platform. It is built using Vite, React, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

-   `src/`: Source code
    -   `components/`: Reusable UI components (Navbar, Footer, etc.)
    -   `pages/`: Page components (Home, Services, About, Contact, Login, Register)
    -   `layouts/`: Layout components (currently unused, but good for future expansion)
    -   `services/`: API service calls (placeholder for backend integration)
    -   `assets/`: Static assets like images and fonts
    -   `index.css`: Global styles and Tailwind directives
    -   `App.tsx`: Main application component with routing
    -   `main.tsx`: Entry point

## Key Features

-   **Premium Design**: Custom color palette (Slate & Gold) and typography (Inter & Playfair Display).
-   **Responsive Layout**: Fully responsive design for mobile, tablet, and desktop.
-   **Routing**: Client-side routing using `react-router-dom`.
-   **Animations**: Smooth transitions and animations using `framer-motion`.
-   **Icons**: High-quality icons from `lucide-react`.

## Next Steps

1.  **Backend Integration**: Connect the frontend to your microservices backend using `axios` or `fetch`. Implement the service calls in `src/services/`.
2.  **State Management**: For complex state, consider adding Redux or Zustand.
3.  **Authentication**: Implement actual authentication logic in `Login.tsx` and `Register.tsx` to communicate with your Auth Service.
4.  **Booking Flow**: Implement the booking process, likely involving a multi-step form and payment integration.

## Customization

-   **Colors & Fonts**: Modify `tailwind.config.js` and `src/index.css` to change the theme.
-   **Components**: Add new components in `src/components/` to extend functionality.
