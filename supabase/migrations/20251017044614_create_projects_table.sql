/*
  # Create Projects Table

  ## Description
  Creates the `projects` table to store project and submittal form information.

  ## New Tables
  - `projects`
    - `id` (uuid, primary key) - Unique project identifier
    - `submitted_to` (text) - Who the submittal is submitted to
    - `project_name` (text) - Name of the project
    - `project_number` (text, nullable) - Optional project number
    - `prepared_by` (text) - Name of person who prepared the submittal
    - `phone_email` (text) - Contact information
    - `date` (text) - Submittal date
    - `status` (text) - Status of the submittal (e.g., 'For Review', 'Approved')
    - `submittal_type` (text) - Type of submittal
    - `product_size` (text, nullable) - Product size information
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on `projects` table
  - Add policy for public read access (since there's no auth)
  - Add policy for public insert access
  - Add policy for public update access
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_to text NOT NULL,
  project_name text NOT NULL,
  project_number text,
  prepared_by text NOT NULL,
  phone_email text NOT NULL,
  date text NOT NULL,
  status text NOT NULL DEFAULT 'For Review',
  submittal_type text NOT NULL,
  product_size text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to projects"
  ON projects FOR DELETE
  USING (true);

-- Create index on created_at for better query performance
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
