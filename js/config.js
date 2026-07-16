/* ==========================================================================
   LifeOS - Site configuration
   --------------------------------------------------------------------------
   EDIT THIS FILE to update the download link, version, GitHub URL, or contact.
   Every button and label on the site reads from this single object, so you
   never have to touch the HTML to change a link.

   Every button and label reads from this object. Edit here, never the HTML.

   ── Where the download points ─────────────────────────────────────────────
   DOWNLOAD_URL serves the portable Windows build committed to the app repo
   under release/LifeOS-0.1.0-portable.exe. That file is tracked by Git LFS,
   so the plain raw.githubusercontent.com URL would return only a 134-byte LFS
   *pointer*, not the ~155 MB binary. The working direct-download form is the
   LFS media endpoint below (media.githubusercontent.com/media/…).

   ⚠️ LFS bandwidth: GitHub's free tier allows ~1 GiB/month (~6 downloads of
   this file) before the media URL 403s. For durable public distribution,
   publish the exe as a GitHub *Release* asset and point DOWNLOAD_URL there:
     https://github.com/PraveenKumarDreamnotion/LifeOS/releases/latest/download/LifeOS-0.1.0-portable.exe
   ========================================================================== */

window.LIFEOS_CONFIG = {
  // Product
  NAME: "LifeOS",
  ASSISTANT: "Yogi",
  AUTHOR: "DreamNotion",
  VERSION: "0.1.0",
  LICENSE: "MIT",

  // Download - direct link to the portable exe (Git LFS media endpoint)
  DOWNLOAD_URL: "https://media.githubusercontent.com/media/PraveenKumarDreamnotion/LifeOS/main/release/LifeOS-0.1.0-portable.exe",
  DOWNLOAD_FILENAME: "LifeOS-0.1.0-portable.exe",
  DOWNLOAD_SIZE: "~155 MB",
  PLATFORM: "Windows 10 (1809+) & 11 · 64-bit",

  // Links
  GITHUB_URL: "https://github.com/PraveenKumarDreamnotion/LifeOS",
  RELEASES_URL: "https://github.com/PraveenKumarDreamnotion/LifeOS/releases",
  CONTACT_EMAIL: "tech@dreamnotion.com",

  // Dates shown on legal pages
  LEGAL_UPDATED: "July 15, 2026"
};
