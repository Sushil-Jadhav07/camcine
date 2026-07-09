# CamCine OTT Platform — Full Gap Analysis
> API + Dashboard · May 2026

---

## What You Have Today (Existing APIs)

### ✅ Auth  `/api/v1/auth`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register (viewer/actor/manager/admin) |
| POST | `/auth/login` | Login via email / phone / UUID |
| GET  | `/auth/me` | Get authenticated user |
| POST | `/auth/forgot-password` | Request reset token |
| POST | `/auth/change-password` | Reset password |

### ✅ Movies  `/api/v1/movies`
Full CRUD + upload (video, trailer, thumbnail, direct GCS URL) + cast (add/bulk/update/remove)

### ✅ Episodes / Series  `/api/v1/episodes`
Series CRUD + episode CRUD + upload (trailer, thumbnail, episode-video, episode-thumbnail) + series cast + episode cast

### ✅ Songs  `/api/v1/songs`
Full CRUD + upload (audio HQ/LQ, lyrics, thumbnail, direct URL) + artists/cast

### ✅ Users  `/api/v1/users`
List, get by ID, update, soft-delete (deactivate)

### ✅ View Tracking  `/api/v1/views`
Record view + award points, user points balance, user view history, content view stats

### ✅ Cast / Actors (partial via upload controller)
Headshots/cast images managed through upload middleware

---

## 🔴 Missing APIs — Grouped by Priority

---

### 1. Subscription & Plan Management
These are referenced in the dashboard's `SubscriptionsSection` with hardcoded mock data.

#### `GET /api/v1/subscriptions/plans`
List all subscription plans.
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "uuid",
        "name": "Basic",
        "slug": "basic",
        "price_monthly": 9.99,
        "price_yearly": 99.99,
        "currency": "INR",
        "max_devices": 1,
        "max_streams": 1,
        "resolution": "HD",
        "has_downloads": false,
        "has_early_access": false,
        "features": ["HD Streaming", "1 Device", "Basic Content"],
        "is_active": true,
        "sort_order": 1,
        "created_at": "2026-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### `POST /api/v1/subscriptions/plans` (admin)
Create a plan. Request body: `name, price_monthly, price_yearly, max_devices, features[]`, etc.

#### `PUT /api/v1/subscriptions/plans/:id` (admin)
Update plan details.

#### `GET /api/v1/subscriptions` (admin/manager)
List all user subscriptions with filters.
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "user_name": "John Smith",
        "user_email": "john@email.com",
        "plan_id": "uuid",
        "plan_name": "Premium",
        "status": "active",
        "price_paid": 19.99,
        "currency": "INR",
        "billing_cycle": "monthly",
        "started_at": "2026-01-15T00:00:00Z",
        "expires_at": "2026-02-15T00:00:00Z",
        "auto_renew": true,
        "payment_method_last4": "4242"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 142, "total_pages": 15 }
  }
}
```

#### `GET /api/v1/subscriptions/stats` (admin)
Summary metrics for the dashboard stat cards.
```json
{
  "success": true,
  "data": {
    "mrr": 142600.00,
    "arr": 1711200.00,
    "active_count": 1420,
    "cancelled_count": 87,
    "paused_count": 12,
    "auto_renew_count": 1100,
    "plan_breakdown": [
      { "plan_name": "Basic", "count": 600, "revenue": 5994.00 },
      { "plan_name": "Standard", "count": 500, "revenue": 7495.00 },
      { "plan_name": "Premium", "count": 320, "revenue": 6396.80 }
    ],
    "new_this_month": 45,
    "churned_this_month": 12
  }
}
```

#### `POST /api/v1/subscriptions/:userId/subscribe`
Subscribe a user to a plan.
```json
// Request
{ "plan_id": "uuid", "billing_cycle": "monthly", "payment_method_id": "pm_xxx" }

// Response
{
  "success": true,
  "data": {
    "subscription": { "id": "uuid", "status": "active", "expires_at": "..." }
  }
}
```

#### `PATCH /api/v1/subscriptions/:id/cancel`
Cancel a subscription.

#### `PATCH /api/v1/subscriptions/:id/pause` / `resume`
Pause / resume a subscription.

---

### 2. Payments & Transactions
The `PaymentsSection` uses 100% hardcoded mock data — no API calls at all.

#### `GET /api/v1/payments` (admin/manager)
List all transactions.
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN-001234",
        "user_id": "uuid",
        "user_name": "John Smith",
        "user_email": "john@email.com",
        "amount": 1999,
        "currency": "INR",
        "status": "completed",
        "payment_method": "card",
        "card_last4": "4242",
        "card_brand": "visa",
        "plan_id": "uuid",
        "plan_name": "Standard",
        "gateway": "razorpay",
        "gateway_txn_id": "pay_xxxxx",
        "created_at": "2026-05-15T10:30:00Z",
        "subscription_id": "uuid"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 320 }
  }
}
```

#### `GET /api/v1/payments/stats` (admin)
Revenue analytics for dashboard.
```json
{
  "success": true,
  "data": {
    "total_revenue": 1420000,
    "revenue_today": 8200,
    "revenue_this_month": 142000,
    "revenue_last_month": 138000,
    "completed_count": 1380,
    "failed_count": 28,
    "refunded_count": 14,
    "pending_count": 5,
    "monthly_trend": [
      { "month": "2026-01", "revenue": 110000, "count": 1050 },
      { "month": "2026-02", "revenue": 120000, "count": 1150 }
    ]
  }
}
```

#### `GET /api/v1/payments/:id`
Single transaction detail.

#### `POST /api/v1/payments/refund/:id` (admin)
Issue a refund.
```json
// Request
{ "reason": "customer_request", "amount": 1999 }

// Response
{ "success": true, "data": { "refund_id": "ref_xxx", "status": "processed" } }
```

#### `GET /api/v1/payments/export` (admin)
CSV/Excel export of transactions (date range params).

---

### 3. Dashboard Analytics API
The `AnalyticsSection` fetches from `/views` and `/movies` but lacks a proper analytics endpoint — it stitches data client-side from 12+ requests.

#### `GET /api/v1/analytics/overview` (admin)
Single endpoint for the entire analytics page.
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "summary": {
      "total_views": 148200,
      "unique_viewers": 9800,
      "total_revenue": 142000,
      "active_users": 12400,
      "new_users": 850,
      "total_titles": 142,
      "published_titles": 118,
      "total_points_awarded": 148200
    },
    "top_content": [
      {
        "id": "uuid",
        "title": "Dangal",
        "type": "movie",
        "views": 4200,
        "unique_viewers": 3800,
        "points_awarded": 4200,
        "thumbnail_url": "https://..."
      }
    ],
    "content_type_breakdown": [
      { "type": "movie", "count": 62, "views": 84000 },
      { "type": "show", "count": 38, "views": 44000 },
      { "type": "song", "count": 42, "views": 20200 }
    ],
    "views_trend": [
      { "date": "2026-04-24", "views": 4200, "unique_viewers": 3800 },
      { "date": "2026-04-25", "views": 4800, "unique_viewers": 4100 }
    ],
    "revenue_trend": [
      { "month": "2026-01", "revenue": 110000 },
      { "month": "2026-02", "revenue": 120000 }
    ],
    "user_growth": [
      { "month": "2026-01", "new_users": 620, "total_users": 9800 }
    ]
  }
}
```

#### `GET /api/v1/analytics/content/:id` (admin)
Per-content deep analytics (expand on the existing `/views/content/:id/stats`).

---

### 4. Notifications System
The `NotificationsSection` is 100% hardcoded with no API.

#### `GET /api/v1/notifications` (authenticated)
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "content",
        "title": "New movie uploaded",
        "body": "The Midnight Archive is now live.",
        "is_read": false,
        "action_url": "/content/uuid",
        "created_at": "2026-05-24T10:00:00Z",
        "actor": {
          "id": "uuid",
          "name": "Admin",
          "avatar_url": null
        }
      }
    ],
    "unread_count": 3,
    "pagination": { "page": 1, "total": 24 }
  }
}
```

#### `PATCH /api/v1/notifications/:id/read`
Mark single notification read.

#### `PATCH /api/v1/notifications/read-all`
Mark all as read.

#### `DELETE /api/v1/notifications/:id`
Delete a notification.

#### `POST /api/v1/notifications` (admin — internal push)
Create and send a platform notification to users or roles.
```json
// Request
{
  "type": "system",
  "title": "Platform update",
  "body": "New features have been released.",
  "target": "all",
  "target_role": "viewer"
}
```

---

### 5. Watchlist / Continue Watching
Completely absent — critical for OTT UX.

#### `GET /api/v1/users/:userId/watchlist`
```json
{
  "success": true,
  "data": {
    "watchlist": [
      {
        "id": "uuid",
        "content_id": "uuid",
        "content_title": "Dangal",
        "content_type": "movie",
        "poster_url": "https://...",
        "added_at": "2026-05-20T10:00:00Z"
      }
    ]
  }
}
```

#### `POST /api/v1/users/:userId/watchlist`
Body: `{ "content_id": "uuid" }`

#### `DELETE /api/v1/users/:userId/watchlist/:contentId`

#### `GET /api/v1/users/:userId/continue-watching`
```json
{
  "success": true,
  "data": {
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
}
```

#### `POST /api/v1/users/:userId/progress`
Update watch progress (called periodically while watching).
```json
// Request
{ "content_id": "uuid", "episode_id": "uuid", "progress_seconds": 1240 }
```

---

### 6. Ratings & Reviews
Not built at all.

#### `POST /api/v1/content/:id/ratings`
```json
// Request
{ "rating": 4, "review": "Great movie!" }

// Response
{ "success": true, "data": { "id": "uuid", "average_rating": 4.2, "total_ratings": 128 } }
```

#### `GET /api/v1/content/:id/ratings`
List ratings/reviews with pagination.

#### `DELETE /api/v1/content/:id/ratings/:ratingId` (admin — moderation)

---

### 7. Search
No unified search endpoint exists. Frontend searches per-content-type separately.

#### `GET /api/v1/search`
```json
// Query params: q, type (movie|show|song|all), page, limit

{
  "success": true,
  "data": {
    "query": "dangal",
    "results": [
      {
        "id": "uuid",
        "type": "movie",
        "title": "Dangal",
        "poster_url": "https://...",
        "year": 2016,
        "language": "Hindi",
        "rating": "U"
      }
    ],
    "by_type": {
      "movies": 1,
      "shows": 0,
      "songs": 2,
      "actors": 0
    },
    "pagination": { "total": 3 }
  }
}
```

---

### 8. Actors / Cast Directory
Cast is embedded in content but there's no standalone actor directory (the `ActorQueueSection` and `ActorPortalSection` in the dashboard suggest this is partly planned).

#### `GET /api/v1/actors`
```json
{
  "success": true,
  "data": {
    "actors": [
      {
        "id": "uuid",
        "name": "Aamir Khan",
        "headshot_url": "https://...",
        "role": "actor",
        "nationality": "Indian",
        "bio": "...",
        "content_count": 14,
        "is_verified": true,
        "user_id": "uuid"
      }
    ],
    "pagination": { "total": 84 }
  }
}
```

#### `GET /api/v1/actors/:id`
#### `PUT /api/v1/actors/:id` (admin)
#### `GET /api/v1/actors/:id/filmography`
```json
{
  "success": true,
  "data": {
    "movies": [...],
    "shows": [...],
    "songs": [...]
  }
}
```

---

### 9. News / Blog
The `NewsManagerSection` is in the dashboard but has no API backing.

#### `GET /api/v1/news`
#### `POST /api/v1/news` (admin/manager)
```json
// Request
{
  "title": "New season of Mirzapur announced",
  "slug": "mirzapur-season-4",
  "body": "...",
  "category": "announcement",
  "tags": ["mirzapur", "amazon"],
  "thumbnail_url": "https://...",
  "is_published": false
}
```
#### `PUT /api/v1/news/:id` (admin/manager)
#### `DELETE /api/v1/news/:id` (admin)
#### `PATCH /api/v1/news/:id/publish` (admin)

---

### 10. Content Recommendations
#### `GET /api/v1/users/:userId/recommendations`
```json
{
  "success": true,
  "data": {
    "because_you_watched": [...],
    "trending_now": [...],
    "new_releases": [...],
    "free_to_watch": [...]
  }
}
```

#### `GET /api/v1/content/trending`
#### `GET /api/v1/content/new-releases`

---

### 11. Settings / Platform Config
#### `GET /api/v1/settings` (admin)
#### `PUT /api/v1/settings` (admin)
```json
{
  "platform_name": "CamCine",
  "tagline": "Stream India",
  "daily_view_points_limit": 3,
  "points_per_view": 1,
  "maintenance_mode": false,
  "signup_enabled": true,
  "default_content_language": "Hindi",
  "supported_languages": ["Hindi", "English", "Marathi"]
}
```

---

### 12. Manager Earnings
The `ManagerEarningsSection` is in the dashboard but there's no API for it.

#### `GET /api/v1/managers/:managerId/earnings`
```json
{
  "success": true,
  "data": {
    "total_earned": 24000,
    "pending_payout": 3200,
    "this_month": 8400,
    "last_month": 7200,
    "content_performance": [
      { "content_id": "uuid", "title": "Dangal", "views": 4200, "revenue_share": 420 }
    ],
    "payout_history": [
      { "id": "uuid", "amount": 5000, "status": "paid", "paid_at": "2026-04-30T00:00:00Z" }
    ]
  }
}
```

---

### 13. Support / Tickets
The dashboard mentions "Open Tickets" stat card with `value: '0', change: 'not in API'` — they know it's missing!

#### `GET /api/v1/support/tickets` (admin/manager)
#### `POST /api/v1/support/tickets`
```json
// Request
{ "subject": "Video not loading", "category": "technical", "body": "...", "content_id": "uuid" }

// Response
{ "success": true, "data": { "id": "TKT-00284", "status": "open" } }
```
#### `PUT /api/v1/support/tickets/:id` (admin — update status/assign)
#### `POST /api/v1/support/tickets/:id/reply`

---

## 🟡 Dashboard Sections That Need Wiring to Real APIs

| Section | Current State | What to Fix |
|---------|--------------|-------------|
| `DashboardSection` | Partially wired — stats pull from `/users` and `/movies`. Revenue chart is **hardcoded**. Activity feed is **hardcoded**. | Add `GET /analytics/overview` and wire revenue + activity. |
| `AnalyticsSection` | Makes 12+ individual API calls, no analytics API. Charts are **hardcoded fallback data**. | Build `GET /analytics/overview`. |
| `SubscriptionsSection` | 100% mock data. Plan cards are hardcoded. | Build full subscriptions API. |
| `PaymentsSection` | 100% mock data. | Build payments API. |
| `NotificationsSection` | 100% mock data. | Build notifications API. |
| `NewsManagerSection` | No API calls at all. | Build news API. |
| `ManagerEarningsSection` | No API calls visible. | Build manager earnings API. |
| `ActorPortalSection` | Partially built, needs actor directory API. | Build actors API. |
| `SettingsSection` | No API calls. | Build settings API. |

---

## 🟢 Dashboard UX Improvements to Make

### Missing Pages / Sections
1. **Watchlist Management** — no admin view of user watchlists
2. **Content Recommendations Config** — ability to pin/feature content on the homepage
3. **Search Analytics** — what are users searching for?
4. **Revenue per Content** — which movie/show is making the most money?
5. **Refund Management** — dedicated refunds view (currently in payments mockup only)
6. **Role Permissions Manager** — visual UI to manage what each role can do
7. **Transcoding Status** — video upload → processing → published pipeline visibility

### Improvements to Existing Sections
- **Dashboard Overview**: Wire the activity feed to real events (use a `/activity-log` or notifications API). Replace hardcoded revenue chart with real data from `/analytics/overview`.
- **Analytics**: Replace the 12-request client-side stitching with one `/analytics/overview` call. Add date range picker that actually filters.
- **Content Library**: Add a "Processing" status filter — right now you can't easily see which uploads are stuck. Add bulk publish/archive actions.
- **Users Section**: Add user subscription status column. Show last login. Allow admin to impersonate user for debugging.
- **Subscriptions Section**: Connect to real API. Add a "Change Plan" flow. Show subscription timeline.
- **Payments Section**: Connect to real API. Add CSV export. Add refund workflow.

---

## 📐 Suggested DB Tables to Add

| Table | Purpose |
|-------|---------|
| `subscription_plans` | Plan catalog |
| `user_subscriptions` | User ↔ plan mapping + billing |
| `payments` | Transaction records |
| `notifications` | Platform notifications |
| `watchlist` | User ↔ content bookmarks |
| `watch_progress` | Continue-watching progress |
| `ratings` | User ratings + reviews |
| `news_articles` | Blog/news content |
| `support_tickets` | Customer support |
| `activity_log` | Audit trail for admin activity feed |
| `actors` | Standalone actor profiles |
| `payout_records` | Manager earning payouts |
| `platform_settings` | Key-value config store |

---

## Priority Order (Recommended Build Sequence)

1. **Subscriptions + Plans API** — core business model, dashboard mocks are blocking
2. **Payments API** — revenue tracking, needed for the SubscriptionsSection to work end-to-end
3. **Analytics Overview API** — consolidate the 12-request mess in AnalyticsSection
4. **Watchlist + Watch Progress** — critical OTT UX, users expect this
5. **Notifications API** — needed for real-time engagement
6. **Search API** — unified search across movies/shows/songs
7. **Actors Directory** — needed for ActorPortal and ActorQueue sections
8. **News API** — NewsManagerSection is already built, just needs the backend
9. **Ratings & Reviews** — engagement and social proof
10. **Settings API** — admin config persistence
11. **Manager Earnings API** — needed for ManagerEarningsSection
12. **Support Tickets** — the dashboard already has a stat card for "Open Tickets"
