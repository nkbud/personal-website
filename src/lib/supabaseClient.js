import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
// Fallback to production URLs if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://awqnzmyhiohxlqeceqpu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cW56bXloaW9oeGxxZWNlcXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzgyNDcsImV4cCI6MjA2NDExNDI0N30.V-6QlAfjWaOMJKQ_Bx-XgIGJ9-aWES_umRdJhRI355U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);