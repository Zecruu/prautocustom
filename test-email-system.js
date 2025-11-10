/**
 * Email System Test Script
 * 
 * This script tests all email functions to ensure Resend is working properly.
 * Run this after verifying your domain in Resend.
 * 
 * Usage:
 *   node test-email-system.js
 * 
 * Or test individual emails:
 *   node test-email-system.js welcome
 *   node test-email-system.js reset
 *   node test-email-system.js quote-confirmation
 *   node test-email-system.js quote-response
 *   node test-email-system.js password-change
 *   node test-email-system.js quote-to-company
 */

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

// Test email address (change this to your email)
const TEST_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustoms.com';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: Welcome Email
async function testWelcomeEmail() {
  log('\n📧 Testing Welcome Email...', 'blue');
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: TEST_EMAIL,
      subject: '[TEST] Welcome to PR Auto Custom!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EAB308;">Welcome to PR Auto Custom!</h1>
          <p>Hi Test User,</p>
          <p>Thank you for creating an account with PR Auto Custom!</p>
          <p>This is a test email to verify the welcome email system is working.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email from the email system verification script.</p>
        </div>
      `,
    });

    if (error) {
      log(`❌ Welcome Email Failed: ${error.message}`, 'red');
      return false;
    }

    log(`✅ Welcome Email Sent! ID: ${data.id}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Welcome Email Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 2: Password Reset Email
async function testPasswordResetEmail() {
  log('\n🔐 Testing Password Reset Email...', 'blue');
  
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=test_token_123`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: TEST_EMAIL,
      subject: '[TEST] Reset Your PR Auto Custom Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EAB308;">Password Reset Request</h1>
          <p>Hi Test User,</p>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetLink}" style="background: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #666;">Or copy this link: ${resetLink}</p>
          <p style="color: #999; font-size: 14px;">⏰ This link will expire in 1 hour.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email from the email system verification script.</p>
        </div>
      `,
    });

    if (error) {
      log(`❌ Password Reset Email Failed: ${error.message}`, 'red');
      return false;
    }

    log(`✅ Password Reset Email Sent! ID: ${data.id}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Password Reset Email Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Quote Confirmation Email
async function testQuoteConfirmationEmail() {
  log('\n📋 Testing Quote Confirmation Email...', 'blue');
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: TEST_EMAIL,
      replyTo: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
      subject: '[TEST] Quote Request Received - Quote #Q-12345',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EAB308;">Quote Request Received</h1>
          <p>Hi Test User,</p>
          <p>We've received your quote request!</p>
          <p><strong>Quote Number:</strong> Q-12345</p>
          <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
          <h3>Requested Products:</h3>
          <ul>
            <li>Custom Rims - 20"</li>
            <li>Performance Tires</li>
          </ul>
          <p>We'll review your request and send you a detailed quote within 24-48 hours.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email from the email system verification script.</p>
        </div>
      `,
    });

    if (error) {
      log(`❌ Quote Confirmation Email Failed: ${error.message}`, 'red');
      return false;
    }

    log(`✅ Quote Confirmation Email Sent! ID: ${data.id}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Quote Confirmation Email Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 4: Quote Response Email
async function testQuoteResponseEmail() {
  log('\n💰 Testing Quote Response Email...', 'blue');
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: TEST_EMAIL,
      replyTo: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
      subject: '[TEST] Quote Response from PR Auto Custom - Quote #Q-12345',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EAB308;">Your Quote is Ready!</h1>
          <p>Hi Test User,</p>
          <p>We've prepared your custom quote!</p>
          <p><strong>Quote Number:</strong> Q-12345</p>
          <p><strong>Valid Until:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          <h3>Quote Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Custom Rims - 20"</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">$1,200.00</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Performance Tires</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">$800.00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td style="padding: 8px;">Total</td>
              <td style="padding: 8px; text-align: right;">$2,000.00</td>
            </tr>
          </table>
          <p>Reply to this email to accept the quote or ask questions!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email from the email system verification script.</p>
        </div>
      `,
    });

    if (error) {
      log(`❌ Quote Response Email Failed: ${error.message}`, 'red');
      return false;
    }

    log(`✅ Quote Response Email Sent! ID: ${data.id}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Quote Response Email Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 5: Password Change Email
async function testPasswordChangeEmail() {
  log('\n🔒 Testing Password Change Email...', 'blue');
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: TEST_EMAIL,
      subject: '[TEST] Your PR Auto Custom Password Has Been Changed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EAB308;">Password Changed</h1>
          <p>Hi Test User,</p>
          <p>Your password was successfully changed.</p>
          <p><strong>Change Date:</strong> ${new Date().toLocaleString()}</p>
          <p style="color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 6px;">
            ⚠️ If you didn't make this change, please contact us immediately at ${process.env.NEXT_PUBLIC_COMPANY_EMAIL}
          </p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email from the email system verification script.</p>
        </div>
      `,
    });

    if (error) {
      log(`❌ Password Change Email Failed: ${error.message}`, 'red');
      return false;
    }

    log(`✅ Password Change Email Sent! ID: ${data.id}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Password Change Email Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 6: Quote Request to Company
async function testQuoteToCompanyEmail() {
  log('\n🏢 Testing Quote Request to Company Email...', 'blue');
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
      replyTo: TEST_EMAIL, // When you reply, it goes to the test email
      subject: '[TEST] New Quote Request #Q-12345 from Test User',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EAB308;">New Quote Request</h1>
          <p><strong>Quote Number:</strong> Q-12345</p>
          <p><strong>Client Name:</strong> Test User</p>
          <p><strong>Client Email:</strong> ${TEST_EMAIL}</p>
          <p><strong>Client Phone:</strong> +1 (787) 555-1234</p>
          <h3>Requested Products:</h3>
          <ul>
            <li>Custom Rims - 20"</li>
            <li>Performance Tires</li>
          </ul>
          <h3>Message:</h3>
          <p>Looking for black rims with chrome accents. Need them ASAP!</p>
          <hr>
          <p style="color: #666; font-size: 12px;"><em>Click "Reply" to respond directly to Test User</em></p>
          <p style="color: #666; font-size: 12px;">This is a test email from the email system verification script.</p>
        </div>
      `,
    });

    if (error) {
      log(`❌ Quote to Company Email Failed: ${error.message}`, 'red');
      return false;
    }

    log(`✅ Quote to Company Email Sent! ID: ${data.id}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Quote to Company Email Error: ${error.message}`, 'red');
    return false;
  }
}

// Helper function to add delay between tests (to avoid rate limits)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test runner
async function runAllTests() {
  log('\n🚀 PR Auto Custom Email System Test', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  log(`📧 Test Email: ${TEST_EMAIL}`, 'yellow');
  log(`📤 From Email: ${process.env.RESEND_FROM_EMAIL}`, 'yellow');
  log(`🔑 API Key: ${process.env.RESEND_API_KEY?.substring(0, 10)}...`, 'yellow');
  log('═══════════════════════════════════════\n', 'yellow');

  const results = {};

  // Run tests with delays to avoid rate limits (2 emails per second max)
  results.welcome = await testWelcomeEmail();
  await delay(600); // Wait 600ms between tests

  results.reset = await testPasswordResetEmail();
  await delay(600);

  results.quoteConfirmation = await testQuoteConfirmationEmail();
  await delay(600);

  results.quoteResponse = await testQuoteResponseEmail();
  await delay(600);

  results.passwordChange = await testPasswordChangeEmail();
  await delay(600);

  results.quoteToCompany = await testQuoteToCompanyEmail();

  // Summary
  log('\n═══════════════════════════════════════', 'yellow');
  log('📊 Test Results Summary', 'yellow');
  log('═══════════════════════════════════════', 'yellow');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${icon} ${test}`, color);
  });

  log('\n═══════════════════════════════════════', 'yellow');
  log(`${passed}/${total} tests passed`, passed === total ? 'green' : 'red');
  log('═══════════════════════════════════════\n', 'yellow');

  if (passed === total) {
    log('🎉 All email systems are working!', 'green');
    log(`📬 Check your inbox at ${TEST_EMAIL}`, 'green');
  } else {
    log('⚠️  Some email systems failed. Check the errors above.', 'red');
  }
}

// Run specific test or all tests
const testName = process.argv[2];

if (testName) {
  const tests = {
    welcome: testWelcomeEmail,
    reset: testPasswordResetEmail,
    'quote-confirmation': testQuoteConfirmationEmail,
    'quote-response': testQuoteResponseEmail,
    'password-change': testPasswordChangeEmail,
    'quote-to-company': testQuoteToCompanyEmail,
  };

  if (tests[testName]) {
    log(`\n🧪 Running single test: ${testName}`, 'yellow');
    tests[testName]();
  } else {
    log(`\n❌ Unknown test: ${testName}`, 'red');
    log('Available tests:', 'yellow');
    Object.keys(tests).forEach(t => log(`  - ${t}`, 'blue'));
  }
} else {
  runAllTests();
}

