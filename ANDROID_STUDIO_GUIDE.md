# 🤖 Android Studio Beginner's Guide

A step-by-step guide for deploying your Cleaning Rota app using Android Studio for the first time.

---

## Part 1: Installing Android Studio

### Step 1: Download and Install

1. **Download Android Studio:**
   - Go to https://developer.android.com/studio
   - Click "Download Android Studio"
   - Accept the terms and download

2. **Install Android Studio:**
   - **Windows:** Run the `.exe` file and follow the installer
   - **Mac:** Open the `.dmg` file and drag Android Studio to Applications
   - **Linux:** Extract the `.tar.gz` and run `studio.sh` from the `bin/` folder

3. **First Launch Setup:**
   - When you first open Android Studio, it will run the Setup Wizard
   - Choose "Standard" installation (recommended)
   - This will download the Android SDK, emulator, and other tools
   - Wait for everything to download (this can take 10-30 minutes)

---

## Part 2: Opening Your Project

### Step 1: Build Your Web App

Before opening in Android Studio, you need to build your web app:

```bash
# Make sure you're in the project directory
cd /home/user/cleaning-rota-app

# Install dependencies (if you haven't already)
npm install

# Build and sync your web app to the Android platform
npm run cap:sync
```

This command:
- Builds your React app (`npm run build`)
- Copies the built files to the Android project
- Syncs Capacitor plugins

### Step 2: Open the Android Project

**Option A - Using the command line (easiest):**
```bash
npm run cap:android
```

**Option B - Opening manually in Android Studio:**
1. Open Android Studio
2. Click "Open" on the welcome screen
3. Navigate to your project folder
4. Select the **`android` folder** (NOT the root folder!)
5. Click "Open"

### Step 3: Wait for Gradle Sync

When the project opens, Android Studio will:
- Index your files
- Download dependencies (Gradle sync)
- You'll see a progress bar at the bottom

**This can take 5-15 minutes the first time!** Be patient.

---

## Part 3: Understanding Android Studio Interface

Once your project is loaded, here's what you'll see:

```
┌─────────────────────────────────────────────────────┐
│  File  Edit  View  Navigate  Code  Build  Run      │ ← Menu bar
├──────────┬──────────────────────────┬───────────────┤
│          │                          │               │
│ Project  │   Code Editor            │  Gradle       │
│ Files    │   (Java/XML files)       │  Console      │
│          │                          │               │
│ android/ │                          │ Build output  │
│  ├─app/  │                          │ shows here    │
│  ├─gradle│                          │               │
│          │                          │               │
├──────────┴──────────────────────────┴───────────────┤
│  Logcat (shows app logs when running)               │
└─────────────────────────────────────────────────────┘
```

### Key Areas:

1. **Project Files (Left Sidebar):**
   - Browse your Android project files
   - Important: `app/src/main/` contains your app code

2. **Code Editor (Center):**
   - Edit Java, Kotlin, XML files
   - Most of your app logic comes from your React web app

3. **Top Toolbar:**
   - **Device Selector:** Choose emulator or physical device
   - **Run Button (▶️):** Build and run your app
   - **Build Menu:** Build APK or Bundle

4. **Bottom Panel:**
   - **Logcat:** See app logs and errors
   - **Build:** See build progress
   - **Terminal:** Command line within Android Studio

---

## Part 4: Setting Up an Emulator (Virtual Device)

If you don't have an Android phone, you can use an emulator:

### Step 1: Open Device Manager

1. Click the phone icon in the top toolbar (📱)
   OR
2. Go to **Tools → Device Manager**

### Step 2: Create a Virtual Device

1. Click **"Create Device"**
2. Choose a device:
   - **Recommended:** Pixel 5 or Pixel 6
   - Click **"Next"**
3. Select a System Image:
   - Choose the latest version (e.g., "Tiramisu" - API 33)
   - If not installed, click **"Download"** next to it
   - Click **"Next"**
4. Name your emulator (or keep default)
5. Click **"Finish"**

### Step 3: Start the Emulator

1. In Device Manager, click the ▶️ play button next to your emulator
2. Wait for it to boot up (takes 1-2 minutes first time)
3. You'll see an Android phone screen appear

---

## Part 5: Running Your App

### Using an Emulator:

1. **Make sure your emulator is running** (see Part 4)
2. **Select your emulator** in the device dropdown (top toolbar)
3. **Click the green ▶️ Run button**
4. Wait for the app to build and install
5. Your app will automatically open on the emulator!

### Using a Real Android Device:

1. **Enable Developer Options on your phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to Settings → Developer Options
   - Turn on "USB Debugging"

3. **Connect your phone:**
   - Connect via USB cable
   - On your phone, allow USB debugging when prompted

4. **Select your device:**
   - Your phone should appear in the device dropdown
   - Click the green ▶️ Run button

---

## Part 6: Viewing Logs (Debugging)

If something goes wrong:

1. **Open Logcat** (bottom panel, or View → Tool Windows → Logcat)
2. **Filter logs:**
   - In the search box, type your app name or "Capacitor"
   - This shows only relevant logs
3. **Look for errors:**
   - Red lines = errors
   - Orange lines = warnings
   - Click on them to see details

---

## Part 7: Making Changes to Your App

**Important:** Your app's UI and logic are in your React code, NOT in Android Studio!

### Workflow:

1. **Edit your React code** (in `src/` folder using your normal code editor)
2. **Build and sync:**
   ```bash
   npm run cap:sync
   ```
3. **Run in Android Studio** (click ▶️)

You don't need to edit the Android files unless you're adding native functionality.

---

## Part 8: Building a Release APK

When you're ready to share or publish your app:

### Step 1: Build Release APK

In Android Studio:
1. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. Click "locate" in the notification to find your APK

OR using command line:
```bash
cd android
./gradlew assembleDebug    # For testing (unsigned)
./gradlew assembleRelease  # For release (needs signing)
```

Your APK will be at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Step 2: Install on Any Device

You can share this APK file and install it on any Android device:
1. Transfer the APK to your phone
2. Open the file
3. Allow installation from unknown sources (if prompted)
4. Install!

---

## 🐛 Common Issues and Solutions

### Issue 1: "Gradle sync failed"

**Solution:**
- Click "Try Again" in the notification
- Check your internet connection (Gradle needs to download dependencies)
- Go to File → Invalidate Caches → Invalidate and Restart

### Issue 2: "No connected devices"

**Solution:**
- Create an emulator (see Part 4)
- Or connect a physical device with USB debugging enabled

### Issue 3: "App keeps crashing"

**Solution:**
- Check Logcat for error messages
- Make sure you ran `npm run cap:sync` after making changes
- Try: Build → Clean Project, then rebuild

### Issue 4: "Android SDK not found"

**Solution:**
- Go to Tools → SDK Manager
- Install the latest Android SDK
- Make sure ANDROID_HOME environment variable is set

### Issue 5: Build is very slow

**Solution:**
- First builds are always slow
- Add to `android/gradle.properties`:
  ```properties
  org.gradle.jvmargs=-Xmx4096m
  org.gradle.daemon=true
  org.gradle.parallel=true
  ```

---

## 🎯 Quick Reference Commands

```bash
# Build and sync web app to Android
npm run cap:sync

# Open Android project in Android Studio
npm run cap:android

# Build and run on connected device/emulator
npm run cap:run:android

# Build release bundle (for Play Store)
cd android && ./gradlew bundleRelease
```

---

## 📚 Next Steps

Once you're comfortable with the basics:

1. **Customize your app:**
   - Change app icon (see DEPLOYMENT.md)
   - Update app name in `android/app/src/main/res/values/strings.xml`
   - Change package name (appId)

2. **Test thoroughly:**
   - Test on different screen sizes
   - Test on real devices
   - Test all features work (compared to web version)

3. **Prepare for release:**
   - Generate signing key
   - Build release AAB
   - Upload to Google Play Console

See **DEPLOYMENT.md** for detailed release instructions.

---

## 🆘 Getting Help

- **Android Studio Help:** Help → Help Topics
- **Capacitor Docs:** https://capacitorjs.com/docs/android
- **Android Developer Guides:** https://developer.android.com/guide

---

**You're all set!** Start with Part 1 and work your way through. Take your time with the first setup - it's normal for everything to feel new. Good luck! 🚀
