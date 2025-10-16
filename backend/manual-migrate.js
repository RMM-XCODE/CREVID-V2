// Manual migration script for Turso
require('dotenv').config();

async function manualMigrate() {
  console.log('🗄️ Manual Turso Migration...\n');

  try {
    const { createClient } = require('@libsql/client');
    
    const client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    console.log('✅ Connected to Turso database');

    // Create tables manually
    console.log('\n📋 Creating tables...');

    // Contents table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS contents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        script TEXT,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'processing')),
        scenes_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contents table created');

    // Jobs table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        content_id TEXT REFERENCES contents(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('content_generation', 'media_generation', 'tts_generation', 'batch_operation')),
        status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
        qstash_message_id TEXT,
        input_data TEXT,
        result_data TEXT,
        error_message TEXT,
        progress INTEGER DEFAULT 0,
        started_at TEXT,
        completed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Jobs table created');

    // Files table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        content_id TEXT REFERENCES contents(id) ON DELETE CASCADE,
        job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
        type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio')),
        filename TEXT NOT NULL,
        gofile_url TEXT NOT NULL,
        scene_id INTEGER,
        file_size INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Files table created');

    // GoFile folders table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS gofile_folders (
        id TEXT PRIMARY KEY,
        content_id TEXT REFERENCES contents(id) ON DELETE CASCADE,
        job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
        folder_id TEXT NOT NULL,
        folder_url TEXT NOT NULL,
        folder_name TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ GoFile folders table created');

    // App settings table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id TEXT PRIMARY KEY,
        openai_api_key TEXT,
        openai_model TEXT DEFAULT 'gpt-4',
        openai_max_tokens INTEGER DEFAULT 2000,
        openai_temperature REAL DEFAULT 0.7,
        gofile_token TEXT,
        gofile_root_folder TEXT DEFAULT 'CREVID_Content',
        qstash_token TEXT,
        qstash_current_signing_key TEXT,
        qstash_next_signing_key TEXT,
        rate_limit_per_hour INTEGER DEFAULT 100,
        max_concurrent_jobs INTEGER DEFAULT 5,
        job_timeout_minutes INTEGER DEFAULT 10,
        job_retry_attempts INTEGER DEFAULT 3,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ App settings table created');

    // Request logs table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id TEXT PRIMARY KEY,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        request_body TEXT,
        response_status INTEGER NOT NULL,
        response_time_ms INTEGER NOT NULL,
        error_message TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Request logs table created');

    // Verify tables
    console.log('\n🔍 Verifying tables...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    console.log('📊 Tables in database:');
    tables.rows.forEach(row => {
      console.log(`   ✅ ${row.name}`);
    });

    console.log('\n🎉 MANUAL MIGRATION SUCCESSFUL!');
    console.log('\n📋 Next steps:');
    console.log('   1. npm run db:init       # Initialize default data');
    console.log('   2. npm run build         # Build application');
    console.log('   3. npm start             # Start server');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

manualMigrate();