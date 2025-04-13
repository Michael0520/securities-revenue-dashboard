# Monthly Revenue Analytics Dashboard for Securities

A sophisticated securities revenue data visualization application built on Next.js and Material UI, providing intuitive charts and analytical capabilities for monitoring revenue trends and year-over-year changes of Taiwan-listed companies.

## Core Features

* **Revenue Data Visualization**: Dual-axis visualization with bar charts for monthly revenue and line charts for YoY growth rates
* **Flexible Time Range Selection**: Customizable data timeframes with 3-year and 5-year historical views
* **Responsive Layout System**: Optimized viewing experience across desktop, tablet, and mobile devices
* **High-performance Data Processing**: Implemented data caching and on-demand fetching with React Query
* **Robust State Management**: Global data state orchestration via TanStack Query's caching capabilities
* **Comprehensive Data Presentation**: Tabular representation of monthly revenue data with color-coded YoY change metrics

## Technology Stack

* **React 19** with functional component architecture and hooks-based lifecycle management
* **Next.js 15** featuring App Router and Server Components for optimized rendering
* **TypeScript** for static type checking and enhanced IDE developer experience
* **Material UI** for component-driven UI development with theming capabilities
* **TanStack Query (React Query)** for declarative data fetching with automatic caching
* **MUI X Charts** for high-performance, interactive data visualization components

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Michael0520/securities-revenue-dashboard.git
cd securities-revenue-dashboard
```

2. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn

# Using pnpm
pnpm install
```

3. Start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application

## Project Architecture

```
/
├── public/                # Static assets
├── src/
│   ├── api/               # API layer abstraction
│   │   ├── config.ts      # API configuration
│   │   └── finmind.ts     # FinMind API integration
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   └── stock/         # Securities views
│   ├── components/        # Reusable React components
│   │   └── RevenueTable/  # Revenue table component
│   ├── constants/         # Constants definition
│   │   ├── chart.ts       # Chart-related constants
│   │   ├── table.ts       # Table-related constants
│   │   └── timeRange.ts   # Time range constants
│   ├── hooks/             # Custom React hooks
│   │   └── api/           # API-related hooks
│   ├── types/             # TypeScript type definitions
│   │   ├── api.ts         # API-related types
│   │   └── stock.ts       # Securities data types
│   └── utils/             # Utility functions
└── Configuration files    # TypeScript, ESLint configurations
```

## Architectural Design Patterns

The system implements several modern frontend architecture patterns:

* **Service/Presentation Component Separation**: Decoupling data fetching logic from UI rendering components
* **Centralized Type Management**: Unified type definition system in the `types` directory
* **Modular Constants**: Configuration and constants extraction into dedicated modules
* **Custom Hooks Encapsulation**: Business logic reuse through custom React hooks
* **API Security Layer**: Leveraging Next.js API Routes as a secure proxy to protect API tokens from exposure in client-side code, ensuring all FinMind API requests are processed server-side with credentials stored in environment variables

## Data Source

* Utilizes FinMind API for retrieving monthly revenue data of Taiwan-listed companies
* Data category: Fundamental Analysis - Monthly Revenue Statement