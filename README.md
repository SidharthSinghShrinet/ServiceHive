ServiceHive API Documentation Link to collection: 
ServiceHive

Scope of this document

Includes all endpoints and folders in the ServiceHive collection except folders named “Profile” and “Note”.
Covered folders: Event, SwapRequest
Covered standalone requests that belong to these folders.
Excludes any endpoints or details from “Profile” and “Note” folders.
Collection overview and authentication
Overview: ServiceHive provides endpoints to manage events (time slots) and swap requests among users. Typical flows include creating/updating/deleting events, listing swappable slots, creating swap requests, responding to swaps, and retrieving swap requests.
Base URL: The Event create endpoint shows a local server base (
http://localhost:9000
). Other endpoints in this documentation follow the same convention unless stated otherwise.
Authentication: Bearer token in the Authorization header.
Header: Authorization: Bearer
Obtain the token via the login flow in your workspace (see your “login” request/tab).
Content types: JSON for request/response bodies unless noted.
Environments and variables
Active environment(s): 
New Environment
Variable usage: No collection-level or request-level variables are referenced in the listed requests. You may want to promote base URL and token into environment variables for reuse, for example:
baseUrl: 
http://localhost:9000
token: bearer token string
Then set: URL = {{baseUrl}}/api/v1/... and header Authorization: Bearer {{token}}
Endpoints by folder
Folder: Event Link: 
Event
 Description: Manage calendar/event slots for an authenticated user. Create, list, update, and delete events. Times are expected to be ISO 8601 in UTC.

Requests in Event

A) Create Link: 
Create

Method and URL:
POST 
http://localhost:9000/api/v1/events/create
Description:
Create an event slot for the authenticated user. Supports SWAPPABLE, BOOKED, or CANCELLED status.
Path/query parameters: None.
Required headers:
Content-Type: application/json
Authorization: Bearer
Request body schema (application/json):
title: string (required)
startTime: string (ISO 8601 UTC, required). Include trailing Z, e.g. 2025-11-04T09:00:00Z
endTime: string (ISO 8601 UTC, required)
status: enum ["SWAPPABLE", "BOOKED", "CANCELLED"] (required)
Example request: { "title": "See Power Rangers", "startTime": "2025-11-04T09:00:00Z", "endTime": "2025-11-04T10:00:00Z", "status": "SWAPPABLE" }
Example success response (201): { "response": { "success": true, "message": "Event created successfully", "data": { "title": "See Power Rangers", "startTime": "2025-11-04T09:00:00Z", "endTime": "2025-11-04T10:00:00Z", "status": "SWAPPABLE", "user": "", "_id": "", "createdAt": "2025-11-01T18:25:51.422Z", "updatedAt": "2025-11-01T18:25:51.422Z", "__v": 0 } } }
Common error responses:
400 Bad Request: Missing/invalid fields; check ISO 8601 formats and that endTime > startTime.
401 Unauthorized: Missing/invalid bearer token.
409 Conflict: Overlapping event or business rule conflict.
Troubleshooting:
Ensure the Authorization header is set and token not expired.
Confirm timestamps are UTC with trailing Z and endTime is after startTime.
Scripts/tests:
No pre-request or test scripts present.
B) allEvent Link: 
allEvent

Method and URL: Likely GET; URL not saved in the request. Typical pattern:
GET 
http://localhost:9000/api/v1/events
 (assumed)
Description: List events for the authenticated user.
Path/query parameters:
Potential filters may exist (not defined). If supported, use query parameters such as status=SWAPPABLE or date ranges.
Required headers:
Authorization: Bearer
Request body: None.
Example success response (200): An array of event objects with fields similar to Create response’s data.
Common error responses:
401 Unauthorized: Missing/invalid token.
Troubleshooting:
If 404/400 occurs, confirm correct endpoint path from your server implementation.
Scripts/tests: None present.
C) updateEvent Link: 
updateEvent

Method and URL: The saved request shows method GET, but updates typically use PATCH/PUT. URL not saved. Typical pattern:
PATCH 
http://localhost:9000/api/v1/events/:id
 (assumed)
Description: Update fields (e.g., title, times, status) for an existing event owned by the user.
Path parameters:
id: string (event ID) — assumed.
Required headers:
Content-Type: application/json
Authorization: Bearer
Request body schema (application/json; fields optional based on what you update):
title?: string
startTime?: string (ISO 8601 UTC)
endTime?: string (ISO 8601 UTC)
status?: "SWAPPABLE" | "BOOKED" | "CANCELLED"
Example request: { "title": "Client Meeting", "status": "BOOKED" }
Example success response (200): { "response": { "success": true, "message": "Event updated successfully", "data": { ...updated event object... } } }
Common error responses:
400 Bad Request: Invalid fields or date logic errors.
401 Unauthorized: Missing/invalid token.
404 Not Found: Event ID does not exist or not owned by user.
409 Conflict: Overlap with another event.
Troubleshooting:
Ensure the path includes the correct event ID.
If the saved request currently uses GET, update it to PATCH/PUT with correct URL and body.
Scripts/tests: None present.
D) deleteEvent Link: 
deleteEvent

Method and URL: Saved method shows GET, but deletion typically uses DELETE. URL not saved. Typical pattern:
DELETE 
http://localhost:9000/api/v1/events/:id
 (assumed)
Description: Delete an event owned by the authenticated user.
Path parameters:
id: string (event ID) — assumed.
Required headers:
Authorization: Bearer
Request body: None.
Example success response (200/204): 200 example: { "response": { "success": true, "message": "Event deleted successfully" } }
Common error responses:
401 Unauthorized
404 Not Found
Troubleshooting:
Ensure HTTP method is DELETE and path includes a valid ID.
Scripts/tests: None present.
Folder: SwapRequest Link: 
SwapRequest
 Description: Manage swappable slots and swap requests between users, including listing available slots, creating swap requests, responding to them, and retrieving user swap requests.

Requests in SwapRequest

A) allSwappableSlots Link: 
allSwappableSlots

Method and URL: Saved as GET; URL not saved. Typical pattern:
GET 
http://localhost:9000/api/v1/swaps/swappable-slots
 (assumed)
Description: Retrieve a list of SWAPPABLE event slots.
Query parameters (assumed, if supported):
dateFrom?: ISO 8601
dateTo?: ISO 8601
page?, limit?
Required headers:
Authorization: Bearer
Request body: None.
Example success response (200): Array of events with status SWAPPABLE, each with id, title, startTime, endTime, user, etc.
Common error responses:
401 Unauthorized
Troubleshooting:
If your API supports filters, include them as query parameters.
Scripts/tests: None present.
B) createSwapRequest Link: 
createSwapRequest

Method and URL: Saved as GET; creation typically uses POST. URL not saved. Typical pattern:
POST 
http://localhost:9000/api/v1/swaps/requests
 (assumed)
Description: Create a swap request where the requester proposes exchanging one of their events with another user’s SWAPPABLE event.
Required headers:
Content-Type: application/json
Authorization: Bearer
Request body schema (assumed):
targetEventId: string (required) — the event user wants to swap into.
offeredEventId: string (required) — the requester’s event offered in exchange.
note?: string
Example request: { "targetEventId": "64f2c...abc", "offeredEventId": "64f2d...def", "note": "Can do 9–10 AM instead" }
Example success response (201): { "response": { "success": true, "message": "Swap request created", "data": { "_id": "", "targetEventId": "...", "offeredEventId": "...", "status": "PENDING", "createdAt": "...", "updatedAt": "..." } } }
Common error responses:
400 Bad Request: Missing/invalid fields.
401 Unauthorized
409 Conflict: Business rules (e.g., overlapping times or non-SWAPPABLE target).
Troubleshooting:
Ensure both event IDs are valid and belong to the appropriate users.
Scripts/tests: None present.
C) respondToSwapRequest Link: 
respondToSwapRequest

Method and URL: Saved as GET; responding typically uses PATCH. URL not saved. Typical pattern:
PATCH 
http://localhost:9000/api/v1/swaps/requests/:id/respond
 (assumed)
Description: Accept or reject a swap request addressed to the authenticated user.
Path parameters:
id: string (swap request ID) — assumed.
Required headers:
Content-Type: application/json
Authorization: Bearer
Request body schema (assumed):
action: "ACCEPT" | "REJECT" (required)
note?: string
Example request: { "action": "ACCEPT" }
Example success responses:
200 Accepted: { "response": { "success": true, "message": "Swap request accepted", "data": { ...updated swap request... } } }
200 Rejected: { "response": { "success": true, "message": "Swap request rejected", "data": { ...updated swap request... } } }
Common error responses:
400 Bad Request
401 Unauthorized
403 Forbidden: Attempt to respond to a request not addressed to the user.
404 Not Found
Troubleshooting:
Ensure the swap request is still PENDING and belongs to the correct recipient.
Scripts/tests: None present.
D) getSwapRequest Link: 
getSwapRequest

Method and URL: Saved as GET; URL not saved. Typical patterns:
GET 
http://localhost:9000/api/v1/swaps/requests
 (list current user’s requests), or
GET 
http://localhost:9000/api/v1/swaps/requests/:id
 (fetch a specific request)
Description: Retrieve swap requests created by or assigned to the authenticated user, or fetch a specific one by ID.
Path/query parameters (assumed):
Optional id in path for single request.
Optional filters: status=PENDING|ACCEPTED|REJECTED, page, limit.
Required headers:
Authorization: Bearer
Request body: None.
Example success response (200): { "response": { "success": true, "data": [ { "_id": "", "targetEventId": "...", "offeredEventId": "...", "status": "PENDING", "createdAt": "...", "updatedAt": "..." } ] } }
Common error responses:
401 Unauthorized
404 Not Found (for single fetch with unknown id)
Troubleshooting:
Verify the correct path for list vs. detail as implemented by your API.
Scripts/tests: None present.
General troubleshooting and best practices

Authentication:
Always send Authorization: Bearer . If using environments, store it as {{token}}.
Time values:
Use ISO 8601 with a trailing Z for UTC (e.g., 2025-11-04T09:00:00Z).
Ensure endTime is strictly after startTime.
Consistency of methods and URLs:
Some saved requests currently show method GET or missing URLs where typical REST design uses POST/PATCH/DELETE with defined paths. Adjust locally in your requests to match your server’s implementation.
Error handling:
400: Validate request schema and business rules.
401: Check token validity and header presence.
403: Check ownership/permissions for operations.
404: Verify the ID parameters and route.
409: Review scheduling conflicts and event statuses.
Scripts and tests

The documented requests show no pre-request or test scripts at this time.
Recommendation: Add basic tests to validate status codes and key response fields. Example for Create: pm.test("Status is 201", function () { pm.response.to.have.status(201); }); pm.test("Has event data", function () { const json = pm.response.json(); pm.expect(json.response).to.have.property("data"); pm.expect(json.response.data).to.have.property("_id"); });
Direct links to covered entities

Collection: 
ServiceHive
Folder: 
Event
Request: 
Create
Request: 
allEvent
Request: 
updateEvent
Request: 
deleteEvent
Folder: 
SwapRequest
Request: 
allSwappableSlots
Request: 
createSwapRequest
Request: 
respondToSwapRequest
Request: 
getSwapRequest
Notes about excluded content

Per your instruction, no endpoints or details from folders named “Profile” or “Note” are included.
