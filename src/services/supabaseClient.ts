import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jdlfnxooydsrxewavyga.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbGZueG9veWRzcnhld2F2eWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTk0MTIsImV4cCI6MjEwMzgzNTQxMn0.BQY6WBLBRfoyDkrbJpWgP8dV6DyuUtWjVGrwcK6EssA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
