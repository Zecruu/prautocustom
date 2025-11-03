# Cancel Quote Request Feature

## Overview
Clients can now cancel their pending quote requests directly from their profile page.

## Implementation Details

### 1. API Endpoint
**File**: `src/app/api/quotes/[id]/route.ts` (NEW)

**Method**: DELETE

**Authorization**:
- Requires authentication
- Clients can only cancel their **own** quotes
- Admins can delete any quote
- Clients can only cancel quotes with **"pending"** status

**Functionality**:
- Deletes the quote from the database
- Also deletes associated quote responses
- Returns error if quote not found or user unauthorized

### 2. Client UI
**File**: `src/app/profile/page.tsx`

**Changes**:
- Added `cancellingQuoteId` state to track the quote being cancelled
- Added `handleCancelQuote()` function to handle the cancellation logic
- Added a delete/trash icon button next to the status badge for pending quotes
- Shows confirmation dialog before cancelling
- Shows loading spinner while cancelling
- Removes the quote from the UI after successful cancellation

**Button Features**:
- Only visible for quotes with "pending" status
- Red trash icon that turns lighter on hover
- Shows spinning loader while processing
- Disabled during cancellation to prevent double-clicks
- Includes tooltip "Cancel quote request"

## User Experience

1. **Client Profile Page**: When a client views their quotes, they'll see a red trash icon button next to "Pending" status badges
2. **Click to Cancel**: Clicking the button shows a confirmation dialog
3. **Confirmation**: "Are you sure you want to cancel this quote request? This action cannot be undone."
4. **Processing**: Button shows a loading spinner while the request is being processed
5. **Success**: Quote is removed from the list and a success message is shown
6. **Restrictions**: Once a quote has been responded to, it can no longer be cancelled by the client (only admins can delete it)

## Security & Validation

✅ User must be authenticated
✅ User can only cancel their own quotes
✅ Can only cancel quotes in "pending" state
✅ Confirmation required before deletion
✅ Cascading deletion of associated quote responses
✅ Admin override: Admins can delete any quote regardless of status

## Testing Checklist

- [ ] Verify cancel button only appears for pending quotes
- [ ] Verify confirmation dialog appears when clicking cancel
- [ ] Verify quote is removed from database after cancellation
- [ ] Verify associated quote responses are also deleted
- [ ] Verify users cannot cancel other users' quotes
- [ ] Verify users cannot cancel non-pending quotes (responded/accepted)
- [ ] Verify admins can delete any quote
- [ ] Verify loading state shows during cancellation
- [ ] Verify error handling for network failures

## Environment Variables
No new environment variables required.

## Dependencies
No new dependencies added.

