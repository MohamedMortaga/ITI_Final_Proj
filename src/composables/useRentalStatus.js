// src/composables/useRentalStatus.js
import { ref } from 'vue';
import { db, auth } from '@/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';

export function useRentalStatus() {
  const isUpdating = ref(false);
  const lastError = ref(null);

  // Check Firebase connectivity
  const checkFirebaseConnectivity = async () => {
    try {
      const testDoc = doc(db, 'bookings', 'test-connection');
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.error('Firebase connectivity test failed:', error);
      return false;
    }
  };

  // Validate booking data
  const validateBookingData = (bookingData, currentUserId) => {
    const errors = [];
    
    if (!bookingData) {
      errors.push('Booking data is missing');
      return errors;
    }
    
    if (!bookingData.sellerId && !bookingData.userId) {
      errors.push('Booking does not have valid user information');
    }
    
    if (!bookingData.status) {
      errors.push('Booking status is missing');
    }
    
    // Check if current user is involved in this booking
    const isSeller = bookingData.sellerId === currentUserId;
    const isRenter = bookingData.userId === currentUserId;
    
    if (!isSeller && !isRenter) {
      errors.push('You do not have permission to update this booking');
    }
    
    return errors;
  };

  // Validate status transition with dual confirmation logic
  const validateStatusTransition = (currentStatus, newStatus, bookingData, currentUserId) => {
    const validTransitions = {
      'pending': ['active', 'rejected'],
      'active': ['completed'],
      'rejected': ['pending'],
      'completed': []
    };

    // Basic transition validation
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return false;
    }

    // Special logic for 'completed' status - requires dual confirmation
    if (newStatus === 'completed') {
      const isSeller = bookingData.sellerId === currentUserId;
      const isRenter = bookingData.userId === currentUserId;
      
      // Check if this is the first confirmation
      const sellerConfirmed = bookingData.sellerConfirmed || false;
      const renterConfirmed = bookingData.renterConfirmed || false;
      
      // If seller is confirming and renter hasn't confirmed yet
      if (isSeller && !renterConfirmed) {
        return true; // Allow seller to confirm first
      }
      
      // If renter is confirming and seller hasn't confirmed yet
      if (isRenter && !sellerConfirmed) {
        return true; // Allow renter to confirm first
      }
      
      // If this is the second confirmation (either party)
      if ((isSeller && renterConfirmed) || (isRenter && sellerConfirmed)) {
        return true; // Allow second confirmation
      }
      
      return false;
    }

    return true;
  };

  // Get specific error message based on error code
  const getErrorMessage = (error) => {
    if (error.code === 'permission-denied') {
      return 'Permission denied. You may not have the right to update this rental.';
    } else if (error.code === 'unavailable') {
      return 'Service temporarily unavailable. Please check your internet connection and try again.';
    } else if (error.code === 'unauthenticated') {
      return 'Please log in again to update rental status.';
    } else if (error.code === 'not-found') {
      return 'The booking was not found. It may have been deleted.';
    } else if (error.code === 'already-exists') {
      return 'This status update has already been applied.';
    } else if (error.code === 'deadline-exceeded') {
      return 'Request timed out. Please check your internet connection and try again.';
    } else if (error.message) {
      return `Error: ${error.message}`;
    }
    return 'Failed to update rental status. Please try again.';
  };

  // Update rental status with comprehensive error handling and dual confirmation
  const updateRentalStatus = async (bookingId, newStatus, updatedBy, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      // Check if already updating
      if (isUpdating.value) {
        console.log('Update already in progress, skipping...');
        return;
      }

      isUpdating.value = true;
      lastError.value = null;

      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }

      // Validate input parameters
      if (!bookingId || !newStatus || !updatedBy) {
        throw new Error('Missing required parameters');
      }

      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      // Check Firebase connectivity on first attempt
      if (retryCount === 0) {
        const isFirebaseConnected = await checkFirebaseConnectivity();
        if (!isFirebaseConnected) {
          throw new Error('Service unavailable');
        }
      }

      // Get the current booking document
      const bookingDoc = doc(db, "bookings", bookingId);
      
      // Check if the document exists
      const bookingSnap = await getDoc(bookingDoc);

      if (!bookingSnap.exists()) {
        throw new Error('Booking not found');
      }

      const bookingData = bookingSnap.data();
      const currentUserId = auth.currentUser.uid;

      // Validate booking data
      const validationErrors = validateBookingData(bookingData, currentUserId);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('. '));
      }

      // Check if user has permission to update this booking
      const isSeller = bookingData.sellerId === currentUserId;
      const isRenter = bookingData.userId === currentUserId;

      if (!isSeller && !isRenter) {
        throw new Error('Permission denied');
      }

      // Validate status transition with dual confirmation logic
      const currentStatus = bookingData.status;
      if (!validateStatusTransition(currentStatus, newStatus, bookingData, currentUserId)) {
        throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
      }

      // Prepare update data with dual confirmation tracking
      const updateData = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: currentUserId
      };

      // Handle dual confirmation for 'completed' status
      if (newStatus === 'completed') {
        const sellerConfirmed = bookingData.sellerConfirmed || false;
        const renterConfirmed = bookingData.renterConfirmed || false;
        
        if (isSeller) {
          updateData.sellerConfirmed = true;
          updateData.sellerConfirmedAt = new Date().toISOString();
        } else if (isRenter) {
          updateData.renterConfirmed = true;
          updateData.renterConfirmedAt = new Date().toISOString();
        }

        // Check if both parties have confirmed
        const bothConfirmed = (isSeller && renterConfirmed) || (isRenter && sellerConfirmed) || 
                            (updateData.sellerConfirmed && updateData.renterConfirmed);

        if (bothConfirmed) {
          // Both parties confirmed - mark as fully completed
          updateData.fullyCompleted = true;
          updateData.fullyCompletedAt = new Date().toISOString();
          
          // Update the associated product to make it available again
          if (bookingData.productId) {
            try {
              const productRef = doc(db, "products", bookingData.productId);
              await updateDoc(productRef, { 
                status: "free",
                lastRentalCompleted: new Date().toISOString()
              });
            } catch (productError) {
              console.warn('Failed to update product status:', productError);
              // Don't fail the booking update if product update fails
            }
          }
        } else {
          // Only one party confirmed - keep status as 'active' but track confirmation
          updateData.status = 'active';
          updateData.pendingCompletion = true;
        }
      }

      // Add new status to history with detailed information
      const newStatusHistory = [...bookingData.statusHistory || [], {
        status: updateData.status,
        timestamp: new Date().toISOString(),
        updatedBy: updatedBy,
        updatedByUserId: currentUserId,
        previousStatus: currentStatus,
        reason: `Status changed from ${currentStatus} to ${updateData.status}`,
        retryCount: retryCount,
        dualConfirmation: newStatus === 'completed' ? {
          sellerConfirmed: updateData.sellerConfirmed || false,
          renterConfirmed: updateData.renterConfirmed || false,
          bothConfirmed: updateData.fullyCompleted || false
        } : null
      }];

      updateData.statusHistory = newStatusHistory;

      // Update the booking document
      await updateDoc(bookingDoc, updateData);

      // Success
      return {
        success: true,
        message: updateData.fullyCompleted ? 
          'Rental completed successfully! Product is now available for rent again.' :
          `Status updated to ${updateData.status}. ${newStatus === 'completed' ? 'Waiting for other party to confirm completion.' : ''}`
      };

    } catch (error) {
      console.error('Error updating rental status:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
        retryCount,
        bookingId,
        newStatus,
        updatedBy
      });

      lastError.value = error;

      // Handle retry logic for network-related errors
      if (retryCount < maxRetries && (
        error.code === 'unavailable' || 
        error.code === 'deadline-exceeded' ||
        error.message?.includes('network') ||
        error.message?.includes('timeout')
      )) {
        console.log(`Retrying update (attempt ${retryCount + 1}/${maxRetries})`);
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the update
        return updateRentalStatus(bookingId, newStatus, updatedBy, retryCount + 1);
      }

      // Return error result
      return {
        success: false,
        error: error,
        message: getErrorMessage(error)
      };

    } finally {
      isUpdating.value = false;
    }
  };

  // Update rental status with UI feedback
  const updateRentalStatusWithUI = async (bookingId, newStatus, updatedBy, t) => {
    try {
      // Show confirmation dialog
      const confirmResult = await Swal.fire({
        title: 'Confirm Status Change?',
        text: newStatus === 'completed' ? 
          'Are you sure you want to confirm completion? This will mark your part of the rental as completed.' :
          `Are you sure you want to change the status to "${t(newStatus)}"? This action cannot be undone.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: newStatus === 'completed' ? 'Yes, Confirm Completion' : 'Yes, Change Status',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      // Show loading state
      Swal.fire({
        title: 'Updating...',
        text: newStatus === 'completed' ? 
          'Confirming completion...' :
          `Changing status to ${t(newStatus)}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Perform the update
      const updateResult = await updateRentalStatus(bookingId, newStatus, updatedBy);

      // Close loading dialog
      Swal.close();

      if (updateResult.success) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Status Updated Successfully',
          text: updateResult.message,
          timer: 3000,
          showConfirmButton: false,
          position: 'top-end'
        });
      } else {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: updateResult.message,
          confirmButtonText: 'OK'
        });
      }

      return updateResult;

    } catch (error) {
      console.error('Error in updateRentalStatusWithUI:', error);
      Swal.close();
      
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An unexpected error occurred. Please try again.',
        confirmButtonText: 'OK'
      });

      return {
        success: false,
        error: error,
        message: 'An unexpected error occurred'
      };
    }
  };

  return {
    isUpdating,
    lastError,
    updateRentalStatus,
    updateRentalStatusWithUI,
    checkFirebaseConnectivity,
    validateBookingData,
    validateStatusTransition,
    getErrorMessage
  };
} 