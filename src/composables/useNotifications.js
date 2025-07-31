import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useNotifications = () => {
  const createNotification = async (type, title, message, targetId = null) => {
    try {
      const notificationsRef = collection(db, 'notifications')
      await addDoc(notificationsRef, {
        type,
        title,
        message,
        targetId,
        timestamp: serverTimestamp(),
        read: false,
        adminId: 'admin' // You can replace with actual admin ID if needed
      })
      console.log('Notification created successfully')
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  // Function to create notification from chat data
  const createNotificationFromChatData = async (chatData) => {
    try {
      const notificationsRef = collection(db, 'notifications')
      await addDoc(notificationsRef, {
        chatId: chatData.chatId,
        content: chatData.content,
        detectedAt: chatData.detectedAt,
        issue: chatData.issue,
        messageId: chatData.messageId,
        timestamp: chatData.timestamp,
        userId: chatData.userId,
        type: 'chat_issue',
        title: `Issue Detected: ${chatData.issue}`,
        message: `Detected ${chatData.issue} in chat message`,
        read: false,
        adminId: 'admin'
      })
      console.log('Chat notification created successfully')
    } catch (error) {
      console.error('Error creating chat notification:', error)
    }
  }

  // Function to add the specific notification data provided by user
  const addUserNotificationData = async () => {
    const notificationData = {
      chatId: "EBFh8ZMa1KWrZxJJgqKAC3URB1A2_anM57nMOkXb9X8N0fHQTm23bY763",
      content: "01022194510\\",
      detectedAt: "2025-07-27T20:02:02.759Z",
      issue: "phone number",
      messageId: "user-1",
      timestamp: 1658971116,
      userId: "anM57nMOkXb9X8N0fHQTm23bY763"
    };

    try {
      const notificationsRef = collection(db, 'notifications')
      const docRef = await addDoc(notificationsRef, {
        ...notificationData,
        type: 'chat_issue',
        title: `Issue Detected: ${notificationData.issue}`,
        message: `Detected ${notificationData.issue} in chat message`,
        read: false,
        adminId: 'admin',
        createdAt: new Date().toISOString()
      })
      console.log('User notification data added successfully with ID:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error adding user notification data:', error)
      throw error
    }
  }

  // Function to add test warning data to warnings collection
  const addWarningTestData = async () => {
    const warningData = {
      chatId: "EBFh8ZMa1KWrZxJJgqKAC3URB1A2_anM57nMOkXb9X8N0fHQTm23bY763",
      content: "01022194510\\",
      detectedAt: "2025-07-27T20:02:02.759Z",
      issue: "phone number",
      messageId: "user-1",
      timestamp: 1658971116,
      userId: "anM57nMOkXb9X8N0fHQTm23bY763"
    };

    try {
      const warningsRef = collection(db, 'warnings')
      const docRef = await addDoc(warningsRef, {
        ...warningData,
        createdAt: new Date().toISOString()
      })
      console.log('Warning test data added successfully with ID:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error adding warning test data:', error)
      throw error
    }
  }

  // Predefined notification types
  const notifyNewBooking = async (userName, productTitle) => {
    await createNotification(
      'booking',
      'New Booking',
      `User ${userName} booked "${productTitle}"`,
      null
    )
  }

  const notifyNewProduct = async (productName) => {
    await createNotification(
      'product',
      'Product Added',
      `New product "${productName}" has been added`,
      null
    )
  }

  const notifyNewUser = async (userName) => {
    await createNotification(
      'user',
      'New User',
      `User ${userName} has registered`,
      null
    )
  }

  const notifyBookingStatusChange = async (productTitle, newStatus) => {
    await createNotification(
      'booking',
      'Booking Status Updated',
      `Booking for "${productTitle}" status changed to ${newStatus}`,
      null
    )
  }

  const notifyUserBlocked = async (userName, isBlocked) => {
    await createNotification(
      'user',
      'User Status Changed',
      `User ${userName} has been ${isBlocked ? 'blocked' : 'unblocked'}`,
      null
    )
  }

  const notifyIDVerificationSubmitted = async (userName) => {
    await createNotification(
      'id_verification_submitted',
      'New ID Verification Submitted',
      `User ${userName} has submitted their ID card for verification`,
      null
    )
  }

  const notifyIDVerificationApproved = async (userName) => {
    await createNotification(
      'id_verification_approved',
      'ID Verification Approved',
      `ID verification for ${userName} has been approved`,
      null
    )
  }

  const notifyIDVerificationRejected = async (userName, reason) => {
    await createNotification(
      'id_verification_rejected',
      'ID Verification Rejected',
      `ID verification for ${userName} has been rejected. Reason: ${reason}`,
      null
    )
  }

  return {
    createNotification,
    createNotificationFromChatData,
    addUserNotificationData,
    addWarningTestData,
    notifyNewBooking,
    notifyNewProduct,
    notifyNewUser,
    notifyBookingStatusChange,
    notifyUserBlocked,
    notifyIDVerificationSubmitted,
    notifyIDVerificationApproved,
    notifyIDVerificationRejected
  }
} 
