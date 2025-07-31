# ID Verification System Documentation

## Overview

The ID verification system is a comprehensive feature that ensures users must verify their identity before making bookings or adding products to the platform. This system includes user ID upload, admin approval workflow, and integration with the booking and product creation processes.

## Features

### 🔐 User Features
- **ID Card Upload**: Users can upload their government-issued ID cards
- **Status Tracking**: Real-time status updates (Pending, Approved, Rejected)
- **File Validation**: Supports JPG, PNG, PDF formats with 5MB size limit
- **Privacy Protection**: Secure storage with privacy notices
- **Status Notifications**: Users receive notifications about verification status

### 👨‍💼 Admin Features
- **Verification Management**: Admin dashboard to review all ID submissions
- **Approval/Rejection**: One-click approval or rejection with reason
- **Statistics Dashboard**: Overview of verification statistics
- **User Details**: View user information and ID card preview
- **Notification System**: Automatic notifications for new submissions

### 🚫 Booking Restrictions
- **Pre-booking Check**: Users cannot make bookings without verification
- **Product Creation Check**: Users cannot add products without verification
- **Graceful Redirects**: Users are redirected to ID verification when needed

## Database Structure

### Collections

#### `users` Collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "User Name",
  role: "user",
  isVerified: false, // New field
  verifiedAt: "2024-01-01T00:00:00.000Z", // New field
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

#### `user-verifications` Collection
```javascript
{
  userId: "user_id",
  idCardUrl: "https://storage.googleapis.com/...",
  fileName: "id-card.jpg",
  fileSize: 1024000,
  uploadedAt: "2024-01-01T00:00:00.000Z",
  status: "pending", // pending, approved, rejected
  reviewedAt: "2024-01-01T00:00:00.000Z",
  reviewedBy: "admin_user_id",
  rejectionReason: "Document unclear"
}
```

#### `notifications` Collection
```javascript
{
  type: "id_verification_submitted",
  title: "New ID Verification Submitted",
  message: "User John Doe has submitted their ID card for verification",
  targetId: null,
  timestamp: "2024-01-01T00:00:00.000Z",
  read: false,
  adminId: "admin"
}
```

## File Structure

```
src/
├── views/
│   ├── Profile/
│   │   └── IDVerification.vue          # User ID upload page
│   └── admin/
│       └── IDVerifications.vue         # Admin verification management
├── composables/
│   ├── useIDVerification.js            # ID verification logic
│   └── useNotifications.js             # Notification system (updated)
├── components/
│   └── pages/
│       └── ProfileSidebar.vue          # Updated with ID verification menu
└── locales/
    ├── en.json                         # English translations
    └── ar.json                         # Arabic translations
```

## Implementation Details

### 1. User ID Upload Component (`IDVerification.vue`)

**Features:**
- Drag and drop file upload
- File type and size validation
- Real-time status display
- Privacy notice
- Upload progress tracking

**Key Functions:**
```javascript
// File validation
const handleFile = async (file) => {
  // Validate file type (JPG, PNG, PDF)
  // Validate file size (5MB limit)
  // Upload to Firebase Storage
  // Save to Firestore
  // Send notification to admin
}

// Status display
const getVerificationStatus = () => {
  // Returns: 'not_uploaded', 'pending', 'approved', 'rejected'
}
```

### 2. Admin Verification Management (`IDVerifications.vue`)

**Features:**
- Statistics dashboard
- Verification list with search/filter
- ID card preview
- Approval/rejection workflow
- Notification system

**Key Functions:**
```javascript
// Approve verification
const approveVerification = async (verification) => {
  // Update verification status
  // Update user verification status
  // Send notification
}

// Reject verification
const rejectVerification = (verification) => {
  // Show rejection modal
  // Update verification status with reason
  // Send notification
}
```

### 3. Booking Integration

**RentConfirmation.vue:**
```javascript
const createBooking = async () => {
  // Check if user is verified
  if (!userData.isVerified) {
    // Show warning and redirect to ID verification
    return;
  }
  // Proceed with booking
}
```

**AddProduct Integration:**
```javascript
const submitForm = async () => {
  // Check if user is verified (only for new products)
  if (!isEdit.value && !userData.isVerified) {
    // Show warning and redirect to ID verification
    return;
  }
  // Proceed with product creation
}
```

### 4. Notification System

**Types of Notifications:**
- `id_verification_submitted`: When user uploads ID
- `id_verification_approved`: When admin approves
- `id_verification_rejected`: When admin rejects

**Implementation:**
```javascript
const notifyIDVerificationSubmitted = async (userName) => {
  await createNotification(
    'id_verification_submitted',
    'New ID Verification Submitted',
    `User ${userName} has submitted their ID card for verification`
  );
}
```

## Security Features

### 🔒 Data Protection
- **Secure Storage**: ID cards stored in Firebase Storage with restricted access
- **Privacy Compliance**: Clear privacy notices and data usage policies
- **Access Control**: Only admins can view ID cards
- **Audit Trail**: All actions logged with timestamps and user IDs

### 🛡️ Validation
- **File Type Validation**: Only JPG, PNG, PDF accepted
- **File Size Limits**: Maximum 5MB per file
- **Content Validation**: Admin review required for approval
- **User Authentication**: All operations require valid user session

## User Experience

### 📱 User Flow
1. **Registration**: User creates account
2. **First Booking Attempt**: User tries to book → redirected to ID verification
3. **ID Upload**: User uploads ID card with drag & drop
4. **Status Tracking**: User can view verification status
5. **Approval**: Admin reviews and approves/rejects
6. **Booking**: User can now make bookings

### 🎯 Admin Flow
1. **Dashboard**: Admin sees verification statistics
2. **Review List**: Admin views all pending verifications
3. **ID Preview**: Admin can view uploaded ID cards
4. **Decision**: Admin approves or rejects with reason
5. **Notification**: System automatically notifies users

## Testing

### 🧪 Test Script
Run the test script to verify system functionality:
```bash
node test-id-verification.js
```

**Test Coverage:**
- User creation and verification status
- ID upload and storage
- Admin approval workflow
- Notification system
- Database integrity

## Configuration

### 🔧 Environment Variables
No additional environment variables required. Uses existing Firebase configuration.

### 📊 Firebase Rules
Ensure Firebase Storage rules allow ID card uploads:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /id-cards/{userId}/{allPaths=**} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(firestore.default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Translation Keys

### English (`en.json`)
```json
{
  "idVerification": "ID Verification",
  "uploadIDCard": "Upload ID Card",
  "verificationRequired": "Verification Required",
  "verificationApproved": "Verification Approved",
  "verificationRejected": "Verification Rejected"
}
```

### Arabic (`ar.json`)
```json
{
  "idVerification": "التحقق من الهوية",
  "uploadIDCard": "رفع بطاقة الهوية",
  "verificationRequired": "التحقق مطلوب",
  "verificationApproved": "تمت الموافقة على التحقق",
  "verificationRejected": "تم رفض التحقق"
}
```

## Troubleshooting

### 🔍 Common Issues

**1. File Upload Fails**
- Check file size (must be < 5MB)
- Verify file type (JPG, PNG, PDF only)
- Ensure Firebase Storage rules are correct

**2. Verification Status Not Updating**
- Check real-time listeners are active
- Verify database permissions
- Check console for errors

**3. Booking Still Blocked After Verification**
- Ensure user document has `isVerified: true`
- Check verification timestamp is recent
- Verify admin approval was successful

### 🛠️ Debug Commands
```javascript
// Check user verification status
const userDoc = await getDoc(doc(db, 'users', userId));
console.log('User verified:', userDoc.data().isVerified);

// Check verification record
const verificationDoc = await getDoc(doc(db, 'user-verifications', userId));
console.log('Verification status:', verificationDoc.data().status);
```

## Future Enhancements

### 🚀 Planned Features
- **OCR Integration**: Automatic ID information extraction
- **Face Recognition**: Match ID photo with user profile
- **Document Verification**: Integration with government APIs
- **Bulk Operations**: Admin can approve/reject multiple verifications
- **Advanced Analytics**: Detailed verification statistics and trends

### 📈 Performance Optimizations
- **Image Compression**: Automatic image optimization
- **Caching**: Cache verification status for faster checks
- **Batch Processing**: Process multiple verifications efficiently

## Support

For technical support or questions about the ID verification system:
- Check the troubleshooting section above
- Review Firebase console for errors
- Test with the provided test script
- Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready ✅ 