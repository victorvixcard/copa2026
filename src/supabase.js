import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bouezaonynaiiqmuhwyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_D6FDpfr5Lw3mLQZX3K-_6w_s47iT49n'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
