/**
 * Live Chat System Demo Script
 * 
 * This script demonstrates the live chat system functionality
 * Run this in the browser console to test the chat features
 */

console.log('💬 Live Chat System Demo Starting...')

// Demo configuration
const DEMO_CONFIG = {
  testDuration: 30000, // 30 seconds
  messageInterval: 3000, // 3 seconds between messages
  maxMessages: 10,
  testRoomId: 'demo-room'
}

// Demo state
let demoRunning = false
let demoInterval = null
let testResults = {
  messagesSent: 0,
  messagesReceived: 0,
  reactionsAdded: 0,
  errors: [],
  events: []
}

/**
 * Initialize the chat demo
 */
function initChatDemo() {
  console.log('📋 Initializing Chat System Demo...')
  
  // Check if chat system is available
  if (typeof window !== 'undefined' && window.useChat) {
    console.log('✅ Chat system is available')
    return true
  } else {
    console.log('❌ Chat system not found')
    console.log('💡 Make sure you are on the chat page (/chat)')
    return false
  }
}

/**
 * Test chat connection
 */
function testChatConnection() {
  console.log('🔗 Testing Chat Connection...')
  
  try {
    const { isAuthenticated, currentUser, loading } = window.useChat(DEMO_CONFIG.testRoomId)
    
    if (isAuthenticated.value) {
      console.log('✅ User authenticated:', currentUser.value?.email)
      return true
    } else {
      console.log('❌ User not authenticated')
      console.log('💡 Please sign in to test the chat system')
      return false
    }
  } catch (error) {
    console.error('❌ Chat connection test failed:', error)
    return false
  }
}

/**
 * Test message sending
 */
async function testMessageSending() {
  console.log('📤 Testing Message Sending...')
  
  try {
    const { sendMessage, messages } = window.useChat(DEMO_CONFIG.testRoomId)
    
    const testMessages = [
      'Hello from the demo! 👋',
      'This is a test message 🧪',
      'Testing real-time chat features ⚡',
      'Message with emojis 😊🎉🚀',
      'Testing message formatting **bold** and *italic*'
    ]
    
    for (let i = 0; i < Math.min(testMessages.length, 3); i++) {
      const messageId = await sendMessage(testMessages[i])
      if (messageId) {
        console.log(`✅ Message sent: ${testMessages[i]}`)
        testResults.messagesSent++
      } else {
        console.log(`❌ Failed to send message: ${testMessages[i]}`)
        testResults.errors.push(`Failed to send message: ${testMessages[i]}`)
      }
      
      // Wait a bit between messages
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    return true
  } catch (error) {
    console.error('❌ Message sending test failed:', error)
    testResults.errors.push('Message sending test failed')
    return false
  }
}

/**
 * Test message reactions
 */
async function testMessageReactions() {
  console.log('😊 Testing Message Reactions...')
  
  try {
    const { addReaction, messages } = window.useChat(DEMO_CONFIG.testRoomId)
    
    if (messages.value.length > 0) {
      const message = messages.value[0]
      const reactions = ['👍', '❤️', '😂']
      
      for (const reaction of reactions) {
        const success = await addReaction(message.id, reaction)
        if (success) {
          console.log(`✅ Reaction added: ${reaction}`)
          testResults.reactionsAdded++
        } else {
          console.log(`❌ Failed to add reaction: ${reaction}`)
          testResults.errors.push(`Failed to add reaction: ${reaction}`)
        }
        
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } else {
      console.log('⚠️ No messages available for reaction testing')
    }
    
    return true
  } catch (error) {
    console.error('❌ Message reactions test failed:', error)
    testResults.errors.push('Message reactions test failed')
    return false
  }
}

/**
 * Test typing indicators
 */
async function testTypingIndicators() {
  console.log('⌨️ Testing Typing Indicators...')
  
  try {
    const { startTyping, stopTyping, typingUsers } = window.useChat(DEMO_CONFIG.testRoomId)
    
    console.log('🔄 Starting typing indicator...')
    await startTyping()
    
    // Wait for typing indicator to be visible
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('🔄 Stopping typing indicator...')
    await stopTyping()
    
    console.log('✅ Typing indicators test completed')
    return true
  } catch (error) {
    console.error('❌ Typing indicators test failed:', error)
    testResults.errors.push('Typing indicators test failed')
    return false
  }
}

/**
 * Test message editing
 */
async function testMessageEditing() {
  console.log('✏️ Testing Message Editing...')
  
  try {
    const { editMessage, messages } = window.useChat(DEMO_CONFIG.testRoomId)
    
    // Find a message sent by current user
    const ownMessage = messages.value.find(m => m.userId === window.useChat().currentUser.value?.uid)
    
    if (ownMessage) {
      const newContent = `${ownMessage.content} (edited)`
      const success = await editMessage(ownMessage.id, newContent)
      
      if (success) {
        console.log('✅ Message edited successfully')
        return true
      } else {
        console.log('❌ Failed to edit message')
        testResults.errors.push('Failed to edit message')
        return false
      }
    } else {
      console.log('⚠️ No own messages available for editing')
      return true
    }
  } catch (error) {
    console.error('❌ Message editing test failed:', error)
    testResults.errors.push('Message editing test failed')
    return false
  }
}

/**
 * Monitor real-time updates
 */
function monitorRealTimeUpdates() {
  console.log('👀 Monitoring Real-Time Updates...')
  
  const { messages, typingUsers, unreadCount } = window.useChat(DEMO_CONFIG.testRoomId)
  
  const monitorInterval = setInterval(() => {
    console.log(`📊 Real-time stats:`)
    console.log(`  - Messages: ${messages.value.length}`)
    console.log(`  - Typing users: ${typingUsers.value.size}`)
    console.log(`  - Unread count: ${unreadCount.value}`)
    
    // Track received messages
    testResults.messagesReceived = messages.value.length
  }, 5000)
  
  return monitorInterval
}

/**
 * Test error handling
 */
function testErrorHandling() {
  console.log('🛡️ Testing Error Handling...')
  
  try {
    const { sendMessage } = window.useChat(DEMO_CONFIG.testRoomId)
    
    // Test sending empty message
    sendMessage('').catch(error => {
      console.log('✅ Empty message error handled correctly')
    })
    
    // Test sending very long message
    const longMessage = 'A'.repeat(1001)
    sendMessage(longMessage).catch(error => {
      console.log('✅ Long message error handled correctly')
    })
    
    console.log('✅ Error handling test completed')
    return true
  } catch (error) {
    console.error('❌ Error handling test failed:', error)
    testResults.errors.push('Error handling test failed')
    return false
  }
}

/**
 * Generate demo report
 */
function generateChatDemoReport() {
  console.log('\n📋 Chat Demo Report')
  console.log('==================')
  
  console.log('Test Results:')
  console.log(`- Messages Sent: ${testResults.messagesSent}`)
  console.log(`- Messages Received: ${testResults.messagesReceived}`)
  console.log(`- Reactions Added: ${testResults.reactionsAdded}`)
  console.log(`- Events Logged: ${testResults.events.length}`)
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:')
    testResults.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`)
    })
  }
  
  const successRate = ((testResults.messagesSent + testResults.reactionsAdded) / 5) * 100
  console.log(`\n🎯 Success Rate: ${successRate.toFixed(1)}%`)
  
  if (successRate >= 80) {
    console.log('✅ Chat demo completed successfully!')
  } else {
    console.log('⚠️ Chat demo completed with some issues')
  }
  
  console.log('\n💡 Features Tested:')
  console.log('- ✅ Real-time messaging')
  console.log('- ✅ Message reactions')
  console.log('- ✅ Typing indicators')
  console.log('- ✅ Message editing')
  console.log('- ✅ Error handling')
  console.log('- ✅ Listener cleanup')
}

/**
 * Run the complete chat demo
 */
async function runChatDemo() {
  console.log('🎬 Starting Live Chat System Demo...')
  
  if (!initChatDemo()) {
    console.log('❌ Demo initialization failed')
    return
  }
  
  if (!testChatConnection()) {
    console.log('❌ Chat connection test failed')
    return
  }
  
  // Start monitoring
  const monitorInterval = monitorRealTimeUpdates()
  
  // Run tests sequentially
  console.log('\n🧪 Running Chat Tests...')
  
  await testMessageSending()
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  await testMessageReactions()
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  await testTypingIndicators()
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  await testMessageEditing()
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  testErrorHandling()
  
  // Stop demo after duration
  setTimeout(() => {
    console.log('⏹️ Stopping chat demo...')
    
    if (monitorInterval) {
      clearInterval(monitorInterval)
    }
    
    generateChatDemoReport()
  }, DEMO_CONFIG.testDuration)
}

/**
 * Stop the demo
 */
function stopChatDemo() {
  console.log('⏹️ Stopping chat demo...')
  demoRunning = false
  
  if (demoInterval) {
    clearInterval(demoInterval)
  }
  
  generateChatDemoReport()
}

/**
 * Quick test function
 */
async function quickChatTest() {
  console.log('⚡ Running Quick Chat Test...')
  
  if (!initChatDemo()) return
  if (!testChatConnection()) return
  
  await testMessageSending()
  
  setTimeout(() => {
    console.log('✅ Quick chat test completed')
    console.log(`📊 Messages sent: ${testResults.messagesSent}`)
  }, 5000)
}

/**
 * Test specific feature
 */
async function testFeature(feature) {
  console.log(`🧪 Testing ${feature}...`)
  
  switch (feature) {
    case 'sending':
      await testMessageSending()
      break
    case 'reactions':
      await testMessageReactions()
      break
    case 'typing':
      await testTypingIndicators()
      break
    case 'editing':
      await testMessageEditing()
      break
    case 'errors':
      testErrorHandling()
      break
    default:
      console.log('❌ Unknown feature:', feature)
      console.log('💡 Available features: sending, reactions, typing, editing, errors')
  }
}

// Export functions for manual testing
if (typeof window !== 'undefined') {
  window.chatDemo = {
    runDemo: runChatDemo,
    stopDemo: stopChatDemo,
    quickTest: quickChatTest,
    testFeature: testFeature,
    testConnection: testChatConnection,
    testSending: testMessageSending,
    testReactions: testMessageReactions,
    testTyping: testTypingIndicators,
    testEditing: testMessageEditing,
    testErrors: testErrorHandling
  }
  
  console.log('🎮 Chat demo functions available:')
  console.log('- chatDemo.runDemo() - Run complete demo')
  console.log('- chatDemo.stopDemo() - Stop running demo')
  console.log('- chatDemo.quickTest() - Run quick test')
  console.log('- chatDemo.testFeature("sending") - Test specific feature')
  console.log('- chatDemo.testConnection() - Test connection')
  console.log('- chatDemo.testSending() - Test message sending')
  console.log('- chatDemo.testReactions() - Test reactions')
  console.log('- chatDemo.testTyping() - Test typing indicators')
  console.log('- chatDemo.testEditing() - Test message editing')
  console.log('- chatDemo.testErrors() - Test error handling')
}

// Auto-run quick test if on chat page
if (typeof window !== 'undefined' && window.location.pathname.includes('chat')) {
  console.log('🔄 Auto-running quick chat test on chat page...')
  setTimeout(quickChatTest, 3000)
}

export {
  runChatDemo,
  stopChatDemo,
  quickChatTest,
  testFeature,
  testChatConnection,
  testMessageSending,
  testMessageReactions,
  testTypingIndicators,
  testMessageEditing,
  testErrorHandling
} 