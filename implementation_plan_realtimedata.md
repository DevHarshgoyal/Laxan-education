# Real-Time Data Updates

Currently, the dashboard only fetches data when the page first loads. If the database changes (for example, if you run `node seed.js` with new data), the React app doesn't know about it until you manually refresh.

To fix this, we need the frontend to continuously check the backend for new data.

## Open Questions
- Are you okay with the frontend checking the backend for new data every 5 seconds (Polling)? This is the simplest approach and works perfectly for this dashboard without adding heavy external libraries.

## Proposed Changes

We will update the `useEffect` hooks in all the dashboard components to use `setInterval`. 

### `frontend/src/components/`
#### [MODIFY] All Component Files
We will update `ProfileCard.jsx`, `FeeStatus.jsx`, `MarksTab.jsx`, `SyllabusTab.jsx`, `AttendanceTab.jsx`, and `TeacherRemarks.jsx` to fetch data periodically.

**Example Change:**
```javascript
  useEffect(() => {
    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/profile`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.error("Error:", err));
    };
    
    // Fetch immediately on load
    fetchData();
    
    // Fetch every 5 seconds
    const intervalId = setInterval(fetchData, 5000);
    
    // Clean up when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
```

## Verification Plan
1. Start the React frontend and Node backend.
2. Open the dashboard in the browser.
3. Modify some data in `seed.js` (e.g., change the student's name) and run `node seed.js`.
4. Observe the dashboard updating automatically within 5 seconds without a manual page refresh.
