#!/usr/bin/env node

/**
 * Pre-deployment build checker
 * Run this before deploying to Vercel to catch issues early
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Checking build configuration...\n')

const checks = {
  passed: [],
  warnings: [],
  errors: [],
}

// Check 1: Node version
try {
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

  if (majorVersion >= 18) {
    checks.passed.push(`✅ Node.js version: ${nodeVersion} (>= 18.0.0)`)
  } else {
    checks.errors.push(`❌ Node.js version: ${nodeVersion} (requires >= 18.0.0)`)
  }
} catch (error) {
  checks.errors.push(`❌ Failed to check Node.js version: ${error.message}`)
}

// Check 2: Package.json exists
try {
  const packagePath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packagePath)) {
    checks.passed.push('✅ package.json found')

    // Check for required scripts
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    if (pkg.scripts && pkg.scripts.build) {
      checks.passed.push('✅ Build script defined')
    } else {
      checks.errors.push('❌ Build script not found in package.json')
    }
  } else {
    checks.errors.push('❌ package.json not found')
  }
} catch (error) {
  checks.errors.push(`❌ Failed to read package.json: ${error.message}`)
}

// Check 3: Next.js config
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js')
  if (fs.existsSync(nextConfigPath)) {
    checks.passed.push('✅ next.config.js found')
  } else {
    checks.warnings.push('⚠️  next.config.js not found (using defaults)')
  }
} catch (error) {
  checks.warnings.push(`⚠️  Failed to check next.config.js: ${error.message}`)
}

// Check 4: Environment variables
try {
  const requiredEnvVars = [
    'NEXT_PUBLIC_APP_VERSION',
    'NEXT_PUBLIC_FORM_VERSION',
    'NEXT_PUBLIC_DEFAULT_LANGUAGE',
  ]

  const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingEnvVars.length === 0) {
    checks.passed.push('✅ All required environment variables set')
  } else {
    checks.warnings.push(`⚠️  Missing env vars (will use defaults): ${missingEnvVars.join(', ')}`)
  }
} catch (error) {
  checks.warnings.push(`⚠️  Failed to check environment variables: ${error.message}`)
}

// Check 5: Dependencies installed
try {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules')
  if (fs.existsSync(nodeModulesPath)) {
    checks.passed.push('✅ node_modules found')
  } else {
    checks.errors.push('❌ node_modules not found - run npm install')
  }
} catch (error) {
  checks.errors.push(`❌ Failed to check node_modules: ${error.message}`)
}

// Check 6: TypeScript config
try {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
  if (fs.existsSync(tsconfigPath)) {
    checks.passed.push('✅ tsconfig.json found')
  } else {
    checks.warnings.push('⚠️  tsconfig.json not found')
  }
} catch (error) {
  checks.warnings.push(`⚠️  Failed to check tsconfig.json: ${error.message}`)
}

// Check 7: Try building
console.log('\n🏗️  Attempting build...\n')
try {
  execSync('npm run build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      NEXT_PUBLIC_FORM_VERSION: process.env.NEXT_PUBLIC_FORM_VERSION || '1.0.0',
      NEXT_PUBLIC_DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'id',
    },
  })
  checks.passed.push('✅ Build successful!')
} catch (error) {
  checks.errors.push('❌ Build failed - check errors above')
}

// Print summary
console.log('\n' + '='.repeat(60))
console.log('📊 BUILD CHECK SUMMARY')
console.log('='.repeat(60) + '\n')

if (checks.passed.length > 0) {
  console.log('✅ PASSED:')
  checks.passed.forEach((msg) => console.log(`   ${msg}`))
  console.log('')
}

if (checks.warnings.length > 0) {
  console.log('⚠️  WARNINGS:')
  checks.warnings.forEach((msg) => console.log(`   ${msg}`))
  console.log('')
}

if (checks.errors.length > 0) {
  console.log('❌ ERRORS:')
  checks.errors.forEach((msg) => console.log(`   ${msg}`))
  console.log('')
}

console.log('='.repeat(60))

if (checks.errors.length > 0) {
  console.log('\n❌ Build check FAILED. Fix errors before deploying.\n')
  process.exit(1)
} else if (checks.warnings.length > 0) {
  console.log('\n⚠️  Build check PASSED with warnings. Review before deploying.\n')
  process.exit(0)
} else {
  console.log('\n✅ Build check PASSED. Ready to deploy!\n')
  process.exit(0)
}
