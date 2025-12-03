# Notification System Implementation

## Overview

A comprehensive notification system has been implemented for both students and tutors in the MeshSpire dashboard. The system provides real-time updates for important events like lesson confirmations, payment status, and upcoming meetings.

## Features Implemented

### Backend

#### 1. **Notification Model** (`backend/src/models/notification.model.ts`)

- Stores notifications with the following types:
  - `lesson_confirmed` - When a tutor confirms a lesson
  - `payment_success` - When payment is successful
  - `payment_failed` - When payment fails
  - `meeting_starting` - When a meeting is about to start (15 min reminder)
  - `new_lesson` - When a new lesson is created (for tutors)
- Tracks read/unread status
- Links to lessons, payments, and rooms

#### 2. **Notification Controller** (`backend/src/controller/notification.controller.ts`)

- `GET /api/v0/notifications` - Get all user notifications
- `GET /api/v0/notifications/unread-count` - Get unread count
- `PATCH /api/v0/notifications/:id/read` - Mark single notification as read
- `PATCH /api/v0/notifications/read-all` - Mark all as read
- `DELETE /api/v0/notifications/:id` - Delete a notification

#### 3. **Notification Triggers**

Updated existing controllers to create notifications:

**Lesson Controller:**

- Notifies student when tutor confirms a lesson
- Notifies relevant tutors when a new lesson is created

**Payment Controller:**

- Notifies student when payment succeeds/fails
- Notifies tutor when payment is received

**Meeting Notifications Utility:**

- Checks for upcoming meetings every 5 minutes
- Sends notifications 15 minutes before meetings start
- Runs automatically on server startup

### Frontend

#### 1. **Notification API Service** (`frontend/src/api/notification.ts`)

- Complete TypeScript interfaces for notifications
- API calls for fetching, marking as read, and deleting notifications

#### 2. **NotificationDropdown Component** (`frontend/src/Components/NotificationDropdown.tsx`)

Features:

- Bell icon with animated unread count badge (red circle with number)
- Large dropdown panel (400px width, 500px max height)
- Real-time notification list with scrolling
- Different icons for each notification type:
  - ✓ Green checkmark for lesson confirmed
  - 💳 Payment icon for payment success
  - ❌ Red error for payment failed
  - 📅 Event icon for meeting starting
  - 🎓 School icon for new lesson
- Shows notification time (e.g., "2m ago", "5h ago")
- Mark individual or all notifications as read
- Delete individual notifications
- Auto-refresh every 30 seconds
- Click notification to navigate to relevant page

#### 3. **Navbar Integration** (`frontend/src/Components/Navbar.tsx`)

- Replaced static notification icon with dynamic NotificationDropdown
- Maintains responsive design
- Works seamlessly with existing navbar features

## Notification Types by User Role

### For Students:

1. **Lesson Confirmed** - When a tutor accepts their lesson request
2. **Payment Success** - When their payment is processed successfully
3. **Payment Failed** - When their payment fails
4. **Meeting Starting** - 15-minute reminder before lesson starts

### For Tutors:

1. **New Lesson** - When a new lesson matching their subjects is created
2. **Payment Success** - When they receive payment for a lesson
3. **Meeting Starting** - 15-minute reminder before lesson starts

## How It Works

### Workflow Example 1: Student Creates Lesson

1. Student creates a new lesson
2. System finds all tutors who teach that subject
3. Notifications are created for matching tutors
4. Tutors see "New Lesson Available" in their notification dropdown

### Workflow Example 2: Tutor Confirms Lesson

1. Tutor clicks "Confirm" on a lesson
2. Notification is created for the student
3. Student sees "Lesson Confirmed" notification
4. Student can proceed to payment

### Workflow Example 3: Payment Flow

1. Student completes payment via Stripe
2. Payment verification endpoint is called
3. If successful:
   - Student gets "Payment Successful" notification
   - Tutor gets "Payment Received" notification
4. If failed:
   - Student gets "Payment Failed" notification

### Workflow Example 4: Meeting Reminder

1. Server checks for upcoming meetings every 5 minutes
2. Finds lessons starting within next 15 minutes
3. Sends notifications to both student and confirmed tutors
4. Users see "Meeting Starting Soon" with time countdown

## Technical Details

### Database Schema

```typescript
{
  userId: ObjectId,
  type: "lesson_confirmed" | "payment_success" | "payment_failed" | "meeting_starting" | "new_lesson",
  title: String,
  message: String,
  lessonId?: ObjectId,
  paymentId?: ObjectId,
  roomId?: String,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

- All endpoints require authentication via JWT token
- User can only access their own notifications
- Notifications are sorted by creation date (newest first)
- Limited to 50 most recent notifications

### Frontend State Management

- Uses React hooks (useState, useEffect)
- Automatic polling every 30 seconds for updates
- Click-outside detection to close dropdown
- Optimistic UI updates when marking as read

## Future Enhancements (Optional)

1. **WebSocket Integration**: Real-time push notifications using Socket.io
2. **Browser Notifications**: Desktop notifications for important events
3. **Email Notifications**: Send email digests for unread notifications
4. **Notification Preferences**: Let users customize which notifications they want
5. **Notification Sound**: Audio alert for new notifications
6. **Push Notifications**: Mobile push notifications via FCM/APNs
7. **Notification History**: Archive and search old notifications

## Testing Checklist

- [ ] Create a new lesson as student
- [ ] Verify tutors with matching subject receive notification
- [ ] Confirm lesson as tutor
- [ ] Verify student receives confirmation notification
- [ ] Process payment
- [ ] Verify both student and tutor receive payment notifications
- [ ] Create lesson for near-future time
- [ ] Wait and verify meeting reminder appears 15 min before
- [ ] Test mark as read functionality
- [ ] Test mark all as read functionality
- [ ] Test delete notification functionality
- [ ] Verify unread count badge updates correctly
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify notifications persist after page refresh

## Files Created/Modified

### Created:

- `backend/src/models/notification.model.ts`
- `backend/src/controller/notification.controller.ts`
- `backend/src/routes/notification.route.ts`
- `backend/src/utils/meetingNotifications.ts`
- `frontend/src/api/notification.ts`
- `frontend/src/Components/NotificationDropdown.tsx`

### Modified:

- `backend/src/server.ts` - Added notification routes and meeting check interval
- `backend/src/controller/lesson.controller.ts` - Added notification triggers
- `backend/src/controller/payment.controller.ts` - Added notification triggers
- `frontend/src/Components/Navbar.tsx` - Integrated NotificationDropdown

## Notes

- The system is designed to be non-intrusive - if notification creation fails, it doesn't break the main workflow
- Notifications are indexed by userId and isRead for fast queries
- The meeting notification checker runs every 5 minutes to minimize database load
- All notifications are automatically sorted by creation date (newest first)
