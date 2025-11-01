🕒 SlotSwapper (ServiceHive) — Smart Event Swapping Application
📘 Project Overview

SlotSwapper, also referred to as ServiceHive, is a MERN Stack web application that allows users to create and manage time-based events and exchange (swap) their slots with other users through a secure request system.

The app is designed for professionals, institutions, and teams to manage schedules efficiently — enabling users to handle timing conflicts by proposing and accepting swaps in a controlled manner.

🧩 Scope of This Documentation

This documentation covers:
✅ All backend API endpoints related to Event and SwapRequest modules.
❌ Excludes any endpoints from the Profile and Note modules.

Covered folders:

Event

SwapRequest

⚙️ Base Information
Field	Description
Base URL	http://localhost:9000
Content Type	application/json
Authentication Type	Bearer Token (Authorization: Bearer <token>)
Token Source	Obtain via the login endpoint in your workspace
Time Format	ISO 8601 UTC with trailing Z (e.g., 2025-11-04T09:00:00Z)

💡 Tip: Promote baseUrl and token to environment variables for Postman:

baseUrl = http://localhost:9000
token = <bearer token string>


Then use {{baseUrl}} and {{token}} in requests.

🧱 Project Architecture
SlotSwapper/
│
├── backend/
│   ├── models/
│   │   ├── userModel.js
│   │   ├── eventModel.js
│   │   └── requestModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── requestRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── requestController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   └── server.js
│
├── frontend/
│   ├── src/
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
│   │   ├── routes/
│   │   │   └── AxiosInstance.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── README.md

🧠 Core Features
👤 User Authentication

Register & Login via JWT token system.

Secure authentication middleware for protected routes.

📅 Event Management

Create Events with title, start time, end time, and status.

Update/Delete Events for authenticated users.

View All Events (own + others’ public/swappable events).

Auto-validation ensures no overlapping events or invalid time ranges.

🔄 Swap Request System

Send Swap Request to exchange event slots.

View Incoming Requests (others asking you to swap).

View Outgoing Requests (your sent requests).

Accept / Reject Requests.

On acceptance, user IDs of both events are swapped — maintaining consistent ownership logic.

🧠 Real-world Example

If User A has a meeting at 10 AM and User B has a workshop at 2 PM, and both agree to swap:

After acceptance, User A now owns the 2 PM slot, and User B owns the 10 AM slot.

The events remain same, only user ownership (userId) swaps — just like exchanging duties.

📡 API Documentation
📁 Folder: Event
🧩 A) Create Event

Endpoint:
POST {{baseUrl}}/api/v1/events/create

Description:
Creates a new event for the authenticated user.

Headers:

Content-Type: application/json
Authorization: Bearer {{token}}


Request Body:

{
  "title": "See Power Rangers",
  "startTime": "2025-11-04T09:00:00Z",
  "endTime": "2025-11-04T10:00:00Z",
  "status": "SWAPPABLE"
}


Response (201):

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

🧩 B) Get All Events

Endpoint:
GET {{baseUrl}}/api/v1/events

Description:
Lists all events for the authenticated user.

Headers:

Authorization: Bearer {{token}}


Response (200):
Array of event objects with similar fields as above.

🧩 C) Update Event

Endpoint:
PATCH {{baseUrl}}/api/v1/events/:id

Description:
Updates a specific event’s title, time, or status.

Headers:

Content-Type: application/json
Authorization: Bearer {{token}}


Request Body:

{
  "title": "Client Meeting",
  "status": "BOOKED"
}

🧩 D) Delete Event

Endpoint:
DELETE {{baseUrl}}/api/v1/events/:id

Description:
Deletes an event owned by the authenticated user.

Headers:

Authorization: Bearer {{token}}


Response (200):

{
  "response": {
    "success": true,
    "message": "Event deleted successfully"
  }
}

📁 Folder: SwapRequest
🔹 A) Get All Swappable Slots

Endpoint:
GET {{baseUrl}}/api/v1/swaps/swappable-slots

Description:
Retrieve all events marked as SWAPPABLE.

Headers:

Authorization: Bearer {{token}}

🔹 B) Create Swap Request

Endpoint:
POST {{baseUrl}}/api/v1/swaps/requests

Description:
Send a request to swap your event with another user's swappable event.

Headers:

Content-Type: application/json
Authorization: Bearer {{token}}


Request Body:

{
  "targetEventId": "targetEventId",
  "offeredEventId": "offeredEventId",
  "note": "Can swap this slot if you agree"
}

🔹 C) Respond to Swap Request

Endpoint:
PATCH {{baseUrl}}/api/v1/swaps/requests/:id/respond

Description:
Accept or reject an incoming swap request.

Headers:

Content-Type: application/json
Authorization: Bearer {{token}}


Request Body:

{
  "action": "ACCEPT"
}


On ACCEPT, both events’ userId fields swap ownership.

🔹 D) Get All Swap Requests

Endpoint:
GET {{baseUrl}}/api/v1/swaps/requests

Description:
Fetch all swap requests (both incoming and outgoing) for the authenticated user.

Headers:

Authorization: Bearer {{token}}


Response (200):

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

🧩 Frontend UI Overview
Page	Purpose	Key Components
Login / Signup	User authentication	AuthForm.jsx
Home Page	View all events	Navbar.jsx, EventCard.jsx
My Events	Manage your own events	CreateEvent.jsx, EventCard.jsx
Request Swapping	Manage incoming/outgoing requests	IncomingRequests.jsx, OutgoingRequests.jsx, SwapRequestList.jsx
Profile Page	View user details	ProfileInfo.jsx
🧩 Pending / Optional Enhancements

 Complete RequestSwapping UI Integration (Backend completed ✅).

 Add real-time notifications (Socket.io).

 Implement event filtering by date/status.

 Improve dashboard UX and responsiveness.

🧑‍💻 Developer Notes

Backend + Database (MongoDB) fully completed and tested via Postman.

Request Swapping logic implemented (userID swap verified).

Frontend UI missing only swap request visualization (API integration pending).

Optimized by updating local state instead of re-fetching events repeatedly.

🧪 Best Practices & Troubleshooting
Error	Common Cause	Solution
400	Invalid time format	Use ISO 8601 UTC with trailing Z
401	Missing/expired token	Refresh login token
404	Invalid event/request ID	Confirm MongoDB document IDs
409	Event overlap	Check start and end time logic
🧩 Postman Script Example
pm.test("Status is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Has event data", function () {
  const json = pm.response.json();
  pm.expect(json.response).to.have.property("data");
  pm.expect(json.response.data).to.have.property("_id");
});

📬 Contact

Developer: Sidharth Singh
Email: [your-email@example.com
]
Project Name: SlotSwapper (ServiceHive)
Role: Full Stack Developer (MERN)
Base URL: http://localhost:9000
