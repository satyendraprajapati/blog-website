// Free, offline text-to-speech CLI. No API key, no network calls at runtime.
// Uses whichever engine is available on the machine:
//   - macOS: built-in `say`
//   - Linux: `espeak-ng` (install: sudo apt install espeak-ng)
//
// Usage:
//   node scripts/text-to-speech.js --text "Hello world" --out hello.wav
//   node scripts/text-to-speech.js --file content/posts/my-first-post.md --out post.wav
//   node scripts/text-to-speech.js --file notes.txt --out notes.wav --voice en-us --speed 160

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'

function parseArgs(argv) {
  const args = { voice: 'en-us', speed: '170', out: 'output.wav' }
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    if (flag === '--text') args.text = argv[++i]
    else if (flag === '--file') args.file = argv[++i]
    else if (flag === '--out') args.out = argv[++i]
    else if (flag === '--voice') args.voice = argv[++i]
    else if (flag === '--speed') args.speed = argv[++i]
  }
  return args
}

function loadText({ text, file }) {
  if (text) return text
  if (!file) {
    console.error('Provide either --text "..." or --file <path>')
    process.exit(1)
  }
  const raw = fs.readFileSync(path.resolve(file), 'utf-8')
  if (file.endsWith('.md')) {
    const { content } = matter(raw)
    return content
      .replace(/```[\s\S]*?```/g, '') // drop code blocks
      .replace(/!\[[^\]]*]\([^)]*\)/g, '') // drop images
      .replace(/\[([^\]]+)]\([^)]*\)/g, '$1') // links -> plain text
      .replace(/[#*_>`]/g, '') // strip markdown punctuation
      .trim()
  }
  return raw
}

function detectEngine() {
  const candidates = [
    { bin: 'espeak-ng', platform: 'linux' },
    { bin: 'espeak', platform: 'linux' },
    { bin: 'say', platform: 'darwin' },
  ]
  for (const candidate of candidates) {
    try {
      execFileSync('which', [candidate.bin], { stdio: 'ignore' })
      return candidate.bin
    } catch {
      // not installed, try next
    }
  }
  return null
}

function synthesize(engine, text, args) {
  const outPath = path.resolve(args.out)

  if (engine === 'espeak-ng' || engine === 'espeak') {
    execFileSync(engine, ['-v', args.voice, '-s', args.speed, '-w', outPath, text], {
      stdio: 'inherit',
    })
    return
  }

  if (engine === 'say') {
    // macOS `say` writes AIFF unless told otherwise; force the requested extension via afconvert.
    const aiffPath = outPath.replace(/\.\w+$/, '.aiff')
    execFileSync('say', ['-o', aiffPath, text], { stdio: 'inherit' })
    if (aiffPath !== outPath) {
      execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16', aiffPath, outPath], {
        stdio: 'inherit',
      })
      fs.unlinkSync(aiffPath)
    }
  }
}

const args = parseArgs(process.argv.slice(2))
const text = loadText(args)

if (!text || !text.trim()) {
  console.error('No text to speak.')
  process.exit(1)
}

const engine = detectEngine()
if (!engine) {
  console.error(
    [
      'No TTS engine found on this machine.',
      'Install one (free, no API key):',
      '  Linux (Debian/Ubuntu): sudo apt install espeak-ng',
      '  macOS: `say` is built in, nothing to install',
      '  Windows: install espeak-ng from https://github.com/espeak-ng/espeak-ng/releases',
    ].join('\n')
  )
  process.exit(1)
}

synthesize(engine, text, args)
console.log(`Wrote audio to ${args.out} (engine: ${engine})`)
