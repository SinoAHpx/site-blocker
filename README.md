# Website Blocker Chrome Extension

A simple Chrome extension that allows you to block access to specified websites.

## Features

- Block any website by domain name
- Easy-to-use popup interface
- Persistent storage of blocked sites
- Clean blocking page with a professional look
- Responsive design with TailwindCSS

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter the domain name you want to block (e.g., "facebook.com")
3. Click "Add" or press Enter
4. The website will be added to your blocked list
5. To remove a blocked website, click the "×" button next to it

## Note

- Enter domain names without "http://" or "www" (e.g., "facebook.com")
- The extension will block all subdomains of the blocked domain
- You'll need to add icons to the `icons` directory before publishing:
  - icon16.png (16x16)
  - icon48.png (48x48)
  - icon128.png (128x128)

## Development

The extension is built using:
- HTML5
- TailwindCSS for styling
- Vanilla JavaScript
- Chrome Extension Manifest V3

## License

MIT License 