# PDF Generation Setup Guide

## Current Issue

The generated PDF packets currently contain only a cover page (1 page) because the actual PDF documents in `public/documents/` are placeholder files (20 bytes each). To generate proper multi-page packets, you need actual PDF files.

## Solution Overview

The Edge Function (`supabase/functions/generate-packet/index.ts`) has been updated with:

1. **Better error detection** - Detects placeholder files (< 100 bytes) and skips them
2. **Detailed logging** - Shows exactly what's happening during PDF merging
3. **Graceful error handling** - Continues processing even if individual documents fail

## Setup Steps

### Option 1: Generate Sample PDFs (For Testing)

Run this command to generate sample multi-page PDFs:

```bash
node scripts/generate-sample-pdfs.mjs
```

This will create 5 sample PDF files in `public/documents/`:
- Installation Guide (21 pages)
- Technical Data Sheet (2 pages)
- ICC-ES Evaluation Report (12 pages)
- Safety Data Sheet (11 pages)
- LEED Credit Guide (4 pages)

Total: 50 pages of sample content

### Option 2: Use Real PDF Documents

If you have the actual MAXTERRA product documents:

1. Replace the placeholder files in `public/documents/` with the real PDFs
2. Ensure the file names match exactly:
   - `Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf`
   - `TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf`
   - `ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf`
   - `MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf`
   - `LEED Credit Guide 7-16-25 (1).pdf`

## How It Works

When a user creates a packet:

1. **Cover Page**: Generated dynamically with form data (project info, contact details, etc.)
2. **For Each Document**:
   - A divider page is created with the document name
   - The actual PDF is fetched from `public/documents/`
   - All pages from the PDF are merged into the packet
3. **Final PDF**: Uploaded to Supabase Storage and made available for download

## Expected Results

With proper PDF files in place, a packet with all 5 documents should contain:

- 1 cover page
- 5 divider pages (one per document)
- 50+ content pages (from the actual PDFs)
- **Total: ~56 pages**

File size should be 2-5 MB depending on the document content.

## Troubleshooting

### PDF Generation Still Shows 1 Page

1. Check the Edge Function logs in Supabase Dashboard
2. Look for messages like:
   - "Document X is too small (20 bytes), likely a placeholder file"
   - "Failed to load/merge PDF"
3. Verify PDF files are valid:
   ```bash
   ls -lh public/documents/
   ```
   Files should be > 100 KB each, not 20 bytes

### Documents Not Merging

1. Check that `storage_path` in the database matches the file names
2. Verify files are accessible at `http://localhost:5173/documents/[filename]`
3. Check browser console and Edge Function logs for specific errors

## Testing the Fix

1. Generate or add real PDFs to `public/documents/`
2. Create a new packet through the UI
3. Check the success modal for:
   - File size (should be > 1 MB)
   - Page count (should be > 10)
4. Download and open the PDF
5. Verify all documents are included with proper formatting

## Database Schema

The documents table is already properly configured:

```sql
SELECT title, file_name, storage_path, page_count, file_size
FROM documents
ORDER BY display_order;
```

All 5 documents have correct storage paths pointing to `/documents/[filename]`.

## Support

If issues persist:
1. Check the Supabase Edge Function logs for detailed error messages
2. Verify the files in `public/documents/` are valid PDFs
3. Test accessing PDFs directly in the browser at the public URLs
