# Setup & Installation: IS-frontend

## Prerequisites
Before you begin, ensure you have the following installed on your local development machine:
- **Node.js**: [v18 or higher](https://nodejs.org/) (Recommended: LST version)
- **npm**: [v9 or higher](https://docs.npmjs.com/) (Comes bundled with Node.js)
- **A Code Editor**: [Visual Studio Code](https://code.visualstudio.com/) is highly recommended.

## Step-by-Step Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>/IS-Frontend
```

### 2. Install Dependencies
Run the following command to install all necessary packages:
```bash
npm install
```

### 3. Environment Variable Configuration
The application requires several environment variables to function correctly. Create a `.env.local` file in the root directory and add the following:

```env
VITE_API_URL=http://localhost:8080/api
```

- **VITE\_API\_URL**: The base URL of the IS-backend API.

### 4. Run the Development Server
Start the Vite development server with:
```bash
npm run dev
```
The application should now be accessible at [http://localhost:5173](http://localhost:5173).

## Other Commands
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Lint the Codebase**: `npm run lint`
- **Fix Linting Issues**: `npm run lint -- --fix`
