/* ============================================================
   SUPABASE CLIENT
============================================================ */

const SUPABASE_URL =
    "https://xcxrmpzelvyxnmphbrqj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_tgVxRizUan0YauUWQnsVPg_aY7ybdNj";


/* ============================================================
   INITIALIZE SUPABASE
============================================================ */

if (
    typeof window.supabase ===
    "undefined"
) {

    console.error(
        "Supabase library has not been loaded."
    );

} else {

    window.vgSupabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
}