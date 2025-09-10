# Portfolio Website

A responsive portfolio website built with Next.js 15, TypeScript, and modern web technologies.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS with custom properties
- **State Management**: React hooks (useState, useMemo, useEffect)
- **Content Management**: JSON-based configuration

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and responsive design
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main portfolio page
├── config/
│   └── data.json            # Portfolio content and configuration
└── public/
    └── projects/            # Project images and media assets
```

## Implementation

### Content Management
Portfolio content is managed through `src/config/data.json`:
- Profile information and social links
- Project details with media, tags, and links
- Experience timeline and achievements
- Testimonials and configuration settings

### Core Components

**Project Carousel**
- Interactive photo/video carousels with navigation controls
- Auto-hide controls on hover/click
- Fullscreen viewing with aspect ratio preservation

**Filter System**
- Real-time search and tag filtering
- Applied filters display with individual removal
- Responsive filter UI

**Fullscreen Media Viewer**
- Aspect ratio preservation (max 80vh height)
- Project ID-based navigation
- Keyboard and click navigation

**Responsive Layout**
- Mobile-first design approach
- Desktop: Multi-column grid layout
- Mobile: Single-column stacked layout
- Touch-optimized interactions

### Data Structure

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "description": "Project description...",
  "liveLink": "https://project-url.com",
  "link": "https://github.com/username/repo",
  "photos": ["/projects/project/img1.png"],
  "video": "https://youtube.com/watch?v=...",
  "tags": ["react", "typescript", "nextjs"],
  "desktopOnly": false
}
```

## Development

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Customization

1. **Update Content**: Modify `src/config/data.json`
2. **Add Projects**: Add new projects with required fields
3. **Styling**: Customize `src/app/globals.css`
4. **Images**: Add project images to `public/projects/` directory

## Deployment

Optimized for Vercel deployment:
1. Connect GitHub repository to Vercel
2. Configure build settings (Next.js framework)
3. Deploy automatically on push to main branch

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)