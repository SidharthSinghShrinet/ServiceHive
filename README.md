# SlotSwapper (ServiceHive) — Smart Event Swapping Application

A MERN-stack application for creating, managing, and safely swapping time-based event slots between users. This documentation focuses on the backend API surface for Event and SwapRequest modules (Profile and Note modules are intentionally excluded).

---

Table of contents
- Project overview
- Quick start
- Base information & conventions
- Project architecture
- Authentication
- Event API
  - Create Event
  - Get All Events
  - Update Event
  - Delete Event
- SwapRequest API
  - Get All Swappable Slots
  - Create Swap Request
  - Respond to Swap Request (Accept / Reject)
  - Get All Swap Requests
- Frontend UI overview
- Pending & optional enhancements
- Developer notes
- Best practices & troubleshooting
- Postman test examples
- Contact

---

Project overview
----------------
SlotSwapper (aka ServiceHive) lets users create time-based events and exchange ownership of events (slots) with other users through a request/response workflow. Ownership swap is performed by swapping the userId fields of two Event documents when a swap request is accepted.

This documentation covers:
- All backend endpoints related to Event and SwapRequest modules.
- Excludes Profile and Note endpoints.

Quick start
-----------
1. Start backend server (default): http://localhost:9000
2. Use the login endpoint to obtain a Bearer token.
3. Call protected endpoints passing header: Authorization: Bearer <token>
4. Time values must be ISO 8601 UTC strings with trailing Z (example: `2025-11-04T09:00:00Z`).

Base information & conventions
------------------------------
- Base URL (default): http://localhost:9000
- Content-Type: application/json
- Authentication: Bearer Token (Authorization: Bearer <token>)
- Token source: login endpoint in your workspace
- Time format: ISO 8601 UTC with trailing Z (e.g., `2025-11-04T09:00:00Z`)
- Tip for Postman: promote baseUrl and token to environment variables:
  - baseUrl = http://localhost:9000
  - token = <bearer token string>
  Then use `{{baseUrl}}` and `{{token}}` in requests.

🧱 Project Architecture
------------------------
Top-level structure
SlotSwapper/
├── backend/
│   ├── config/
│   │   └── db.js                # DB connection setup (mongoose)
│   ├── controllers/
│   │   ├── authController.js    # login/register, token issuance
│   │   ├── eventController.js   # business logic for events (create/update/delete/list)
│   │   └── requestController.js # swap request lifecycle (create/respond/list)
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT validation, sets req.user
│   ├── models/
│   │   ├── userModel.js         # User schema (credentials, profile info)
│   │   ├── eventModel.js        # Event schema (title, startTime, endTime, user/ref, status)
│   │   └── requestModel.js      # SwapRequest schema (targetEventId, offeredEventId, status, note)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/v1/auth/**
│   │   ├── eventRoutes.js       # /api/v1/events/**
│   │   └── requestRoutes.js     # /api/v1/swaps/**
│   ├── services/                # OPTIONAL (recommended): service layer for complex business logic
│   │   └── swapService.js       # atomic swap operations, conflict resolution helpers
│   └── server.js                # express app, middleware registration, route registration
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js # single Axios instance with baseUrl + auth interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── IncomingRequests.jsx
│   │   │   ├── OutgoingRequests.jsx
│   │   │   └── SwapRequestList.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MyEvents.jsx
│   │   │   └── RequestSwapping.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── eventSlice.js
│   │   │   └── userSlice.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── README.md

Authentication
--------------
- JWT-based auth (Register / Login available in authRoutes).
- Protected routes require header:
  Authorization: Bearer <token>
- The auth middleware validates token and sets req.user (or equivalent).

Event API
---------
Folder: Event

A) Create Event
- Endpoint:
  POST {{baseUrl}}/api/v1/events/create
- Description:
  Creates a new event for the authenticated user.
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Request body (example):
  {
    "title": "See Power Rangers",
    "startTime": "2025-11-04T09:00:00Z",
    "endTime": "2025-11-04T10:00:00Z",
    "status": "SWAPPABLE"
  }
- Time constraints & validations:
  - startTime and endTime must be valid ISO 8601 UTC timestamps with trailing Z.
  - endTime must be after startTime.
  - Auto-validation prevents overlapping events for the same user.
- Response (201) (example):
  {
    "response": {
      "success": true,
      "message": "Event created successfully",
      "data": {
        "title": "See Power Rangers",
        "startTime": "2025-11-04T09:00:00Z",
        "endTime": "2025-11-04T10:00:00Z",
        "status": "SWAPPABLE",
        "user": "userId",
        "_id": "eventId",
        "createdAt": "2025-11-01T18:25:51.422Z"
      }
    }
  }

B) Get All Events
- Endpoint:
  GET {{baseUrl}}/api/v1/events
- Description:
  Lists events relevant to the authenticated user. Typically this includes:
  - The user's own events.
  - Other users’ events that are public / swappable (depending on implementation).
- Headers:
  - Authorization: Bearer {{token}}
- Response (200):
  - An array of event objects. Fields typically include:
    - _id, title, startTime, endTime, status, user (owner's id), createdAt, etc.

C) Update Event
- Endpoint:
  PATCH {{baseUrl}}/api/v1/events/:id
- Description:
  Updates a specific event’s metadata (title, time range, status).
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Request body (example):
  {
    "title": "Client Meeting",
    "status": "BOOKED"
  }
- Validations:
  - Only the owner (authenticated user) can update their event.
  - Time range changes must not introduce overlaps for that owner's events.
- Response codes:
  - 200 on successful update with updated event data.
  - 400 / 409 for invalid times or overlaps.
  - 401 for unauthorized access.

D) Delete Event
- Endpoint:
  DELETE {{baseUrl}}/api/v1/events/:id
- Description:
  Deletes an event owned by the authenticated user.
- Headers:
  - Authorization: Bearer {{token}}
- Response (200) (example):
  {
    "response": {
      "success": true,
      "message": "Event deleted successfully"
    }
  }

SwapRequest API
---------------
Folder: SwapRequest

Notes about semantics:
- The swap workflow generally involves:
  1. A requester selects one of their own events (offeredEventId) and another user's swappable event (targetEventId).
  2. The requester creates a SwapRequest.
  3. The target event owner receives an incoming request and may ACCEPT or REJECT.
  4. On ACCEPT, ownership (userId) of both related events is swapped; the event documents remain the same otherwise.
  5. Status transitions commonly include: PENDING -> ACCEPTED / REJECTED (implementation dependent).

A) Get All Swappable Slots
- Endpoint:
  GET {{baseUrl}}/api/v1/swaps/swappable-slots
- Description:
  Retrieve all events marked as `SWAPPABLE` (available for swap).
- Headers:
  - Authorization: Bearer {{token}}
- Response (200):
  - Array of event objects where status === "SWAPPABLE".

B) Create Swap Request
- Endpoint:
  POST {{baseUrl}}/api/v1/swaps/requests
- Description:
  Send a request to swap your event with another user's swappable event.
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Request body (example):
  {
    "targetEventId": "targetEventId",
    "offeredEventId": "offeredEventId",
    "note": "Can swap this slot if you agree"
  }
- Validations / business rules:
  - The target event must be in SWAPPABLE state (or otherwise eligible).
  - The offered event must belong to the requester.
  - Events cannot overlap after swap for either user (controller should verify).
- Response (201) (typical):
  - Newly created SwapRequest resource with status "PENDING" and metadata like createdAt.

C) Respond to Swap Request
- Endpoint:
  PATCH {{baseUrl}}/api/v1/swaps/requests/:id/respond
- Description:
  Accept or reject an incoming swap request.
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Request body (example):
  {
    "action": "ACCEPT"
  }
  Valid action values: "ACCEPT" or "REJECT" (case-sensitive as per API implementation).
- Behavior when action is "ACCEPT":
  - Both events’ userId fields are swapped, thus transferring ownership.
  - Request status updated to "ACCEPTED" (or equivalent).
  - Any further business logic (notifications, auditing) executed as implemented.
- Behavior when action is "REJECT":
  - Request status updated to "REJECTED".
- Responses:
  - 200 on success, with updated request or success message.
  - 400 for invalid action or invalid request id.
  - 401/403 for unauthorized responders.

D) Get All Swap Requests
- Endpoint:
  GET {{baseUrl}}/api/v1/swaps/requests
- Description:
  Fetch all swap requests related to the authenticated user — includes both:
  - Incoming requests (others requesting to swap with your events)
  - Outgoing requests (requests you sent)
- Headers:
  - Authorization: Bearer {{token}}
- Response (200) (example shape):
  {
    "response": {
      "success": true,
      "data": [
        {
          "_id": "req123",
          "targetEventId": "64f2c123...",
          "offeredEventId": "64f2d567...",
          "status": "PENDING",
          "createdAt": "2025-11-01T18:25:51.422Z"
        }
      ]
    }
  }

Frontend UI overview
--------------------
Pages and key components:
- Login / Signup: AuthForm.jsx
- Home Page (View all events): Navbar.jsx, EventCard.jsx
- My Events (Manage your own events): CreateEvent.jsx, EventCard.jsx
- Request Swapping (Manage incoming/outgoing requests): IncomingRequests.jsx, OutgoingRequests.jsx, SwapRequestList.jsx
- Profile Page: ProfileInfo.jsx

Notes:
- Backend and DB (MongoDB) are fully implemented and tested via Postman.
- Frontend is mostly implemented; swap-request visualization and integration are pending.

Pending / optional enhancements
-------------------------------
- Complete RequestSwapping UI integration (frontend) — Backend completed ✅
- Add real-time notifications (Socket.io)
- Implement event filtering by date / status in frontend
- Improve dashboard UX and responsiveness
- Consider real-time conflict resolution / transaction handling for simultaneous accept requests

Developer notes
---------------
- Swap logic: On acceptance of a swap request, only the ownership (userId) fields are swapped between the two event documents. Event metadata (title, start/end times) remains unchanged.
- Optimizations: Use local state updates after swaps rather than re-fetching full event lists when feasible to improve performance.
- All backend validations are implemented to ensure:
  - Ownership constraints (only owners can modify/delete events).
  - Non-overlapping events per user.
  - Valid ISO timestamps.

Best practices & troubleshooting
-------------------------------
Common errors and solutions:
- 400 Bad Request — Invalid time format: Ensure ISO 8601 UTC with trailing Z (e.g., `2025-11-04T09:00:00Z`).
- 401 Unauthorized — Missing or expired token: Re-login and refresh token.
- 404 Not Found — Invalid event or request ID: Verify MongoDB document IDs and that resources exist.
- 409 Conflict — Event overlap: Check start and end time logic; ensure new/updated event does not overlap existing owned events.

Postman: tips and example tests
-------------------------------
- Promote variables:
  - baseUrl = http://localhost:9000
  - token = <bearer token>
- Use `{{baseUrl}}/api/v1/events/create`, headers: Authorization: Bearer {{token}}

Example Postman tests:
pm.test("Status is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Has event data", function () {
  const json = pm.response.json();
  pm.expect(json.response).to.have.property("data");
  pm.expect(json.response.data).to.have.property("_id");
});

Important API usage notes
-------------------------
- Always include the Authorization header for protected endpoints.
- When responding to requests (ACCEPT action), the server ensures both event documents' user ownership fields swap atomically (or with safeguards) to maintain consistent ownership.
- Clients should validate times before sending to avoid 400/409 errors and show helpful messages to users.

Contact
-------
Developer: Sidharth Singh  
Email: [your-email@example.com]  
Project Name: SlotSwapper (ServiceHive)  
Role: Full Stack Developer (MERN)  
Base URL: http://localhost:9000

If you want, I can:
- Convert this into a more compact OpenAPI/Swagger spec.
- Produce Postman collection JSON with all endpoints wired and tests added.
- Create example frontend API integration code (Axios) for the swap flows.
