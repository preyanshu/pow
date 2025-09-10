# Portfolio Website

A modern, responsive portfolio website built with Next.js 15, showcasing projects, experience, and achievements with a clean, minimal design.

## ✨ Features

### 🎯 **Core Functionality**
- **Multi-tab Navigation**: Proof of work, cool things, experience, wins, and testimonials
- **Advanced Project Filtering**: Search and filter projects by tags with real-time updates
- **Interactive Media Carousels**: Photo/video carousels with navigation controls
- **Fullscreen Media Viewer**: Immersive fullscreen experience with aspect ratio preservation
- **Responsive Design**: Optimized for desktop and mobile devices

### 🎨 **Design & UX**
- **Minimal Dark Theme**: Clean, professional aesthetic with dark color scheme
- **Smooth Animations**: Hover effects, transitions, and interactive feedback
- **Typography**: Custom font styling with lowercase text for modern feel
- **Visual Hierarchy**: Clear content organization and intuitive navigation

### 📱 **Responsive Features**
- **Mobile-First Design**: Optimized layouts for all screen sizes
- **Touch-Friendly Controls**: Swipe gestures and touch-optimized interactions
- **Adaptive Layouts**: Content reflows seamlessly across devices
- **Performance Optimized**: Fast loading with Next.js optimizations

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS with custom properties and responsive design
- **Image Optimization**: Next.js Image component with lazy loading
- **State Management**: React hooks (useState, useMemo, useEffect)
- **Data Management**: JSON-based content management

## 📁 Project Structure

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

## 🎛️ Content Management

The portfolio content is managed through `src/config/data.json`, which includes:

- **Profile Information**: Bio, social links, and profile image
- **Projects**: Detailed project information with media, tags, and links
- **Experience**: Professional experience timeline
- **Achievements**: Awards, grants, and recognitions
- **Testimonials**: Client and colleague feedback
- **Settings**: Configuration for pagination and display options

## 🎨 Key Components

### **Project Carousel**
- Interactive photo/video carousels with navigation controls
- Auto-hide controls on hover/click
- Smooth transitions and loading states
- Fullscreen viewing with aspect ratio preservation

### **Filter System**
- Real-time search and tag filtering
- Applied filters display with individual removal
- "Clear All" functionality
- Responsive filter UI

### **Fullscreen Media Viewer**
- Immersive fullscreen experience
- Navigation between photos and videos
- Aspect ratio preservation (max 80vh height)
- Black bars for unused space
- Keyboard and click navigation

### **Responsive Layout**
- Desktop: Multi-column grid layout
- Mobile: Single-column stacked layout
- Adaptive image sizing and spacing
- Touch-optimized interactions

## 🛠️ Development

### **Getting Started**

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

### **Customization**

1. **Update Content**: Modify `src/config/data.json` to update portfolio content
2. **Add Projects**: Add new projects with required fields (id, title, description, photos, tags)
3. **Styling**: Customize `src/app/globals.css` for design changes
4. **Images**: Add project images to `public/projects/` directory

### **Project Data Structure**

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

## 🎯 Key Features Implemented

### **Fullscreen Media System**
- ✅ Aspect ratio preservation (max 80vh height)
- ✅ Black bars for unused space
- ✅ Project ID-based navigation (not array position)
- ✅ Smooth transitions and loading states
- ✅ Mobile and desktop optimization

### **Filter & Search System**
- ✅ Real-time filtering by tags and search terms
- ✅ Applied filters display with removal buttons
- ✅ "Clear All" functionality
- ✅ Responsive filter UI

### **Carousel System**
- ✅ Photo/video carousels with navigation
- ✅ Auto-hide controls
- ✅ Mobile-optimized touch interactions
- ✅ Fixed card sizes with aspect ratio preservation

### **Responsive Design**
- ✅ Mobile-first approach
- ✅ Adaptive layouts for all screen sizes
- ✅ Touch-friendly interactions
- ✅ Performance optimizations

## 🚀 Deployment

The project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure build settings (Next.js framework)
3. Deploy automatically on push to main branch

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js 15 and modern web technologies.