# CamCine — Frontend Developer Tasks
> React frontend at https://camcine.asynk.in/
> These are user-facing features — not the admin dashboard

---

## Context

The frontend is the public-facing OTT platform that end users see — the streaming site itself. All APIs listed below need to be integrated once the backend builds them. Some features are completely missing from the frontend today.

---

## ✅ Already Working (Do NOT rebuild)

- Browse movies, shows, songs (list pages)
- Single content detail pages
- User registration & login
- Basic content playback (video player exists)

---

## 🔴 Missing Features — In Priority Order

---

### 1. Watchlist / My List

**What it is:** Users click a bookmark/heart icon on any content and it saves to their "My List". They can access this list from their profile.

**Where to add:**
- Every movie/show/song card → add a **bookmark icon button** (top-right corner)
- Every content detail page → add a **"+ Add to Watchlist"** / **"✓ In My List"** toggle button
- New **"My List" page** in the user's profile/account section

**API calls:**
```js
// Check if in watchlist (on page load)
GET /api/v1/users/:userId/watchlist

// Add to watchlist
POST /api/v1/users/:userId/watchlist
Body: { "content_id": "uuid" }

// Remove from watchlist
DELETE /api/v1/users/:userId/watchlist/:contentId
```

**UI behaviour:**
- Icon should be filled/highlighted if already in watchlist
- Toggling should be instant (optimistic update) — don't wait for API response to update the icon
- Show a toast: "Added to My List" / "Removed from My List"
- Require login — if user is not logged in, clicking the icon should open the login modal

---

### 2. Continue Watching Row

**What it is:** A horizontal scroll row on the homepage showing content the user has started but not finished, with a progress bar.

**Where to add:**
- Homepage — as the **first row** above everything else (only show if user is logged in and has items)
- Each card shows: thumbnail, title, progress bar (% watched), episode info if a show

**API calls:**
```js
// On homepage load (authenticated only)
GET /api/v1/users/:userId/continue-watching
```

**Response to use:**
```json
{
  "items": [
    {
      "content_id": "uuid",
      "episode_id": "uuid",
      "title": "Mirzapur",
      "type": "show",
      "progress_seconds": 1240,
      "duration_seconds": 3600,
      "progress_percent": 34.4,
      "episode_number": 3,
      "season": 1,
      "thumbnail_url": "https://...",
      "last_watched_at": "2026-05-23T21:00:00Z"
    }
  ]
}
```

**Save progress while watching:**
```js
// Call this every 30 seconds while the video player is playing
POST /api/v1/users/:userId/progress
Body: { "content_id": "uuid", "episode_id": "uuid", "progress_seconds": 1240 }
```
- Connect this to the video player's `timeupdate` event (fire every 30s)
- Also call it when the user pauses or closes the player

---

### 3. Unified Search

**What it is:** A single search bar that returns results across movies, shows, songs, and actors all at once.

**Where to add:**
- Navbar search bar (already exists visually, but likely hits separate endpoints)
- Dedicated `/search` results page with tabs: All · Movies · Shows · Songs · Actors

**API call:**
```js
GET /api/v1/search?q=dangal&type=all&page=1&limit=20
```

**Response:**
```json
{
  "data": {
    "query": "dangal",
    "results": [
      { "id": "uuid", "type": "movie", "title": "Dangal", "poster_url": "...", "year": 2016 }
    ],
    "by_type": { "movies": 1, "shows": 0, "songs": 2, "actors": 0 }
  }
}
```

**UI behaviour:**
- Instant search suggestions as user types (debounce 300ms, show top 5 results as a dropdown)
- Press Enter → go to full `/search?q=...` results page
- On results page, show type filter tabs. Clicking a tab filters `type=movie` etc.
- Show "No results found for X" with suggestions if empty
- Highlight the matched keyword in result titles

---

### 4. Ratings & Reviews

**What it is:** Users can rate content (1–5 stars) and leave a written review. Average rating is displayed on the content detail page.

**Where to add:**
- Content detail page → **star rating widget** + **"Write a Review"** section
- Show average rating and total count prominently (e.g. "★ 4.2 · 128 ratings")
- Review list below with user name, star count, text, and date
- User's own rating should be pre-filled if they've already rated

**API calls:**
```js
// Load ratings on content detail page
GET /api/v1/content/:id/ratings?page=1&limit=10

// Submit a rating (authenticated)
POST /api/v1/content/:id/ratings
Body: { "rating": 4, "review": "Great movie!" }

// Update own rating
PUT /api/v1/content/:id/ratings/:ratingId
Body: { "rating": 5, "review": "Even better on rewatch!" }
```

**UI behaviour:**
- Star widget is interactive — hover to preview, click to select
- Require login to rate — show login prompt if not authenticated
- After submitting, replace the form with "Your rating: ★★★★☆ · Edit"
- Paginate reviews — "Load more reviews" button

---

### 5. Subscription & Plans Page

**What it is:** The page where users can see available plans and subscribe. Currently likely hardcoded or missing.

**Where to add:**
- `/subscribe` or `/plans` page
- Also accessible from user profile → "Upgrade Plan"

**API calls:**
```js
// Load plan options
GET /api/v1/subscriptions/plans

// Subscribe (authenticated)
POST /api/v1/subscriptions/:userId/subscribe
Body: { "plan_id": "uuid", "billing_cycle": "monthly", "payment_method_id": "pm_xxx" }

// Get current subscription
GET /api/v1/subscriptions/:userId

// Cancel subscription
PATCH /api/v1/subscriptions/:id/cancel
```

**UI:**
- 3-column plan comparison cards (Basic · Standard · Premium)
- Monthly / Yearly billing toggle (show yearly savings %)
- "Current Plan" badge on the user's active plan
- "Upgrade" / "Downgrade" / "Cancel" buttons
- Payment integration with Razorpay (get `payment_method_id` from Razorpay SDK, then call subscribe)

---

### 6. Actor / Person Pages

**What it is:** Dedicated profile pages for actors, directors, musicians — showing bio and their work.

**Where to add:**
- Cast names on content detail pages → make them **clickable links** → `/actor/:id`
- New `/actor/:id` page

**API calls:**
```js
// Actor profile
GET /api/v1/actors/:id

// Their content
GET /api/v1/actors/:id/filmography
```

**UI for `/actor/:id` page:**
- Large headshot + name + bio + nationality
- Tabs: Movies · Shows · Songs
- Grid of content cards under each tab

---

### 7. Content Recommendations Rows on Homepage

**What it is:** Dynamic homepage sections like "Trending Now", "New Releases", "Free to Watch", "Because you watched X".

**Where to add:**
- Homepage — multiple horizontal scroll rows, each with a label

**API calls:**
```js
// Public rows (no auth needed)
GET /api/v1/content/trending
GET /api/v1/content/new-releases

// Personalised (authenticated users only)
GET /api/v1/users/:userId/recommendations
```

**Response for recommendations:**
```json
{
  "data": {
    "because_you_watched": [...],
    "trending_now": [...],
    "new_releases": [...],
    "free_to_watch": [...]
  }
}
```

**UI:**
- Each row is a horizontally scrollable strip of content cards
- Row titles: "Trending Now" · "New Releases" · "Free to Watch" · "Because you watched Mirzapur"
- Show personalised rows only when logged in; show trending/new for guests

---

### 8. News / Blog Page

**What it is:** A public news section with articles about movies, shows, announcements.

**Where to add:**
- `/news` — article listing page
- `/news/:slug` — single article page
- Optional: a "Latest News" widget in the footer or sidebar

**API calls:**
```js
GET /api/v1/news?page=1&limit=12            // listing
GET /api/v1/news?category=announcement      // filtered
GET /api/v1/news/:id                        // single article
```

**UI:**
- Card grid with thumbnail, title, category badge, date, excerpt
- Single article page with full body, author, date, related articles

---

### 9. User Profile & Account Page

**What it is:** The logged-in user's account management page.

**Sections to include:**

| Tab | Content |
|-----|---------|
| Profile | Edit name, phone, age, language preferences |
| My Plan | Current plan name, expiry, upgrade/cancel options |
| My List | Their watchlist (same as feature #1) |
| History | Their watch history + points earned |
| Payments | Their own transaction history |

**API calls:**
```js
GET /api/v1/auth/me                          // profile info
PUT /api/v1/users/:id                        // update profile

GET /api/v1/subscriptions/:userId            // current plan
PATCH /api/v1/subscriptions/:id/cancel       // cancel plan

GET /api/v1/users/:userId/watchlist          // my list
GET /api/v1/users/:userId/continue-watching  // watch history
GET /api/v1/views/user/:userId/points        // points balance
GET /api/v1/payments?user_id=:id             // payment history (needs backend filter param)
```

---

### 10. Support / Help Page

**What it is:** Users can submit a support ticket.

**Where to add:**
- `/support` or `/help` page
- Link in footer and user account page

**API calls:**
```js
// Submit a ticket
POST /api/v1/support/tickets
Body: { "subject": "...", "category": "technical", "body": "...", "content_id": "uuid" }

// View own tickets
GET /api/v1/support/tickets?user_id=:id  // backend needs to scope to own tickets
```

**UI:**
- Simple form: Subject, Category (dropdown), Description (textarea), optional "related to content" field
- After submit: "Your ticket #TKT-000284 has been submitted. We'll reply within 24 hours."
- "My Tickets" section in user profile showing status of past tickets

---

## Small But Important UX Fixes

These don't need new pages but should be added alongside the above features:

**Login Gate:** Watchlist, rating, and progress tracking all require login. Add a clean "Login to continue" modal/redirect that remembers where the user was going.

**Toast Notifications:** Add a global toast system (e.g. `react-hot-toast`) for actions: "Added to My List", "Rating saved", "Subscription cancelled", etc.

**Loading Skeletons:** Replace blank/spinner states with proper skeleton loaders for content cards and detail pages — better perceived performance.

**Empty States:** When watchlist is empty, continue-watching has nothing, or search returns zero results — show friendly illustrated empty states instead of just blank space.

**Password Reset Flow:** Make sure the forgot-password → email → `/reset-password?token=xxx` page is fully built. The backend has the endpoints (`/auth/forgot-password` and `/auth/change-password`) — just confirm the frontend flow is complete.

---

## API Service Pattern to Follow

Match the existing pattern in `src/services/`:

```js
// src/services/watchlist.js
import { apiClient } from './api.js';

export const watchlistService = {
  get:    (userId)              => apiClient.get(`/users/${userId}/watchlist`),
  add:    (userId, contentId)   => apiClient.post(`/users/${userId}/watchlist`, { content_id: contentId }),
  remove: (userId, contentId)   => apiClient.delete(`/users/${userId}/watchlist/${contentId}`),
  getContinueWatching: (userId) => apiClient.get(`/users/${userId}/continue-watching`),
  saveProgress: (userId, data)  => apiClient.post(`/users/${userId}/progress`, data),
};
```

---

## Build Order for Frontend

1. **Watchlist** (heart/bookmark icon everywhere — users expect this)
2. **Continue Watching row** + progress saving in video player
3. **Search** (unify the search bar)
4. **Recommendations rows** on homepage (trending, new releases)
5. **Subscription / Plans page** (required for monetisation)
6. **Ratings & Reviews** on content detail pages
7. **User Profile / Account page** (consolidate all user data)
8. **Actor pages** (link cast names to profiles)
9. **News / Blog** pages
10. **Support / Help** page
