# Collaboration Testing Guide

## Overview

The collaboration feature allows multiple users to share a synchronized pomodoro timer session in real-time.

## Prerequisites

1. Start the collaboration server: `npm run server` (runs on http://localhost:3004)
2. Start the client application: `npm run dev` (runs on http://localhost:3001)

## Testing Steps

### Step 1: Start a Session

1. Open the app in your browser (http://localhost:3001)
2. Click the video icon (📹) in the sidebar to "Start Session"
3. Enter a nickname (e.g., "Host User")
4. Select an avatar emoji
5. Click "Create Session"
6. Copy the generated invite link

### Step 2: Join the Session

1. Open a new browser window/tab or use incognito mode
2. Paste the invite link OR:
   - Go to http://localhost:3001
   - Click the users icon (👥) in the sidebar to "Join Session"
   - Enter the session ID from the first window
   - Enter a different nickname (e.g., "Guest User")
   - Select a different avatar
   - Click "Join Session"

### Step 3: Test Synchronized Timer

1. In the host window, start the pomodoro timer
2. Verify both windows show the timer running synchronously
3. Test pause/resume from host window
4. Verify guest cannot control timer (only host can)
5. Test timer completion and phase transitions

### Step 4: Test Chat Feature

1. Click the chat icon (💬) in either window
2. Send messages between participants
3. Verify messages appear in real-time for all participants

### Step 5: Test Participants Panel

1. Click the users icon (👥) to see participants list
2. Verify participant count and host indicator (crown icon)
3. Test leaving session from guest window
4. Verify participant list updates in host window

## Common Issues

### "Cannot click start/join session"

- **Cause**: Collaboration server not running
- **Solution**: Run `npm run server` in a separate terminal

### Timer not syncing

- **Cause**: WebSocket connection issues
- **Solution**: Check browser console for connection errors, restart server

### Connection timeout

- **Cause**: Firewall or network issues
- **Solution**: Check if port 3004 is accessible

## Testing Checklist

- [ ] Can create a new session
- [ ] Can join existing session via link
- [ ] Can join existing session via session ID
- [ ] Timer synchronizes between all participants
- [ ] Only host can control timer
- [ ] Chat messages work in real-time
- [ ] Participant list updates correctly
- [ ] Session persists when participants leave/rejoin
- [ ] Host migration works when original host leaves

## Collaboration Server Commands

```bash
# Start collaboration server
npm run server

# Check server status
curl http://localhost:3004/health

# View server logs
npm run server:logs
```

## Browser Testing

- Test with multiple browser tabs
- Test with different browsers (Chrome, Firefox, Safari)
- Test with incognito/private mode
- Test with network throttling enabled
