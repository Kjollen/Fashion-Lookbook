import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uigafhmpewylmmxhkkof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZ2FmaG1wZXd5bG1teGhra29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDQxNzYsImV4cCI6MjEwNjQyMDE3Nn0.xOeh34rACYCmoip1AZC39SUDgkK56jQDi_PhDVDLc4k';

export const supabase = createClient(supabaseUrl, supabaseKey);
