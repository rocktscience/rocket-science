# Supabase Setup Guide for Rocket Science

## 1. Verify Environment Variables

Make sure your `.env.local` file has the correct values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase dashboard:
1. Go to your project settings
2. Click on "API" in the sidebar
3. Copy the "Project URL" and "anon public" key

## 2. Set Up Database Tables

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy and paste the contents of `schema.sql` 
4. Click "Run" to execute the SQL

## 3. Debug Connection Issues

### A. Test the Connection

Create a file `test-connection.js` in your project root:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log('Testing Supabase connection...');
  
  const { data, error } = await supabase
    .from('contact_messages')
    .select('count')
    .limit(1);
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Connected to Supabase');
  }
}

test();
```

Run it with: `node test-connection.js`

### B. Check Browser Console

1. Open your app in the browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Try submitting a form
5. Look for the API request and check:
   - Status code (should be 200 for success)
   - Response body for error details

### C. Check Server Logs

When running `npm run dev`, check the terminal for any error messages when submitting forms.

## 4. Common Issues and Solutions

### Issue: "relation does not exist"
**Solution**: The tables haven't been created. Run the SQL schema in Supabase SQL Editor.

### Issue: "Failed to fetch" or CORS errors
**Solution**: 
1. Check that your Supabase URL is correct
2. Make sure you're using the anon key, not the service role key
3. Verify your project is not paused in Supabase

### Issue: "permission denied for table"
**Solution**: 
1. Check that RLS policies are correctly set up
2. For testing, you can temporarily disable RLS:
   ```sql
   ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
   ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
   ```
   (Remember to re-enable it later for security)

### Issue: Forms show success but no data in database
**Solution**: 
1. Check the RLS policies
2. Make sure the insert policy allows public access:
   ```sql
   CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
     FOR INSERT WITH CHECK (true);
   ```

## 5. Test the Forms

### Test Contact Form:
1. Go to `/contact`
2. Fill in all fields
3. Submit
4. Check Supabase dashboard → Table Editor → contact_messages

### Test Apply Form:
1. Go to `/apply`
2. Fill in all required fields
3. Submit
4. Check Supabase dashboard → Table Editor → applications

## 6. Production Checklist

Before going to production:
- [ ] Enable RLS on all tables
- [ ] Review and tighten RLS policies
- [ ] Set up email notifications for new applications/messages
- [ ] Configure proper CORS settings if needed
- [ ] Set up database backups
- [ ] Monitor usage and set up alerts

## 7. Useful SQL Queries

View recent contact messages:
```sql
SELECT * FROM contact_messages 
ORDER BY created_at DESC 
LIMIT 10;
```

View recent applications:
```sql
SELECT * FROM applications 
ORDER BY created_at DESC 
LIMIT 10;
```

Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```