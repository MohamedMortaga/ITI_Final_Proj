/**
 * Real-Time System Demo Script
 * 
 * This script demonstrates the real-time synchronization system
 * Run this in the browser console to test the functionality
 */

console.log('🚀 Real-Time System Demo Starting...')

// Demo configuration
const DEMO_CONFIG = {
  testDuration: 30000, // 30 seconds
  updateInterval: 5000, // 5 seconds between updates
  maxProducts: 5,
  maxBookings: 3
}

// Demo state
let demoRunning = false
let demoInterval = null
let testResults = {
  productsUpdated: 0,
  bookingsUpdated: 0,
  reviewsAdded: 0,
  eventsReceived: 0,
  errors: []
}

/**
 * Initialize the demo
 */
function initDemo() {
  console.log('📋 Initializing Real-Time System Demo...')
  
  // Check if real-time system is available
  if (typeof window !== 'undefined' && window.useRealTimeSync) {
    console.log('✅ Real-time system is available')
    return true
  } else {
    console.log('❌ Real-time system not found')
    console.log('💡 Make sure you are on a page that uses the real-time system')
    return false
  }
}

/**
 * Test real-time connection
 */
function testConnection() {
  console.log('🔗 Testing Real-Time Connection...')
  
  try {
    const { isConnected, connectionStatus, syncLatency } = window.useRealTimeSync()
    
    if (isConnected.value) {
      console.log('✅ Connection established')
      console.log(`📊 Status: ${connectionStatus.value}`)
      console.log(`⚡ Latency: ${syncLatency.value.toFixed(0)}ms`)
      return true
    } else {
      console.log('❌ Connection failed')
      console.log(`📊 Status: ${connectionStatus.value}`)
      return false
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}

/**
 * Test data loading
 */
function testDataLoading() {
  console.log('📊 Testing Data Loading...')
  
  try {
    const { products, bookings, users, reviews, loading } = window.useRealTimeSync()
    
    console.log('📈 Data Status:')
    console.log(`- Products: ${products.value.length} (loading: ${loading.value.products})`)
    console.log(`- Bookings: ${bookings.value.length} (loading: ${loading.value.bookings})`)
    console.log(`- Users: ${users.value.length} (loading: ${loading.value.users})`)
    console.log(`- Reviews: ${reviews.value.length} (loading: ${loading.value.reviews})`)
    
    return {
      products: products.value.length,
      bookings: bookings.value.length,
      users: users.value.length,
      reviews: reviews.value.length
    }
  } catch (error) {
    console.error('❌ Data loading test failed:', error)
    return null
  }
}

/**
 * Test event system
 */
function testEventSystem() {
  console.log('🎯 Testing Event System...')
  
  try {
    const { addEventListener, removeEventListener } = window.useRealTimeSync()
    
    // Test event listener
    const testHandler = (data) => {
      console.log('🎉 Event received:', data)
      testResults.eventsReceived++
    }
    
    addEventListener('products:updated', testHandler)
    addEventListener('bookings:updated', testHandler)
    addEventListener('reviews:updated', testHandler)
    
    console.log('✅ Event listeners added')
    
    // Cleanup function
    const cleanup = () => {
      removeEventListener('products:updated', testHandler)
      removeEventListener('bookings:updated', testHandler)
      removeEventListener('reviews:updated', testHandler)
      console.log('🧹 Event listeners cleaned up')
    }
    
    return cleanup
  } catch (error) {
    console.error('❌ Event system test failed:', error)
    return null
  }
}

/**
 * Simulate admin actions
 */
function simulateAdminActions() {
  console.log('👨‍💼 Simulating Admin Actions...')
  
  try {
    const { updateProduct, updateBookingStatus, addReview } = window.useRealTimeSync()
    const { products, bookings } = window.useRealTimeSync()
    
    // Simulate product approval
    if (products.value.length > 0) {
      const product = products.value[0]
      console.log(`🔄 Approving product: ${product.title}`)
      
      updateProduct(product.id, { isApproved: !product.isApproved })
        .then(() => {
          console.log('✅ Product approval simulated')
          testResults.productsUpdated++
        })
        .catch(error => {
          console.error('❌ Product approval failed:', error)
          testResults.errors.push('Product approval failed')
        })
    }
    
    // Simulate booking status change
    if (bookings.value.length > 0) {
      const booking = bookings.value[0]
      const newStatus = booking.status === 'pending' ? 'active' : 'pending'
      console.log(`🔄 Changing booking status to: ${newStatus}`)
      
      updateBookingStatus(booking.id, newStatus)
        .then(() => {
          console.log('✅ Booking status change simulated')
          testResults.bookingsUpdated++
        })
        .catch(error => {
          console.error('❌ Booking status change failed:', error)
          testResults.errors.push('Booking status change failed')
        })
    }
    
    // Simulate adding review
    console.log('🔄 Adding test review')
    addReview({
      productId: 'demo-product',
      productTitle: 'Demo Product',
      rate: 5,
      review: 'This is a demo review from the test script',
      userName: 'Demo User'
    })
    .then((reviewId) => {
      console.log('✅ Review added:', reviewId)
      testResults.reviewsAdded++
    })
    .catch(error => {
      console.error('❌ Review addition failed:', error)
      testResults.errors.push('Review addition failed')
    })
    
  } catch (error) {
    console.error('❌ Admin actions simulation failed:', error)
    testResults.errors.push('Admin actions simulation failed')
  }
}

/**
 * Monitor real-time updates
 */
function monitorUpdates() {
  console.log('👀 Monitoring Real-Time Updates...')
  
  const { updateCount, syncLatency, lastUpdate } = window.useRealTimeSync()
  
  const monitorInterval = setInterval(() => {
    console.log(`📊 Update Count: ${updateCount.value}, Latency: ${syncLatency.value.toFixed(0)}ms`)
    
    if (lastUpdate.value) {
      const timeSinceUpdate = Date.now() - lastUpdate.value
      console.log(`⏰ Last Update: ${timeSinceUpdate}ms ago`)
    }
  }, 2000)
  
  return monitorInterval
}

/**
 * Generate demo report
 */
function generateDemoReport() {
  console.log('\n📋 Demo Report')
  console.log('==============')
  
  console.log('Test Results:')
  console.log(`- Products Updated: ${testResults.productsUpdated}`)
  console.log(`- Bookings Updated: ${testResults.bookingsUpdated}`)
  console.log(`- Reviews Added: ${testResults.reviewsAdded}`)
  console.log(`- Events Received: ${testResults.eventsReceived}`)
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:')
    testResults.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`)
    })
  }
  
  const successRate = ((testResults.productsUpdated + testResults.bookingsUpdated + testResults.reviewsAdded) / 3) * 100
  console.log(`\n🎯 Success Rate: ${successRate.toFixed(1)}%`)
  
  if (successRate >= 80) {
    console.log('✅ Demo completed successfully!')
  } else {
    console.log('⚠️ Demo completed with some issues')
  }
}

/**
 * Run the complete demo
 */
function runDemo() {
  console.log('🎬 Starting Real-Time System Demo...')
  
  if (!initDemo()) {
    console.log('❌ Demo initialization failed')
    return
  }
  
  if (!testConnection()) {
    console.log('❌ Connection test failed')
    return
  }
  
  const dataStatus = testDataLoading()
  if (!dataStatus) {
    console.log('❌ Data loading test failed')
    return
  }
  
  const cleanupEvents = testEventSystem()
  if (!cleanupEvents) {
    console.log('❌ Event system test failed')
    return
  }
  
  // Start monitoring
  const monitorInterval = monitorUpdates()
  
  // Run admin actions periodically
  demoRunning = true
  demoInterval = setInterval(() => {
    if (demoRunning) {
      simulateAdminActions()
    }
  }, DEMO_CONFIG.updateInterval)
  
  // Stop demo after duration
  setTimeout(() => {
    console.log('⏹️ Stopping demo...')
    demoRunning = false
    
    if (demoInterval) {
      clearInterval(demoInterval)
    }
    
    if (monitorInterval) {
      clearInterval(monitorInterval)
    }
    
    if (cleanupEvents) {
      cleanupEvents()
    }
    
    generateDemoReport()
  }, DEMO_CONFIG.testDuration)
}

/**
 * Stop the demo
 */
function stopDemo() {
  console.log('⏹️ Stopping demo...')
  demoRunning = false
  
  if (demoInterval) {
    clearInterval(demoInterval)
  }
  
  generateDemoReport()
}

/**
 * Quick test function
 */
function quickTest() {
  console.log('⚡ Running Quick Test...')
  
  if (!initDemo()) return
  
  if (!testConnection()) return
  
  testDataLoading()
  
  // Run one admin action
  setTimeout(() => {
    simulateAdminActions()
    
    setTimeout(() => {
      console.log('✅ Quick test completed')
      console.log(`📊 Events received: ${testResults.eventsReceived}`)
    }, 3000)
  }, 1000)
}

// Export functions for manual testing
if (typeof window !== 'undefined') {
  window.realTimeDemo = {
    runDemo,
    stopDemo,
    quickTest,
    testConnection,
    testDataLoading,
    simulateAdminActions
  }
  
  console.log('🎮 Demo functions available:')
  console.log('- realTimeDemo.runDemo() - Run complete demo')
  console.log('- realTimeDemo.stopDemo() - Stop running demo')
  console.log('- realTimeDemo.quickTest() - Run quick test')
  console.log('- realTimeDemo.testConnection() - Test connection')
  console.log('- realTimeDemo.testDataLoading() - Test data loading')
  console.log('- realTimeDemo.simulateAdminActions() - Simulate admin actions')
}

// Auto-run quick test if on demo page
if (typeof window !== 'undefined' && window.location.pathname.includes('realtime')) {
  console.log('🔄 Auto-running quick test on real-time page...')
  setTimeout(quickTest, 2000)
}

export {
  runDemo,
  stopDemo,
  quickTest,
  testConnection,
  testDataLoading,
  simulateAdminActions
} 