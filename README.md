# MAXTERRA® PDF Packet Builder

A professional web application for creating custom submittal packages for MAXTERRA® MgO Non-Combustible Floor Panels.

## Features

- **Three-Step Workflow**
  1. Fill out submittal form with project details
  2. Select required documents from library
  3. Arrange document order via drag-and-drop

- **Dynamic PDF Generation**
  - Professional cover page with project information
  - Custom divider pages between documents
  - Merges multiple PDF documents into a single packet
  - Automatic page numbering and metadata

- **Document Library**
  - Installation Guide (21 pages)
  - Technical Data Sheet (2 pages)
  - ICC-ES Evaluation Report ESR-5194 (12 pages)
  - Safety Data Sheet MSDS (11 pages)
  - LEED Credit Guide (4 pages)

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light mode toggle
  - Smooth animations and transitions
  - Real-time validation

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **PDF Generation**: pdf-lib
- **Drag & Drop**: @hello-pangea/dnd
- **Backend**: Supabase (Database, Storage, Edge Functions)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (or use the configured instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-packet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Generate sample PDF documents (for testing):
```bash
node scripts/generate-sample-pdfs.mjs
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## PDF Generation Setup

The application uses a Supabase Edge Function to merge PDFs. For detailed setup instructions, see [PDF_GENERATION_SETUP.md](./PDF_GENERATION_SETUP.md).

### Quick Setup for Testing

1. Generate sample PDFs:
```bash
node scripts/generate-sample-pdfs.mjs
```

2. The sample PDFs will be created in `public/documents/`

3. Test the packet generation through the UI

### Using Real Documents

If you have the actual MAXTERRA product PDFs:

1. Place them in `public/documents/` with these exact names:
   - `Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf`
   - `TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf`
   - `ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf`
   - `MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf`
   - `LEED Credit Guide 7-16-25 (1).pdf`

2. The application will automatically use them

## Project Structure

```
pdf-packet/
├── public/
│   └── documents/          # PDF source documents
├── scripts/
│   ├── generate-sample-pdfs.mjs   # Generate test PDFs
│   └── upload-documents.ts        # Upload to Supabase Storage
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── constants/         # Constants and config
├── supabase/
│   ├── functions/         # Edge Functions
│   │   └── generate-packet/    # PDF generation function
│   └── migrations/        # Database migrations
└── ...
```

## Database Schema

The application uses the following tables:

- **documents** - PDF document library
- **projects** - Project information
- **packets** - Generated PDF packets
- **packet_documents** - Document-packet relationships
- **divider_templates** - Divider page templates

All tables have Row Level Security (RLS) enabled for public read access.

## Edge Functions

### generate-packet

Generates custom PDF packets by:
1. Creating a cover page with form data
2. Adding divider pages for each document
3. Merging selected PDF documents
4. Uploading the final packet to Supabase Storage

**Endpoint**: `POST /functions/v1/generate-packet`

**Request Body**:
```json
{
  "formData": { /* submittal form data */ },
  "documents": [ /* selected documents */ ],
  "fileName": "MAXTERRA_ProjectName_2025-10-17.pdf",
  "frontendUrl": "http://localhost:5173"
}
```

## Troubleshooting

### PDF Generation Shows Only 1 Page

The placeholder PDF files in `public/documents/` are only 20 bytes each. Run the sample PDF generator:

```bash
node scripts/generate-sample-pdfs.mjs
```

Or replace them with real PDF documents.

### Build Warnings About Chunk Size

The application uses several libraries that result in larger chunks. This is expected for a PDF generation application. Consider implementing code splitting if needed.

### Supabase Connection Issues

Verify your environment variables are set correctly in `.env`:
```bash
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

## License

© 2025 NEXGEN Building Products, LLC

## Support

For issues or questions, please contact the development team.
