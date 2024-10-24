# Deployment Guide

This document outlines the deployment process for the ATLP Pulse mobile app.

## Prerequisites

Before deploying the app, ensure that you have the following:

- A valid Expo account
- A valid Google Play account
- A valid Apple Developer account
- A valid Apple App Store Connect account
- Expo CLI installed

## Steps

Since the app is built using Expo, the deployment process is straightforward. We can use the Expo CLI to build and submit the app for each platform.

Before building the app, ensure that you complete these steps:

1. Ensure that you have the necessary environment variables set. You can find the required variables in the `.env.example` file.

2. Ensure that expo dependencies are updated by running the following command:

```bash
npx expo install --fix
```

### Build and Submit for iOS

1. Since dependencies are installed on different platforms (windows, mac, linux), we need to ignore the `package-lock.json` file for builds on ios platform. To do this, run the following command:

```bash
rm .easignore
cp .gitignore .easignore
echo '\npackage-lock.json' >> .easignore
```

2. Build the app for iOS by running the following command:

```bash
eas build --platform ios --profile preview --auto-submit --non-interactive
```

This will send the app to the Expo servers for building and submission to the Apple App Store.

3. Once the build is complete, you can remove the `.easignore` file by running the following command:

```bash
rm .easignore
```

### Build and Submit for Android

1. To build the app for Android, run the following command:

```bash
eas build --platform android --profile preview --non-interactive
```

2. Once the build is complete, you can submit the app to the Google Play Store by running the following command:

```bash
eas submit --platform android --profile preview --auto-submit --non-interactive
```
