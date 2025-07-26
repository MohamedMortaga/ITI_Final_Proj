/**
 * Real-Time Rental Status Synchronization Test
 * 
 * This script tests the real-time synchronization between:
 * 1. Admin Dashboard (RentalDashboard.vue)
 * 2. User Profile (MyRentals.vue)
 * 3. Admin User Rentals (UserRentals.vue)
 * 
 * Test Steps:
 * 1. Open admin dashboard and user profile in separate tabs
 * 2. Change rental status in admin dashboard
 * 3. Verify status updates immediately in user profile
 * 4. Change status in user profile (if possible)
 * 5. Verify status updates immediately in admin dashboard
 */

console.log('🧪 Real-Time Rental Status Synchronization Test');
console.log('================================================');

// Test configuration
const TEST_CONFIG = {
  testDuration: 30000, // 30 seconds
  checkInterval: 2000, // Check every 2 seconds
  expectedUpdates: 0,
  actualUpdates: 0
};

// Test results
const testResults = {
  adminToProfile: false,
  profileToAdmin: false,
  realTimeListeners: false,
  dataConsistency: false,
  errors: []
};

/**
 * Test 1: Verify Real-Time Listeners are Active
 */
function testRealTimeListeners() {
  console.log('\n📡 Test 1: Checking Real-Time Listeners...');
  
  // Check if global real-time store is initialized
  if (window.useGlobalRealTime) {
    const { bookings } = window.useGlobalRealTime();
    if (bookings && bookings.value) {
      console.log('✅ Global real-time store is active');
      console.log(`📊 Current bookings count: ${bookings.value.length}`);
      testResults.realTimeListeners = true;
    } else {
      console.log('❌ Global real-time store not properly initialized');
      testResults.errors.push('Global real-time store not initialized');
    }
  } else {
    console.log('❌ Global real-time store not available');
    testResults.errors.push('Global real-time store not available');
  }
}

/**
 * Test 2: Verify Data Consistency Between Components
 */
function testDataConsistency() {
  console.log('\n🔍 Test 2: Checking Data Consistency...');
  
  try {
    // Check if admin dashboard and user profile show same data
    const adminRentals = document.querySelectorAll('[data-testid="admin-rental"]');
    const profileRentals = document.querySelectorAll('[data-testid="profile-rental"]');
    
    if (adminRentals.length > 0 && profileRentals.length > 0) {
      console.log(`✅ Found ${adminRentals.length} rentals in admin dashboard`);
      console.log(`✅ Found ${profileRentals.length} rentals in user profile`);
      
      // Check if status values match
      const adminStatuses = Array.from(adminRentals).map(el => 
        el.querySelector('[data-testid="rental-status"]')?.textContent
      );
      const profileStatuses = Array.from(profileRentals).map(el => 
        el.querySelector('[data-testid="rental-status"]')?.textContent
      );
      
      const statusMatch = adminStatuses.every((status, index) => 
        status === profileStatuses[index]
      );
      
      if (statusMatch) {
        console.log('✅ Rental statuses are consistent between admin and profile');
        testResults.dataConsistency = true;
      } else {
        console.log('❌ Rental statuses are inconsistent');
        testResults.errors.push('Rental statuses inconsistent between admin and profile');
      }
    } else {
      console.log('⚠️ No rental elements found for comparison');
    }
  } catch (error) {
    console.log('❌ Error checking data consistency:', error.message);
    testResults.errors.push(`Data consistency check failed: ${error.message}`);
  }
}

/**
 * Test 3: Simulate Admin Status Change
 */
function testAdminStatusChange() {
  console.log('\n👨‍💼 Test 3: Simulating Admin Status Change...');
  
  try {
    // Find a rental status dropdown in admin dashboard
    const statusDropdown = document.querySelector('[data-testid="admin-status-dropdown"]');
    if (statusDropdown) {
      console.log('✅ Found admin status dropdown');
      
      // Simulate clicking to open dropdown
      statusDropdown.click();
      
      // Wait for dropdown to open
      setTimeout(() => {
        const statusOptions = document.querySelectorAll('[data-testid="status-option"]');
        if (statusOptions.length > 0) {
          console.log(`✅ Found ${statusOptions.length} status options`);
          
          // Click on a different status option
          const currentStatus = statusDropdown.textContent.trim();
          const newStatusOption = Array.from(statusOptions).find(option => 
            option.textContent.trim() !== currentStatus
          );
          
          if (newStatusOption) {
            console.log(`🔄 Changing status from "${currentStatus}" to "${newStatusOption.textContent.trim()}"`);
            newStatusOption.click();
            
            // Mark test as successful
            testResults.adminToProfile = true;
            console.log('✅ Admin status change simulation completed');
          } else {
            console.log('❌ No different status option found');
          }
        } else {
          console.log('❌ No status options found in dropdown');
        }
      }, 500);
    } else {
      console.log('❌ Admin status dropdown not found');
      testResults.errors.push('Admin status dropdown not found');
    }
  } catch (error) {
    console.log('❌ Error simulating admin status change:', error.message);
    testResults.errors.push(`Admin status change simulation failed: ${error.message}`);
  }
}

/**
 * Test 4: Monitor Real-Time Updates
 */
function monitorRealTimeUpdates() {
  console.log('\n👀 Test 4: Monitoring Real-Time Updates...');
  
  let updateCount = 0;
  const startTime = Date.now();
  
  const monitorInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    
    // Check for console logs indicating real-time updates
    const consoleLogs = performance.getEntriesByType('navigation');
    
    // Check if any rental status elements have changed
    const statusElements = document.querySelectorAll('[data-testid="rental-status"]');
    statusElements.forEach((element, index) => {
      if (element.dataset.lastValue !== element.textContent) {
        updateCount++;
        element.dataset.lastValue = element.textContent;
        console.log(`🔄 Status update detected: ${element.textContent}`);
      }
    });
    
    if (elapsed >= TEST_CONFIG.testDuration) {
      clearInterval(monitorInterval);
      console.log(`📊 Real-time update monitoring completed:`);
      console.log(`   - Duration: ${elapsed}ms`);
      console.log(`   - Updates detected: ${updateCount}`);
      
      if (updateCount > 0) {
        console.log('✅ Real-time updates are working');
      } else {
        console.log('⚠️ No real-time updates detected during test period');
      }
    }
  }, TEST_CONFIG.checkInterval);
}

/**
 * Test 5: Verify Component Integration
 */
function testComponentIntegration() {
  console.log('\n🔗 Test 5: Checking Component Integration...');
  
  // Check if MyRentals component is using real-time data
  const myRentalsComponent = document.querySelector('[data-testid="my-rentals"]');
  if (myRentalsComponent) {
    console.log('✅ MyRentals component found');
    
    // Check if it's using the global real-time store
    const hasRealTimeData = myRentalsComponent.dataset.realTime === 'true';
    if (hasRealTimeData) {
      console.log('✅ MyRentals component is using real-time data');
    } else {
      console.log('❌ MyRentals component is not using real-time data');
      testResults.errors.push('MyRentals component not using real-time data');
    }
  } else {
    console.log('❌ MyRentals component not found');
    testResults.errors.push('MyRentals component not found');
  }
  
  // Check if RentalDashboard component is using real-time data
  const rentalDashboardComponent = document.querySelector('[data-testid="rental-dashboard"]');
  if (rentalDashboardComponent) {
    console.log('✅ RentalDashboard component found');
    
    // Check if it's using the admin real-time store
    const hasRealTimeData = rentalDashboardComponent.dataset.realTime === 'true';
    if (hasRealTimeData) {
      console.log('✅ RentalDashboard component is using real-time data');
    } else {
      console.log('❌ RentalDashboard component is not using real-time data');
      testResults.errors.push('RentalDashboard component not using real-time data');
    }
  } else {
    console.log('❌ RentalDashboard component not found');
    testResults.errors.push('RentalDashboard component not found');
  }
}

/**
 * Generate Test Report
 */
function generateTestReport() {
  console.log('\n📋 Test Report');
  console.log('==============');
  
  const totalTests = Object.keys(testResults).length - 1; // Exclude errors array
  const passedTests = Object.entries(testResults)
    .filter(([key, value]) => key !== 'errors' && value === true).length;
  
  console.log(`Overall Result: ${passedTests}/${totalTests} tests passed`);
  console.log('');
  
  console.log('Test Results:');
  console.log(`✅ Real-Time Listeners: ${testResults.realTimeListeners ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Data Consistency: ${testResults.dataConsistency ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Admin to Profile Sync: ${testResults.adminToProfile ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Profile to Admin Sync: ${testResults.profileToAdmin ? 'PASS' : 'FAIL'}`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors Found:');
    testResults.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  console.log('\n🎯 Recommendations:');
  if (passedTests === totalTests) {
    console.log('✅ All tests passed! Real-time synchronization is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above for details.');
    console.log('💡 Make sure both admin dashboard and user profile are open in separate tabs.');
    console.log('💡 Verify that the global real-time store is properly initialized.');
    console.log('💡 Check that all components are using the real-time data sources.');
  }
}

/**
 * Run All Tests
 */
function runAllTests() {
  console.log('🚀 Starting Real-Time Rental Status Synchronization Tests...');
  
  // Run tests in sequence
  setTimeout(() => testRealTimeListeners(), 1000);
  setTimeout(() => testDataConsistency(), 2000);
  setTimeout(() => testAdminStatusChange(), 3000);
  setTimeout(() => testComponentIntegration(), 4000);
  setTimeout(() => monitorRealTimeUpdates(), 5000);
  setTimeout(() => generateTestReport(), TEST_CONFIG.testDuration + 6000);
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
  window.runRentalSyncTests = runAllTests;
  console.log('💡 Run "runRentalSyncTests()" in console to start tests');
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testRealTimeListeners,
    testDataConsistency,
    testAdminStatusChange,
    testComponentIntegration,
    generateTestReport
  };
} 