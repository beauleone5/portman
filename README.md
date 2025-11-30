# BoardSignal

A minimal, production-ready web app for VC/PE professionals to track news about their portfolio companies.

## Overview

BoardSignal helps investors stay informed about their portfolio companies by aggregating news articles in a single feed. Each article includes an **Impact Score** (0-10) to help you prioritize what matters most.

### Key Features

- Follow companies by name and ticker
- View consolidated news feed from all followed companies
- Impact scoring to highlight important news
- Simple localStorage-based authentication
- Clean, professional UI built with Tailwind CSS

## Tech Stack

- **Next.js 14** with TypeScript (App Router)
- **Prisma ORM** with SQLite database
- **Tailwind CSS** for styling
- **NewsAPI.org** for news data (with mock fallback)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Initialize the database:**

```bash
npx prisma migrate dev --name init
```

This creates a SQLite database at `prisma/dev.db` with the required tables.

3. **Start the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

The app will work immediately with **mock news data**. To use real news, continue to the next section.

### Using Real News (Optional)

To fetch live news articles, you'll need a free API key from NewsAPI.org:

1. Sign up at [https://newsapi.org/register](https://newsapi.org/register)
2. Copy your API key
3. Create a `.env` file in the project root:

```env
NEWS_API_KEY=your_api_key_here
```

4. Restart the development server:

```bash
npm run dev
```

The app will now fetch real news articles for your followed companies.

**Note:** Without `NEWS_API_KEY`, the app automatically uses mock data so you can test the UI and features.

## How It Works

### Authentication

BoardSignal uses a simple localStorage-based authentication:

- On first visit, a random UUID is generated and stored in your browser
- A user record is created with email `anonymous+<uuid>@boardsignal.app`
- The same user ID is reused on subsequent visits
- No passwords or login required

### News Fetching

The app fetches news from NewsAPI.org for each company you follow:

- Searches by ticker (if provided) or company name
- Limits results to the last 7 days
- Returns top 10 articles per company
- Falls back to mock data if API key is not configured

### Impact Scoring

Each article receives an **Impact Score** (0-10) based on:

- **Base score:** 3
- **High-impact keywords** (+4): acquisition, merger, funding, Series A/B/C, CEO, board, layoffs, bankruptcy, investigation
- **Amount patterns** (+2): mentions of millions/billions in dollars

Articles are sorted by impact score (highest first), then by publication date.

## Project Structure

```
boardsignal/
├── app/
│   ├── api/
│   │   ├── companies/
│   │   │   ├── [id]/route.ts    # DELETE /api/companies/:id
│   │   │   └── route.ts          # GET/POST /api/companies
│   │   └── news/
│   │       └── route.ts          # GET /api/news
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── AddCompanyForm.tsx
│   ├── CompanyList.tsx
│   ├── NewsCard.tsx
│   └── NewsFeed.tsx
├── lib/
│   ├── impactScoring.ts         # Impact score calculation
│   ├── newsFetcher.ts           # NewsAPI integration
│   ├── prisma.ts                # Prisma client
│   └── types.ts                 # TypeScript interfaces
├── prisma/
│   └── schema.prisma            # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## API Endpoints

### `GET /api/companies?userId=<uuid>`

Returns all companies followed by the user.

### `POST /api/companies`

Follow a new company.

**Body:**
```json
{
  "userId": "uuid",
  "name": "Company Name",
  "ticker": "TICK" // optional
}
```

### `DELETE /api/companies/:id?userId=<uuid>`

Unfollow a company.

### `GET /api/news?userId=<uuid>`

Returns news feed for all followed companies, sorted by impact score.

**Response:**
```json
[
  {
    "id": "string",
    "companyId": "uuid",
    "companyName": "Company Name",
    "title": "Article title",
    "source": "Source name",
    "url": "https://...",
    "publishedAt": "2025-11-30T12:00:00Z",
    "description": "Article description",
    "impactScore": 8
  }
]
```

## Database Schema

### User
- `id` (UUID, primary key)
- `email` (string, unique)
- `createdAt` (DateTime)

### Company
- `id` (UUID, primary key)
- `name` (string)
- `ticker` (string, optional)
- `createdAt` (DateTime)

### UserCompanyFollow
- `id` (UUID, primary key)
- `userId` (foreign key → User)
- `companyId` (foreign key → Company)
- `createdAt` (DateTime)
- Unique constraint on `(userId, companyId)`

## Production Deployment

For production deployment:

1. Set up a production database (PostgreSQL, MySQL, etc.)
2. Update `prisma/schema.prisma` datasource to your production database
3. Set `NEWS_API_KEY` environment variable
4. Run `npx prisma migrate deploy`
5. Build and deploy: `npm run build && npm start`

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
```

## License

MIT

## Support

For issues or questions, please check the project documentation or open an issue on GitHub.
