#!/bin/bash
# Quick script to build Android APK with proper Java setup

set -e

echo "🔍 Checking Java installations..."

# Try to find Java 17 or higher
JAVA_17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || echo "")

if [ -z "$JAVA_17_HOME" ]; then
    echo "❌ Java 17 not found!"
    echo ""
    echo "Please install Java 17 first:"
    echo "  ./install-jdk17.sh"
    echo ""
    echo "Or manually install with:"
    echo "  brew install openjdk@17"
    echo "  sudo ln -sfn \$(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk"
    exit 1
fi

echo "✅ Found Java 17 at: $JAVA_17_HOME"
echo ""

# Set JAVA_HOME for this build
export JAVA_HOME="$JAVA_17_HOME"
export PATH="$JAVA_HOME/bin:$PATH"

echo "🔨 Building Android Release APK..."
echo ""

cd android
./gradlew clean assembleRelease

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 APK location:"
echo "  $(pwd)/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "📱 To install on a connected device:"
echo "  adb install app/build/outputs/apk/release/app-release.apk"
