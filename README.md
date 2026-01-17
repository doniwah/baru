# React PDF Flipbook Viewer

A React-based PDF flipbook viewer that allows users to view PDF documents in an interactive flipbook format. Built with Next.js for a seamless and immersive reading experience.

## 🎮 Live Demo

Try it out on CodeSandbox: [Live Demo](https://codesandbox.io/p/github/mohitkumawat310/react-pdf-flipbook-viewer/master?import=true)

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

Run the development server using one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## ✨ Features

- 📖 **Flipbook Navigation** - Navigate through PDF pages with smooth flipbook-style animations
- 🔍 **Zoom and Pan** - Zoom in/out and pan around pages for detailed viewing
- 🖥️ **Fullscreen Mode** - Toggle fullscreen for an immersive reading experience
- ⌨️ **Keyboard Shortcuts** - Use arrow keys for quick page navigation
- 📱 **Responsive Design** - Optimized for all screen sizes and devices

## 📚 API Reference

### FlipbookViewer

Main component for displaying the PDF flipbook.

| Prop           | Type      | Required | Description                                  |
| -------------- | --------- | -------- | -------------------------------------------- |
| `pdfUrl`       | `string`  | Yes      | URL of the PDF document to display           |
| `shareUrl`     | `string`  | No       | URL for sharing the document                 |
| `className`    | `string`  | No       | Additional CSS classes for custom styling    |
| `disableShare` | `boolean` | No       | Disables the share button when set to `true` |

### Toolbar

Toolbar component providing navigation and control options.

| Prop           | Type      | Required | Description                                  |
| -------------- | --------- | -------- | -------------------------------------------- |
| `flipbookRef`  | `object`  | Yes      | Reference to the flipbook component          |
| `containerRef` | `object`  | Yes      | Reference to the container element           |
| `screenfull`   | `object`  | Yes      | Screenfull instance for fullscreen control   |
| `pdfDetails`   | `object`  | Yes      | PDF document details (total pages, etc.)     |
| `viewerStates` | `object`  | Yes      | Current viewer state (page, zoom scale)      |
| `shareUrl`     | `string`  | No       | URL for sharing the document                 |
| `disableShare` | `boolean` | No       | Disables the share button when set to `true` |

### Flipbook

Core flipbook component handling page rendering and animations.

| Prop              | Type       | Required | Description                              |
| ----------------- | ---------- | -------- | ---------------------------------------- |
| `viewerStates`    | `object`   | Yes      | Current viewer state (page, zoom scale)  |
| `setViewerStates` | `function` | Yes      | Function to update the viewer state      |
| `flipbookRef`     | `object`   | Yes      | Reference to the flipbook component      |
| `pdfDetails`      | `object`   | Yes      | PDF document details (total pages, etc.) |

### SliderNav

Slider component for quick page navigation.

| Prop           | Type     | Required | Description                              |
| -------------- | -------- | -------- | ---------------------------------------- |
| `flipbookRef`  | `object` | Yes      | Reference to the flipbook component      |
| `pdfDetails`   | `object` | Yes      | PDF document details (total pages, etc.) |
| `viewerStates` | `object` | Yes      | Current viewer state (page, zoom scale)  |

## 📖 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js/) - Feedback and contributions welcome

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more deployment options.

## 🙏 Acknowledgments

This project is built with amazing open-source libraries:

### Core Technologies

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

### PDF & Flipbook

- [react-pdf](https://github.com/wojtekmaj/react-pdf) - PDF rendering
- [react-pageflip](https://github.com/Nodlik/react-pageflip) - Page flip animations
- [react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch) - Zoom and pan functionality

### UI Components & Utilities

- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Lucide React](https://github.com/lucide-icons/lucide) - Icon library
- [Screenfull](https://github.com/sindresorhus/screenfull.js) - Fullscreen API wrapper
- [KeyboardJS](https://github.com/RobertWHurst/KeyboardJS) - Keyboard event handling
- [React Share](https://github.com/nygardk/react-share) - Social sharing buttons
- [Sonner](https://github.com/emilkowalski/sonner) - Toast notifications

### Styling Utilities

- [class-variance-authority](https://github.com/joe-bell/class-variance-authority) - CSS variant management
- [clsx](https://github.com/lukeed/clsx) - Class name utility
