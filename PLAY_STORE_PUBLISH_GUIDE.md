# 📱 Publishing to Google Play Store - Step-by-Step Guide

This guide walks you through publishing your Cleaning Rota app to the Google Play Store.

---

## Prerequisites Checklist

Before starting, make sure you have:
- ✅ Screenshots of your app ready
- ✅ App tested and working on Android
- ✅ Google account (for Play Console)
- ✅ $25 USD for one-time Google Play Developer registration fee
- ✅ Privacy policy (if your app collects any user data)

---

## Step 1: Generate Signing Key ⚠️ CRITICAL

Every Android app must be digitally signed. Run this from your project root:

```bash
cd /home/user/cleaning-rota-app

keytool -genkey -v -keystore cleaning-rota.keystore -alias cleaningrota -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be prompted for:**
- Keystore password (create a strong password)
- Key password (can be same as keystore password)
- Your name
- Organization, City, State, Country (optional - can skip with Enter)
- Confirm with "yes"

**⚠️ EXTREMELY IMPORTANT:**
- **Write down both passwords in a secure place!**
- **Back up the `cleaning-rota.keystore` file!**
- Store these in a password manager or safe location
- If you lose these, you can NEVER update your app again - you'd have to create a new app listing

---

## Step 2: Create key.properties File

Create a file to store your signing credentials:

```bash
# From your project root
cd /home/user/cleaning-rota-app

# Create the file (edit with your actual passwords!)
cat > android/key.properties << 'EOF'
storePassword=YOUR_KEYSTORE_PASSWORD_HERE
keyPassword=YOUR_KEY_PASSWORD_HERE
keyAlias=cleaningrota
storeFile=../cleaning-rota.keystore
EOF
```

**Replace:**
- `YOUR_KEYSTORE_PASSWORD_HERE` with your actual keystore password
- `YOUR_KEY_PASSWORD_HERE` with your actual key password

**Protect this file:**
```bash
# Add to .gitignore so passwords aren't committed
echo "android/key.properties" >> .gitignore
echo "*.keystore" >> .gitignore
```

---

## Step 3: Build the Release AAB

AAB (Android App Bundle) is the required format for Google Play Store.

```bash
# Make sure you're in the project root
cd /home/user/cleaning-rota-app

# Build your web app and sync
npm run cap:sync

# Navigate to android folder
cd android

# Build the release AAB (this will use your signing key)
./gradlew bundleRelease
```

**Wait for the build to complete** (may take 1-5 minutes)

**Your signed AAB will be at:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

To verify it exists:
```bash
ls -lh app/build/outputs/bundle/release/app-release.aab
```

---

## Step 4: Create Google Play Developer Account

1. **Go to Google Play Console:**
   - Visit: https://play.google.com/console
   - Sign in with your Google account

2. **Register as a Developer:**
   - Accept the Developer Distribution Agreement
   - Pay the $25 registration fee (one-time, lifetime)
   - Complete your account details

3. **Wait for verification:**
   - Usually instant, but can take up to 48 hours
   - You'll receive an email when approved

---

## Step 5: Create Your App in Play Console

1. **Click "Create app"** (big button on the dashboard)

2. **Fill in basic details:**
   - **App name:** "Cleaning Rota" (or your preferred name)
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** Check all boxes to confirm

3. **Click "Create app"**

---

## Step 6: Complete the Store Listing

### App Details

Go to **"Store Presence" → "Main store listing"**

**Required information:**

1. **App name:** Cleaning Rota
2. **Short description** (80 characters max):
   ```
   Organize household chores with your housemates. Fair rotation, happy home!
   ```

3. **Full description** (4000 characters max):
   ```
   🏠 Cleaning Rota App - Fair Household Chores Made Easy

   Tired of arguments about who should do the dishes? The Cleaning Rota app helps housemates organize and track cleaning duties with automatic rotation.

   ✨ KEY FEATURES:
   • Add housemates and assign cleaning tasks
   • Automatic weekly rotation - everyone takes a turn
   • Track task completion
   • Fair distribution of chores
   • Simple, beautiful interface
   • Works offline

   📋 PERFECT FOR:
   • Shared apartments and houses
   • College dorms
   • Families
   • Any group living situation

   🎯 HOW IT WORKS:
   1. Add your housemates
   2. Create your cleaning tasks (dishes, trash, bathroom, etc.)
   3. The app automatically rotates tasks each week
   4. Everyone knows what they need to do

   No more confusion, no more arguments - just a clean home and happy housemates!

   💚 Free to use, no ads, no subscriptions.
   ```

4. **App icon:**
   - Upload 512x512 PNG
   - Should be your app's icon (if you haven't created one yet, you can use a placeholder)

5. **Feature graphic:**
   - 1024 x 500 PNG
   - This appears at the top of your store listing
   - Can be a banner with your app name and tagline

### Screenshots

**Phone screenshots (REQUIRED):**
- Upload your screenshots here
- Need at least 2 screenshots
- Recommended: 1080 x 2340 or similar phone dimensions
- Show key features: adding housemates, creating tasks, task rotation

**7-inch tablet screenshots (OPTIONAL):**
- Not required but recommended if you want tablet users

**10-inch tablet screenshots (OPTIONAL):**
- Not required but recommended if you want tablet users

### Categorization

1. **App category:** Lifestyle or Productivity
2. **Tags:** Add relevant tags like "home", "organization", "chores"

### Contact Details

1. **Email:** Your email address (will be public)
2. **Website:** (optional)
3. **Phone:** (optional)

### Privacy Policy

**Required if your app collects any user data**

If your app stores data locally only (no server):
```
Privacy Policy for Cleaning Rota App

Data Storage:
All data is stored locally on your device. We do not collect, transmit, or store any personal information on external servers.

Data Collection:
We do not collect any personal information. All housemate names, tasks, and schedules remain on your device.

Third-Party Access:
No third parties have access to your data.

Contact:
For questions, email: your-email@example.com

Last updated: [Today's date]
```

You can host this on GitHub Pages or create a simple webpage.

---

## Step 7: Content Rating

Go to **"Content rating"** in the left menu:

1. Click **"Start questionnaire"**
2. **Enter email address**
3. **Answer questions honestly:**
   - Does your app contain violence? → No
   - Does your app contain sexual content? → No
   - Does your app contain bad language? → No
   - Does your app simulate gambling? → No
   - Does your app allow user interaction? → No (unless you add chat/social features)
   - Does your app share user location? → No
   - Does your app access sensitive data? → No

4. **Click "Submit"**
5. **Apply rating**

You'll get ratings for different regions (ESRB, PEGI, etc.)

---

## Step 8: Select Countries and Regions

Go to **"Production" → "Countries/regions"**

1. Click **"Add countries/regions"**
2. Select countries where you want to publish
   - Easy option: Select "All countries"
   - Or select specific countries
3. Click **"Add"**

---

## Step 9: Upload Your AAB

Go to **"Production" → "Releases"**

1. Click **"Create new release"**

2. **Upload your AAB:**
   - Click "Upload"
   - Select: `android/app/build/outputs/bundle/release/app-release.aab`
   - Wait for upload to complete
   - Google Play will process it (may take a few minutes)

3. **Release name:** 1.0.0 (or 1 - Version 1.0.0)

4. **Release notes:**
   ```
   Initial release of Cleaning Rota App

   Features:
   • Add and manage housemates
   • Create cleaning tasks
   • Automatic weekly task rotation
   • Track task completion
   • Simple and intuitive interface
   ```

5. Click **"Save"** (bottom right)

---

## Step 10: Review and Rollout

1. **Review everything:**
   - Check that all required sections have a green checkmark
   - If any section has a warning, click it and complete the requirements

2. **When all sections are complete:**
   - Go to **"Publishing overview"** in the left menu
   - You should see "Ready to send XX items for review"

3. **Click "Send XX items for review"**

4. **Confirm and submit!** 🎉

---

## Step 11: Wait for Review

**Timeline:**
- Review typically takes 1-3 days
- Sometimes as quick as a few hours
- You'll receive an email when status changes

**Possible outcomes:**
- ✅ **Approved:** Your app goes live!
- ⚠️ **Rejected:** You'll get detailed reasons and can fix issues and resubmit

---

## After Approval

Once approved, your app will be live on Google Play Store!

**Share your app:**
- Your store URL will be: `https://play.google.com/store/apps/details?id=com.cleaningrota.app`
- Share this link with users

**Monitor your app:**
- Check Google Play Console regularly
- Respond to user reviews
- Monitor crash reports

---

## Updating Your App Later

When you make changes:

1. **Update version in `android/app/build.gradle`:**
   ```gradle
   versionCode 2        // Increment by 1 each release
   versionName "1.1"    // Your display version
   ```

2. **Build new AAB:**
   ```bash
   npm run cap:sync
   cd android
   ./gradlew bundleRelease
   ```

3. **Upload to Play Console:**
   - Go to Production → Releases
   - Create new release
   - Upload new AAB
   - Add release notes
   - Submit

---

## Troubleshooting

### Build fails with "keystore not found"
- Make sure `cleaning-rota.keystore` is in your project root
- Check `android/key.properties` has correct `storeFile` path

### Build fails with "keystore password incorrect"
- Double-check passwords in `android/key.properties`
- Make sure there are no extra spaces

### AAB upload rejected
- Check error message in Play Console
- Common issues:
  - Need to increment versionCode
  - Need to fix app signing issues
  - Missing required permissions declarations

### App rejected during review
- Read the rejection email carefully
- Common issues:
  - Missing privacy policy
  - Incorrect content rating
  - App crashes on startup
  - Missing required permissions explanations

---

## Quick Command Reference

```bash
# Full release build process
cd /home/user/cleaning-rota-app
npm run cap:sync
cd android
./gradlew bundleRelease

# Find your AAB
ls -lh app/build/outputs/bundle/release/app-release.aab

# Build a test APK (not for Play Store)
./gradlew assembleDebug
```

---

## 🎉 Congratulations!

You're now ready to publish your app to the Google Play Store!

Take your time with each step, and don't hesitate to revisit sections if needed. The first publish is always the most time-consuming - updates are much faster!

Good luck with your app launch! 🚀
