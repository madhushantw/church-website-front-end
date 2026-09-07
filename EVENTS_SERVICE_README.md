# Events Service

Complete CRUD service for managing church events with pagination, authentication, and role-based access control.

## Features

- **Read Access**: Public endpoint to fetch events with pagination
- **Write Access**: Admin-only endpoints to create, update, and delete events
- **Pagination**: Configurable page and limit parameters
- **Authentication**: Bearer token validation for protected endpoints
- **Role-Based Access**: Only ROOT/admin users can modify events

## API Endpoints

### GET `/api/events` - Get All Events (Public)
Returns paginated list of all events.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Sunday Service",
      "description": "Join us for worship",
      "image": null,
      "startDate": "2026-09-07T10:00:00Z",
      "endDate": "2026-09-07T11:30:00Z",
      "location": "Main Chapel",
      "isFeatured": true,
      "createdAt": "2026-09-01T00:00:00Z",
      "updatedAt": "2026-09-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### GET `/api/events/:id` - Get Single Event (Public)
Returns a specific event by ID.

**Response:** Single Event object (see above)

**Error Responses:**
- 404 - Event not found

### POST `/api/events` - Create Event (Admin Only)
Creates a new event.

**Required Headers:**
- `Authorization: Bearer <token>` (Admin/ROOT role required)

**Request Body:**
```json
{
  "title": "Event Name",
  "startDate": "2026-09-07T10:00:00Z",
  "endDate": "2026-09-07T11:30:00Z",
  "description": "Optional description",
  "image": "Optional image URL",
  "location": "Optional location",
  "isFeatured": false
}
```

**Response:** 201 Created - Returns created Event object

**Error Responses:**
- 400 - Missing required fields or invalid dates
- 401 - Missing authentication token
- 403 - Insufficient permissions (not an admin)

### PUT `/api/events/:id` - Update Event (Admin Only)
Updates an existing event.

**Required Headers:**
- `Authorization: Bearer <token>` (Admin/ROOT role required)

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "startDate": "2026-09-07T10:00:00Z",
  "endDate": "2026-09-07T11:30:00Z",
  "location": "Updated location",
  "image": "Updated image URL",
  "isFeatured": true
}
```

**Response:** 200 OK - Returns updated Event object

**Error Responses:**
- 400 - Invalid dates
- 401 - Missing authentication token
- 403 - Insufficient permissions (not an admin)
- 404 - Event not found

### DELETE `/api/events/:id` - Delete Event (Admin Only)
Deletes an event.

**Required Headers:**
- `Authorization: Bearer <token>` (Admin/ROOT role required)

**Response:** 204 No Content

**Error Responses:**
- 401 - Missing authentication token
- 403 - Insufficient permissions (not an admin)
- 404 - Event not found

## Client-Side Usage

### Setup
Import the `EventsService` from `~/app/services/events.service.ts`:

```typescript
import { EventsService } from '~/app/services/events.service'
```

### Examples

**Fetch events with pagination:**
```typescript
const { data, pagination } = await EventsService.getAll(page, limit)
```

**Fetch featured events:**
```typescript
const featured = await EventsService.getFeatured(limit)
```

**Get a single event:**
```typescript
const event = await EventsService.getById(eventId)
```

**Create event (requires admin auth):**
```typescript
const newEvent = await EventsService.create({
  title: 'New Event',
  startDate: new Date(),
  endDate: new Date(),
  description: 'Event description',
})
```

**Update event (requires admin auth):**
```typescript
const updated = await EventsService.update(eventId, {
  title: 'Updated Title',
  isFeatured: true,
})
```

**Delete event (requires admin auth):**
```typescript
await EventsService.delete(eventId)
```

## Database Integration

The service functions are located in `/server/utils/events.ts`. Each function contains TODO comments showing where database operations should go.

### With TypeORM:
```typescript
export async function findAllEvents(page: number = 1, limit: number = 10) {
  const events = await db.event.find({
    skip: (page - 1) * limit,
    take: limit,
    order: { startDate: 'ASC' }
  })
  const total = await db.event.count()
  return { events, total }
}
```

### With Prisma:
```typescript
export async function findAllEvents(page: number = 1, limit: number = 10) {
  const events = await prisma.event.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { startDate: 'asc' }
  })
  const total = await prisma.event.count()
  return { events, total }
}
```

## Authentication

The service checks for a `Bearer` token in the `Authorization` header. Replace the mock implementation in `/server/utils/auth.ts` with actual JWT verification:

```typescript
import { verifyJWT } from 'your-jwt-library'

export function getUserFromRequest(event: any): AuthedUser | null {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token = authHeader.substring(7)
    const decoded = verifyJWT(token, process.env.JWT_SECRET)
    return decoded
  } catch {
    return null
  }
}
```

## File Structure

```
/server
  /api
    /events
      index.get.ts     - Get all events
      index.post.ts    - Create event
      [id].get.ts      - Get single event
      [id].put.ts      - Update event
      [id].delete.ts   - Delete event
  /utils
    auth.ts            - Auth helpers
    events.ts          - Service logic

/app/services
  events.service.ts    - Client API wrapper
```
