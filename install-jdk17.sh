#!/bin/bash
# Script to install JDK 17 and configure it for Android development

set -e

echo "🚀 Installing JDK 17 for Android development..."
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it from https://brew.sh"
    exit 1
fi

echo "✅ Homebrew found"
echo ""

# Install OpenJDK 17
echo "📦 Installing OpenJDK 17..."
brew install openjdk@17

echo ""
echo "🔗 Creating symbolic link for system-wide access..."
sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

echo ""
echo "🔧 Configuring JAVA_HOME..."

# Determine the shell config file
if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
else
    SHELL_CONFIG="$HOME/.zshrc"
    touch "$SHELL_CONFIG"
fi

# Add Java configuration to shell config
echo "" >> "$SHELL_CONFIG"
echo "# Java 17 configuration for Android development" >> "$SHELL_CONFIG"
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> "$SHELL_CONFIG"
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> "$SHELL_CONFIG"

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Close this terminal and open a new one (or run: source $SHELL_CONFIG)"
echo "2. Verify installation with: java -version"
echo "3. Check JAVA_HOME with: echo \$JAVA_HOME"
echo "4. Build your app with: cd android && ./gradlew assembleRelease"
echo ""
echo "Current Java installations:"
/usr/libexec/java_home -V 2>&1
