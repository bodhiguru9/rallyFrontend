# Fonts Setup

This project uses Google Fonts. Please download the following fonts and place them in this directory:

## Roboto (Primary Font)
Download from: https://fonts.google.com/specimen/Roboto
Required weights:
- Roboto-Regular.ttf (400)
- Roboto-Medium.ttf (500)
- Roboto-Bold.ttf (700)

## Noto Sans (Secondary Font)
Download from: https://fonts.google.com/specimen/Noto+Sans
Required weights:
- NotoSans-Regular.ttf (400)
- NotoSans-Medium.ttf (500)
- NotoSans-SemiBold.ttf (600)
- NotoSans-Bold.ttf (700)

## Quick Download Commands

You can use these curl commands to download the fonts directly:

```bash
# Navigate to the fonts directory
cd assets/fonts

# Download Roboto
curl -L -o Roboto-Regular.ttf "https://github.com/google/roboto/releases/download/v2.138/roboto-unhinted.zip" && unzip -j roboto-unhinted.zip "roboto-unhinted/Roboto-Regular.ttf" && rm roboto-unhinted.zip

# Download Noto Sans
curl -L -o NotoSans.zip "https://fonts.google.com/download?family=Noto%20Sans" && unzip NotoSans.zip && rm NotoSans.zip
```

Or simply visit the Google Fonts website and download them manually.
