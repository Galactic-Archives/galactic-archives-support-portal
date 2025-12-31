import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nchiitpefilejtbjimfg.supabase.co'
const supabaseAnonKey = 'sb_publishable_RxhuNGuimYydDvTqdemOIg_YuL_mxmA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
