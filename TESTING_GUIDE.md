# Testing Guide - MindMirror AI

## 🚀 Quick Start

1. **Make sure the server is running**:
   ```bash
   npm run dev
   ```
   Server should be at: http://localhost:3000/

2. **Open your browser** and navigate to http://localhost:3000/

## 📝 Step-by-Step Testing

### Test 1: Landing Page & Navigation
1. Go to http://localhost:3000/
2. You should see the landing page
3. Click "Get Started" or navigate to `/home`

### Test 2: Profile System (MOST IMPORTANT)
1. Navigate to http://localhost:3000/profile
2. **Change Username**:
   - Type a new name in the "Username" field
   - Click "Save Changes"
   - You should see "Profile updated successfully!" toast
   - **Refresh the page (F5)**
   - ✅ Your new username should still be there!

3. **Upload Profile Image**:
   - Click "Change Avatar" button
   - Select an image (JPG, PNG, max 2MB)
   - Image should display immediately
   - Refresh page - image should persist

4. **Edit Bio**:
   - Type something in the Bio field
   - Click "Save Changes"
   - Refresh - bio should persist

5. **Toggle Notifications**:
   - Go to "Notifications" tab
   - Toggle any switch
   - Refresh - settings should persist

### Test 3: Sentiment Analysis (CRITICAL)
1. Navigate to http://localhost:3000/analysis

2. **Test High Stress**:
   - Type: "I feel so stressed and overwhelmed with work. Everything is too much."
   - Click "Analyze"
   - ✅ **Stress should be HIGH (60-90%)**
   - ✅ **Motivation should be LOW (20-40%)**
   - ✅ **Mood should show "Stressed" 😫**

3. **Test Happy/Confident**:
   - Clear the text
   - Type: "I'm feeling excited and confident about my future! Everything is going great!"
   - Click "Analyze"
   - ✅ **Stress should be LOW (10-30%)**
   - ✅ **Confidence should be HIGH (70-90%)**
   - ✅ **Motivation should be HIGH (70-90%)**
   - ✅ **Mood should show "Happy" 😊 or "Confident" 😎**

4. **Test Sad/Tired**:
   - Clear the text
   - Type: "I'm feeling sad and tired. I have no energy today."
   - Click "Analyze"
   - ✅ **Motivation should be LOW (20-40%)**
   - ✅ **Mood should show "Sad" 😢 or "Tired" 😴**

5. **Check Suggestions**:
   - After each analysis, scroll down
   - You should see personalized suggestions with icons
   - Suggestions should be relevant to your mood

### Test 4: Dashboard Analytics
1. **First, create some data**:
   - Go to Analysis page
   - Perform 3-5 different analyses with different moods
   - Use varied text (stressed, happy, tired, confident, etc.)

2. **View Dashboard**:
   - Navigate to http://localhost:3000/dashboard
   - ✅ **Wellness Score should be calculated** (not 0)
   - ✅ **Current Streak should show** (at least 1)
   - ✅ **Total Entries should match** your analyses count
   - ✅ **Charts should display** with real data

3. **Test Time Ranges**:
   - Click "7 Days", "14 Days", "30 Days" buttons
   - Charts should update (if you have data in those ranges)

4. **Check Charts**:
   - **Mood Trends**: Line chart with stress, motivation, confidence
   - **Emotion Distribution**: Pie chart showing emotion breakdown
   - **Weekly Analytics**: Bar chart by day of week

### Test 5: Data Persistence
1. Perform an analysis
2. Go to Dashboard and note your stats
3. **Close the browser completely**
4. Reopen browser and go to http://localhost:3000/dashboard
5. ✅ **All your data should still be there!**

### Test 6: Streak System
1. Perform an analysis today
2. Check Dashboard - Current Streak should be 1 (or increment)
3. Come back tomorrow and perform another analysis
4. Streak should increment to 2
5. Skip a day - streak should reset to 1

## 🐛 Common Issues & Solutions

### Issue: "Cannot read properties of undefined"
**Solution**: Make sure you're on a page that's wrapped in the ProfileProvider
- Dashboard, Analysis, Profile pages should work
- If on landing page, navigate to /home first

### Issue: Profile changes don't persist
**Solution**: 
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Check if `mindmirror_user_profile` exists
4. If not, there might be a localStorage permission issue
5. Try in incognito mode or different browser

### Issue: Metrics still showing 50%
**Solution**:
1. Make sure you're typing actual emotional words
2. Try these exact phrases:
   - "I am very stressed and anxious"
   - "I feel extremely happy and confident"
   - "I'm so tired and exhausted"
3. Check browser console (F12) for errors

### Issue: Charts not showing
**Solution**:
1. You need at least 1 analysis entry
2. Go to Analysis page first
3. Perform 2-3 analyses
4. Then check Dashboard

### Issue: Page is blank
**Solution**:
1. Check browser console (F12) for errors
2. Make sure server is running
3. Try refreshing the page
4. Clear browser cache (Ctrl+Shift+Delete)

## 🔍 Debugging Tips

### Check Browser Console
1. Press F12 to open DevTools
2. Go to "Console" tab
3. Look for red error messages
4. Share any errors you see

### Check Network Tab
1. Press F12 → Network tab
2. Refresh page
3. Look for failed requests (red)
4. Check if all JS files loaded

### Check Local Storage
1. Press F12 → Application tab
2. Expand "Local Storage"
3. Click on your localhost URL
4. You should see keys like:
   - `mindmirror_user_profile`
   - `mindmirror_entries`
   - `mindmirror_analyses`

### Check Server Terminal
Look for errors in the terminal where `npm run dev` is running

## ✅ Expected Behavior Checklist

- [ ] Landing page loads
- [ ] Can navigate to all pages
- [ ] Profile name persists after refresh
- [ ] Profile image uploads and persists
- [ ] Sentiment analysis shows dynamic values (NOT 50%)
- [ ] Mood changes based on text input
- [ ] Suggestions appear after analysis
- [ ] Dashboard shows real data
- [ ] Charts display correctly
- [ ] Streak counter works
- [ ] Data persists after browser close
- [ ] All animations work smoothly
- [ ] Mobile responsive (try resizing browser)

## 📸 What You Should See

### Analysis Page - Stressed Input
```
Input: "I feel stressed and overwhelmed"
Expected:
- Stress: 70-90% (RED bar)
- Motivation: 20-40% (short bar)
- Confidence: 30-50% (medium bar)
- Mood: 😫 Stressed
- State: "High Stress" or "Burnout Risk"
```

### Analysis Page - Happy Input
```
Input: "I'm excited and confident!"
Expected:
- Stress: 10-30% (short RED bar)
- Motivation: 70-90% (long PURPLE bar)
- Confidence: 70-90% (long BLUE bar)
- Mood: 😊 Happy or 😎 Confident
- State: "Thriving" or "Balanced"
```

### Dashboard
```
Expected to see:
- Wellness Score: 40-80% (calculated)
- Current Streak: 1+ days
- Total Entries: Your analysis count
- 3 Charts with data
- Quick stats at bottom
```

## 🆘 Still Having Issues?

If something isn't working:

1. **Share the error message** from browser console (F12)
2. **Share which test failed** (e.g., "Test 3, step 2")
3. **Share what you see** vs what you expected
4. **Check the terminal** for server errors

## 🎯 Success Criteria

You'll know everything is working when:
1. ✅ Profile changes persist after refresh
2. ✅ Stress/motivation/confidence change dynamically
3. ✅ Dashboard shows real charts with your data
4. ✅ Mood emoji changes based on your input
5. ✅ Suggestions are relevant to your mood
6. ✅ Data survives browser restart

---

**Current Status**: Server running at http://localhost:3000/
**Next**: Follow Test 1 → Test 2 → Test 3 in order
