#!/bin/zsh
set -e	# Exit on error

# Ensure latest build
npm run build

# Commit the build folder if it has changes
git add dist -f
git commit -m "Build for deploy" || echo "No changes to commit"

# Push the dist folder as a subtree to the dist branch
git subtree push --prefix dist origin dist
