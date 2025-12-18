# Android Native Features Configuration

This guide explains how to configure deep linking and push notifications for Android.

## 📱 Deep Linking Configuration

### Step 1: Update AndroidManifest.xml

Add this to `android/app/src/main/AndroidManifest.xml` inside the `<activity>` tag:

```xml
<!-- Inside <activity android:name=".MainActivity"> -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <!-- Deep links: cleaningrota://join/ABC123 -->
    <data android:scheme="cleaningrota" />
</intent-filter>

<!-- Optional: Universal Links (HTTPS URLs) -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <!-- Replace with your actual domain -->
    <data android:scheme="https"
          android:host="yourdomain.com"
          android:pathPrefix="/join" />
</intent-filter>
```

### Example AndroidManifest.xml:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- ADD THIS FOR DEEP LINKING -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="cleaningrota" />
            </intent-filter>

        </activity>
    </application>

    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

</manifest>
```

## 🔔 Push Notifications Configuration

### Step 1: Add Firebase to Your Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add Android app with package name: `com.cleaningrotaBurwood.app`
4. Download `google-services.json`
5. Place it in `android/app/`

### Step 2: Update build.gradle Files

**android/build.gradle** (project level):
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

**android/app/build.gradle** (app level):
```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services' // Add this line

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging'
}
```

### Step 3: Test Push Notifications

```bash
# Build and run
npm run build
npm run cap:sync
npm run cap:run:android

# In the app, check console logs for FCM token
# Use that token to send test notification from Firebase Console
```

## 🧪 Testing Deep Links

### Test on Device:

```bash
# Install app
npm run cap:run:android

# Test deep link via ADB
adb shell am start -W -a android.intent.action.VIEW -d "cleaningrota://join/ABC123" com.cleaningrotaBurwood.app
```

### Test via Link:

1. Send yourself a WhatsApp/Email with: `cleaningrota://join/ABC123`
2. Click the link on your phone
3. App should open and join household

## ✅ Verification Checklist

- [ ] AndroidManifest.xml updated with intent filters
- [ ] google-services.json added (for push notifications)
- [ ] build.gradle files updated
- [ ] Deep links tested with ADB
- [ ] Push notification token logged in console
- [ ] Test notification received from Firebase Console

## 🔧 Troubleshooting

### Deep Links Not Working:
```bash
# Check if intent filter is registered
adb shell dumpsys package com.cleaningrotaBurwood.app | grep -A 5 "cleaningrota"

# Clear app data and reinstall
adb shell pm clear com.cleaningrotaBurwood.app
npm run cap:run:android
```

### Push Notifications Not Working:
```bash
# Check if google-services.json is in android/app/
ls -la android/app/google-services.json

# Rebuild after adding Firebase
npm run cap:sync
cd android
./gradlew clean
cd ..
npm run cap:run:android
```

## 📚 Additional Resources

- [Capacitor Deep Links](https://capacitorjs.com/docs/guides/deep-links)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/android/client)
