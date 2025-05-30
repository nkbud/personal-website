import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awqnzmyhiohxlqeceqpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cW56bXloaW9oeGxxZWNlcXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzgyNDcsImV4cCI6MjA2NDExNDI0N30.V-6QlAfjWaOMJKQ_Bx-XgIGJ9-aWES_umRdJhRI355U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);