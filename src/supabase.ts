import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uigafhmpewylmmxhkkof.supabase.co';
const supabaseKey = 'sb_publishable_tvBfBDMLNKb3R2NCcWCLHA_HarDv-3H';

export const supabase = createClient(supabaseUrl, supabaseKey);
