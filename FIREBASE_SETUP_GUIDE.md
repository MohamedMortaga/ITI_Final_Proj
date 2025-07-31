# Firebase Setup Guide for Two-Image ID Verification System

## Overview

This guide will help you set up the Firebase Firestore collections and Storage rules needed for the two-image ID verification system.

## Step 1: Create the user-verifications Collection

### Option A: Using the Setup Script (Recommended)

1. **Run the setup script**:
   ```bash
   node setup-user-verifications-collection.js
   ```

2. **What the script does**:
   - Creates the `user-verifications` collection
   - Adds a sample document with the correct structure
   - Verifies the collection was created successfully

### Option B: Manual Creation in Firebase Console

1. **Go to Firebase Console**:
   - Navigate to https://console.firebase.google.com
   - Select your project: `test-7b62c`

2. **Create the Collection**:
   - Go to Firestore Database
   - Click "Start collection" or "Add collection"
   - Collection ID: `user-verifications`

3. **Add a Sample Document**:
   - Document ID: `sample-user-123`
   - Add the following fields:

   ```javascript
   {
     // Image URLs (will be populated when users upload)
     frontIdCardUrl: null,
     backIdCardUrl: null,
     
     // File metadata
     frontFileName: null,
     backFileName: null,
     frontFileSize: null,
     backFileSize: null,
     
     // Timestamps
     uploadedAt: null,
     submittedAt: null,
     
     // Verification status
     status: null, // null, 'pending', 'approved', 'rejected'
     
     // Admin review data
     reviewedAt: null,
     reviewedBy: null,
     rejectionReason: null
   }
   ```

## Step 2: Update Users Collection

### Option A: Using the Update Script (Recommended)

1. **Run the update script**:
   ```bash
   node update-users-collection.js
   ```

2. **What the script does**:
   - Finds all existing users in your `users` collection
   - Adds `isVerified: false` and `verifiedAt: null` fields
   - Skips users that already have these fields
   - Provides a summary of the update

### Option B: Manual Update in Firebase Console

1. **For each user document** in your `users` collection, add:
   ```javascript
   {
     isVerified: false,
     verifiedAt: null
   }
   ```

## Step 3: Set Up Firebase Storage

### Create Storage Folder Structure

1. **Go to Firebase Storage** in the console
2. **Create the following folder structure**:
   ```
   id-cards/
   ├── {userId}/
       ├── front/
       └── back/
   ```

### Storage Security Rules

1. **Go to Storage → Rules** in Firebase Console
2. **Replace the rules with**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ID card images - users can upload their own, admins can read all
    match /id-cards/{userId}/{type}/{fileName} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(firestore.default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default rule for other files
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 4: Set Up Firestore Security Rules

### Firestore Security Rules

1. **Go to Firestore → Rules** in Firebase Console
2. **Replace the rules with**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User verifications - users can read/write their own, admins can read/write all
    match /user-verifications/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Users collection - users can read their own, admins can read/write all
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5: Test the Setup

### Run the Test Script

1. **Run the comprehensive test**:
   ```bash
   node test-two-image-verification.js
   ```

2. **What the test does**:
   - Tests user authentication
   - Creates verification data with both images
   - Tests file upload simulation
   - Tests admin approval process
   - Verifies the complete workflow

## Collection Structure Summary

### user-verifications Collection
- **Document ID**: User's UID
- **Fields**:
  - `frontIdCardUrl`: string (URL to front image)
  - `backIdCardUrl`: string (URL to back image)
  - `frontFileName`: string (original filename)
  - `backFileName`: string (original filename)
  - `frontFileSize`: number (file size in bytes)
  - `backFileSize`: number (file size in bytes)
  - `uploadedAt`: timestamp (first upload)
  - `submittedAt`: timestamp (when submitted for review)
  - `status`: string (null, 'pending', 'approved', 'rejected')
  - `reviewedAt`: timestamp (admin review time)
  - `reviewedBy`: string (admin UID)
  - `rejectionReason`: string (reason if rejected)

### users Collection (Updated)
- **Additional Fields**:
  - `isVerified`: boolean (default: false)
  - `verifiedAt`: timestamp (when verified, null if not)

## Storage Structure

### File Paths
```
id-cards/
├── {userId}/
    ├── front/
    │   └── {timestamp}-{filename}.jpg
    └── back/
        └── {timestamp}-{filename}.jpg
```

### Example Paths
- `id-cards/abc123/front/1703123456789-front-id.jpg`
- `id-cards/abc123/back/1703123456789-back-id.jpg`

## Verification

### Check Your Setup

1. **In Firebase Console**:
   - Go to Firestore → Data
   - Verify `user-verifications` collection exists
   - Check that sample document was created

2. **Check Users Collection**:
   - Verify existing users have `isVerified` field
   - Confirm `isVerified` is set to `false`

3. **Check Storage**:
   - Go to Storage
   - Verify `id-cards` folder structure exists

4. **Test Upload**:
   - Use the ID verification page in your app
   - Try uploading front and back images
   - Check that files appear in Storage

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**:
   - Check Firestore security rules
   - Verify user authentication
   - Ensure admin role is properly set

2. **Storage upload fails**:
   - Check Storage security rules
   - Verify file size limits
   - Check network connectivity

3. **Collection not found**:
   - Run the setup script again
   - Check Firebase project configuration
   - Verify collection name spelling

### Support

If you encounter issues:
1. Check the Firebase Console logs
2. Run the test scripts to identify problems
3. Verify all security rules are properly configured
4. Ensure your Firebase configuration is correct

## Next Steps

After completing this setup:

1. **Test the ID verification flow** in your application
2. **Verify admin dashboard** can view and approve verifications
3. **Test booking restrictions** for unverified users
4. **Test product creation restrictions** for unverified users
5. **Monitor the system** for any issues

Your Firebase setup is now ready for the two-image ID verification system! 🎉 