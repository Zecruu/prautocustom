# 3D Car Brochure Component - User Guide

## Overview
The Car Brochure component provides a realistic 3D page-flipping experience (similar to AnyFlip) to showcase PR Auto Custom's car work. It uses HTML5 Canvas with smooth animations and interactive controls.

## Features

### ✨ **Realistic 3D Page Flipping**
- **Cylindrical curl effect**: Pages bend and curve like real paper
- **Dynamic shadows**: Shadows change based on flip angle for depth
- **Smooth animations**: 60fps hardware-accelerated rendering
- **Interactive corners**: Page corner hint when hovering near edge

### 🎮 **Interactive Controls**
- **Click navigation**: Click left/right side of canvas to flip pages
- **Button controls**: Previous/Next buttons with arrow icons
- **Page indicators**: Dot navigation to jump to any page
- **Keyboard support**: (Can be added) Arrow keys for navigation

### 📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Touch-friendly navigation
- Adaptive canvas sizing
- Mobile-optimized layout

## How to Customize

### 1. **Add Your Car Work Images**

Place your images in the `/public/images/` folder:
```
/public/images/
  ├── custom-wheel-project-1.jpg
  ├── performance-build-2023.jpg
  ├── body-paint-mustang.jpg
  └── ...
```

### 2. **Update Brochure Pages**

Edit `src/lib/brochureData.ts`:

```typescript
export const brochurePages: BrochurePage[] = [
  {
    id: 0,
    frontImage: '/images/your-front-image.jpg',
    backImage: '/images/your-back-image.jpg',
    title: 'Your Project Title',
    description: 'Detailed description of the work done',
    category: 'Wheels', // or 'Performance', 'Exterior', etc.
  },
  // Add more pages...
];
```

### 3. **Page Structure**

Each page has:
- **frontImage**: Image shown on the front side
- **backImage**: Image shown when page flips (back side)
- **title**: Project title displayed below canvas and in detail section
- **description**: Detailed text about the work
- **category**: Category tag for organization

## File Structure

```
src/
├── components/
│   └── CarBrochure.tsx          # Main brochure component
├── lib/
│   └── brochureData.ts          # Brochure page data (CUSTOMIZE HERE)
└── app/
    └── page.tsx                 # Landing page (uses CarBrochure)
```

## Technical Details

### Canvas Rendering
- **Technology**: HTML5 Canvas 2D API
- **Animation**: RequestAnimationFrame for smooth 60fps
- **Segments**: Page divided into 20 vertical strips for curl effect
- **Shadows**: Gradient overlays based on rotation angle

### Performance Optimizations
- Image preloading for smooth flips
- Device pixel ratio handling for sharp rendering
- Efficient redraw only when needed
- Cleanup of animation frames on unmount

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization Options

### Change Animation Speed
In `CarBrochure.tsx`, adjust the progress increment:

```typescript
const animate = () => {
  progress += 0.05;  // Lower = slower, Higher = faster (0.01 - 0.1)
  // ...
};
```

### Modify Canvas Size
In the JSX, change the height:

```typescript
<canvas
  className="w-full h-[600px]"  // Change to h-[400px], h-[800px], etc.
/>
```

### Add More Pages
Simply add new entries to `brochureData.ts`:

```typescript
{
  id: 8,
  frontImage: '/images/new-project-front.jpg',
  backImage: '/images/new-project-back.jpg',
  title: 'New Custom Project',
  description: 'Description here...',
  category: 'Custom',
}
```

### Change Colors/Styling
All styles use Tailwind CSS. Edit the className attributes:

```typescript
// Current: bg-zinc-800
// Change to: bg-gray-800, bg-black, etc.
```

## Usage Tips

### Best Practices
1. **Image Quality**: Use high-resolution images (1920x1080 or higher)
2. **File Size**: Optimize images (compress to ~200-500KB each)
3. **Aspect Ratio**: Keep consistent aspect ratios for all images
4. **Content**: Use 8-12 pages for optimal experience

### Image Optimization
Use tools like:
- **TinyPNG**: https://tinypng.com/
- **ImageOptim**: https://imageoptim.com/
- **Squoosh**: https://squoosh.app/

### Recommended Image Dimensions
- **Width**: 1200-1920px
- **Height**: 800-1080px
- **Aspect**: 16:9 or 4:3
- **Format**: JPG (photos), PNG (graphics/text)

## Features Comparison: AnyFlip vs PR Auto Custom Brochure

| Feature | AnyFlip | Our Brochure |
|---------|---------|--------------|
| 3D Page Flip | ✅ | ✅ |
| Click Navigation | ✅ | ✅ |
| Dynamic Shadows | ✅ | ✅ |
| Smooth Animation | ✅ | ✅ |
| Page Indicators | ✅ | ✅ |
| Mobile Responsive | ✅ | ✅ |
| Custom Images | 🔒 Pro | ✅ Free |
| No Watermark | 🔒 Pro | ✅ Free |
| Self-Hosted | ❌ | ✅ |
| No Monthly Fee | ❌ | ✅ |

## Troubleshooting

### Images Not Loading
- Check file paths in `brochureData.ts`
- Ensure images are in `/public/images/`
- Check browser console for errors
- Verify image file names match exactly (case-sensitive)

### Canvas Looks Blurry
- Increase canvas resolution in code
- Use higher quality source images
- Check device pixel ratio handling

### Slow Performance
- Reduce number of pages
- Optimize/compress images
- Lower animation speed
- Reduce segment count (change from 20 to 10)

### Page Won't Flip
- Check console for JavaScript errors
- Ensure click event is firing
- Verify isFlipping state isn't stuck
- Check browser compatibility

## Future Enhancements

Possible additions:
- [ ] Keyboard arrow key navigation
- [ ] Swipe gestures for mobile
- [ ] Zoom functionality
- [ ] Fullscreen mode
- [ ] Page thumbnails sidebar
- [ ] Auto-play slideshow mode
- [ ] Sound effects (page flip sound)
- [ ] Analytics tracking
- [ ] Share buttons per page
- [ ] Download PDF option

## Support

For issues or questions:
1. Check browser console for errors
2. Review this guide thoroughly
3. Test in different browsers
4. Contact development team

## Credits

**Inspiration**: AnyFlip.com page-flipping effect
**Technology**: HTML5 Canvas, React, TypeScript, Tailwind CSS
**Built for**: PR Auto Custom automotive showcase

---

**Last Updated**: November 2025
**Version**: 1.0.0

