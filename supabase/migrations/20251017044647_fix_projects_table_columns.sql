/*
  # Fix Projects Table Columns

  ## Description
  Updates the `projects` table to use JSONB for status and submittal_type columns
  to match the application's data structure.

  ## Changes
  - Change `status` column from text to jsonb
  - Change `submittal_type` column from text to jsonb
  - Change `product_size` to nullable text (optional field)

  ## Migration Strategy
  - Drop and recreate columns (safe since table is new and empty)
*/

-- Drop old columns
ALTER TABLE projects DROP COLUMN IF EXISTS status;
ALTER TABLE projects DROP COLUMN IF EXISTS submittal_type;

-- Add new columns with correct types
ALTER TABLE projects ADD COLUMN status jsonb NOT NULL;
ALTER TABLE projects ADD COLUMN submittal_type jsonb NOT NULL;

-- Update product_size to be nullable if it isn't already
ALTER TABLE projects ALTER COLUMN product_size DROP NOT NULL;
