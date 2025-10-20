#!/usr/bin/env node

/**
 * Clean build script
 * Removes .next directory and rebuilds the project
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🧹 Cleaning build artifacts...\n')

// Function to remove directory recursively
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      // Try to remove with fs
      fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 3 })
      console.log(`✅ Removed: ${dirPath}`)
      return true
    } catch (error) {
      console.log(`⚠️  Could not remove ${dirPath}: ${error.message}`)

      // Try with system command as fallback
      try {
        if (process.platform === 'win32') {
          execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'ignore' })
        } else {
          execSync(`rm -rf "${dirPath}"`, { stdio: 'ignore' })
        }
        console.log(`✅ Removed (with system command): ${dirPath}`)
        return true
      } catch (cmdError) {
        console.log(`❌ Failed to remove ${dirPath}`)
        return false
      }
    }
  } else {
    console.log(`ℹ️  Not found: ${dirPath}`)
    return true
  }
}

// Directories to clean
const dirsToClean = [
  path.join(process.cwd(), '.next'),
  path.join(process.cwd(), 'out'),
  path.join(process.cwd(), '.turbo'),
]

console.log('Cleaning directories:\n')
dirsToClean.forEach((dir) => {
  removeDir(dir)
})

console.log('\n✅ Clean complete!\n')
console.log('💡 Next steps:')
console.log('   1. Run: npm run dev (for development)')
console.log('   2. Or: npm run build (for production build)\n')
