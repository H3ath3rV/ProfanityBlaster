# Profanity Blaster - macOS App Build Instructions

## Prerequisites

Before building the app, make sure you have the following installed:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

## Build Steps

### 1. Create Project Directory
```bash
mkdir profanity-blaster-macos
cd profanity-blaster-macos
```

### 2. Set Up Project Files
Create the following files in your project directory:

- `package.json` (from the first artifact)
- `main.js` (from the second artifact) 
- `index.html` (from the third artifact)

### 3. Create Assets Directory
```bash
mkdir assets
```

You'll need an app icon. Create or download a 512x512 PNG icon and save it as `assets/icon.png`. You can also create an `.icns` file for better macOS integration.

### 4. Install Dependencies
```bash
npm install
```

This will install Electron and electron-builder as specified in package.json.

### 5. Test the App (Optional)
Before building, you can test the app in development mode:
```bash
npm start
```

This will launch the app in a development window. Press `Cmd+Q` to quit.

### 6. Build the macOS Application
```bash
npm run dist
```

This will create a distributable `.dmg` file in the `dist` folder.

### Alternative: Create App Directory Only
If you just want the app bundle without a DMG:
```bash
npm run pack
```

## Build Output

After successful build, you'll find:

- **dist/Profanity Blaster-1.0.0.dmg** - Installer DMG file
- **dist/mac/Profanity Blaster.app** - The actual macOS application

## Installation

1. Double-click the `.dmg` file
2. Drag "Profanity Blaster" to the Applications folder
3. Launch from Applications or Spotlight

## Troubleshooting

### Permission Issues
If you get permission errors when trying to open the app:
```bash
xattr -cr "/Applications/Profanity Blaster.app"
```

### Code Signing (for Distribution)
If you plan to distribute the app, you'll need to sign it with an Apple Developer certificate. Add this to your `package.json` build configuration:

```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

### Node.js Issues
If you encounter Node.js version issues:
```bash
npm install --legacy-peer-deps
```

## Features

The built macOS app includes:

- **Native macOS Integration**: Menu bar, keyboard shortcuts, drag & drop
- **File Association**: Can be set as default app for media files
- **Retina Display Support**: Crisp graphics on high-DPI displays
- **Auto-updater Ready**: Framework for future updates
- **Sandboxing Compatible**: Can be modified for Mac App Store submission

## Customization

### App Icon
Replace `assets/icon.png` with your custom icon (512x512 pixels recommended).

### App Name
Change the `productName` in `package.json` to customize the displayed app name.

### Bundle ID
Change the `appId` in `package.json` for a unique bundle identifier.

## Advanced Features

The app supports:
- Multi-format media file processing
- Real-time audio analysis simulation
- Customizable filter sensitivity
- Export functionality through native save dialogs
- Drag & drop file handling
- Native macOS notifications

## Performance Notes

- The app uses Electron, so it will use more memory than a native app
- Processing is currently simulated - integrate with actual audio processing libraries for production use
- File sizes are optimized for quick loading and smooth UI animations

## Next Steps

For production use, consider:
1. Integrating real audio processing libraries (FFmpeg, Web Audio API)
2. Adding speech recognition capabilities
3. Implementing cloud-based processing for better performance
4. Adding user authentication and settings sync
5. Submitting to Mac App Store (requires additional setup)

---

**Note**: This build creates a fully functional macOS application that can be distributed and installed like any other Mac app. The current version simulates audio processing - integrate with actual audio processing libraries for real functionality.