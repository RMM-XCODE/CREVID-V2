// Script untuk membantu setup Turso
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️ TURSO DATABASE SETUP HELPER\n');

try {
  // Check if turso CLI is installed
  console.log('1. Checking Turso CLI installation...');
  try {
    const version = execSync('turso --version', { encoding: 'utf8' });
    console.log('✅ Turso CLI installed:', version.trim());
  } catch (error) {
    console.log('❌ Turso CLI not found. Please install it first:');
    console.log('   Windows: iwr -useb https://get.tur.so/install.ps1 | iex');
    console.log('   macOS/Linux: curl -sSfL https://get.tur.so/install.sh | bash');
    process.exit(1);
  }

  // Check if user is logged in
  console.log('\n2. Checking authentication...');
  try {
    const whoami = execSync('turso auth whoami', { encoding: 'utf8' });
    console.log('✅ Logged in as:', whoami.trim());
  } catch (error) {
    console.log('❌ Not logged in. Please run: turso auth login');
    process.exit(1);
  }

  // List databases
  console.log('\n3. Listing databases...');
  try {
    const databases = execSync('turso db list', { encoding: 'utf8' });
    console.log('📋 Available databases:');
    console.log(databases);
  } catch (error) {
    console.log('❌ Failed to list databases:', error.message);
  }

  // Check if crevidv2 database exists
  console.log('\n4. Checking crevidv2 database...');
  try {
    const dbInfo = execSync('turso db show crevidv2', { encoding: 'utf8' });
    console.log('✅ Database crevidv2 found:');
    
    // Extract URL from output
    const urlMatch = dbInfo.match(/URL:\s*(libsql:\/\/[^\s]+)/);
    if (urlMatch) {
      const dbUrl = urlMatch[1];
      console.log('📍 Database URL:', dbUrl);
      
      // Generate token
      console.log('\n5. Generating auth token...');
      const token = execSync('turso db tokens create crevidv2', { encoding: 'utf8' }).trim();
      console.log('🔑 Auth Token:', token);
      
      // Update .env file
      console.log('\n6. Updating .env file...');
      const envPath = path.join(__dirname, '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update DATABASE_URL
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${dbUrl}`
      );
      
      // Update DATABASE_AUTH_TOKEN
      envContent = envContent.replace(
        /DATABASE_AUTH_TOKEN=.*/,
        `DATABASE_AUTH_TOKEN=${token}`
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ .env file updated successfully!');
      
      console.log('\n🎉 TURSO SETUP COMPLETE!');
      console.log('\n📋 Next steps:');
      console.log('   1. npm run db:migrate    # Apply schema to Turso');
      console.log('   2. npm run db:init       # Initialize with default data');
      console.log('   3. npm run build         # Build the application');
      console.log('   4. npm start             # Start the server');
      
    } else {
      console.log('❌ Could not extract database URL from output');
    }
    
  } catch (error) {
    console.log('❌ Database crevidv2 not found. Creating it...');
    try {
      execSync('turso db create crevidv2', { stdio: 'inherit' });
      console.log('✅ Database crevidv2 created! Please run this script again.');
    } catch (createError) {
      console.log('❌ Failed to create database:', createError.message);
    }
  }

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}