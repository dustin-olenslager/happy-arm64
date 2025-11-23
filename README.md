# happy-arm64

Windows ARM64 installer and fixes for [happy-coder](https://github.com/slopus/happy-cli) CLI.

## Problem

The `happy-coder` CLI tool fails to build on Windows ARM64 due to Rollup bundler issues. This repository provides a complete solution that:

1. Patches the ARM64 detection in `unpack-tools.cjs`
2. Downloads ARM64 Windows binaries for ripgrep and difftastic
3. Falls back to running from source using `tsx` if the build fails
4. Fixes BOM (Byte Order Mark) encoding issues that cause Node.js parsing errors
5. Uses the correct `tsx.cmd` command on Windows

## Quick Start

1. Download `install-happy-arm64.ps1`
2. Run it in PowerShell:
   ```powershell
   .\install-happy-arm64.ps1
   ```
3. Follow the prompts - it does everything automatically!

## What Gets Fixed

### 1. BOM Encoding Issue
The wrapper file is written without UTF-8 BOM to prevent Node.js parsing errors:
```javascript
// Fixed: Uses UTF8Encoding with $false to prevent BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($WrapperPath, $WrapperContent, $utf8NoBom)
```

### 2. Windows tsx Command
The wrapper correctly uses `tsx.cmd` on Windows:
```javascript
// Fixed: Detects Windows and uses tsx.cmd
const tsxCommand = os.platform() === 'win32' ? 'tsx.cmd' : 'tsx';
```

### 3. ARM64 Binary Support
Downloads and packages ARM64 Windows binaries for:
- ripgrep (15.1.0)
- difftastic (0.67.0)

## Files

- `install-happy-arm64.ps1` - Complete installer script
- `happy-wrapper.cjs` - Template wrapper file (install script generates the actual one)

## How It Works

1. **Clones** the happy-cli repository
2. **Patches** `scripts/unpack-tools.cjs` to detect ARM64 Windows
3. **Downloads** ARM64 Windows binaries
4. **Packages** binaries into the correct format
5. **Attempts** to build the package
6. **Falls back** to source execution if build fails:
   - Installs `tsx` globally
   - Creates `happy-wrapper.cjs` without BOM
   - Updates `package.json` to use the wrapper
7. **Links** the package globally via `npm link`

## Troubleshooting

### "SyntaxError: Invalid or unexpected token"
This was caused by a UTF-8 BOM in the wrapper file. The fixed installer writes files without BOM.

### "Error: spawn tsx ENOENT"
This was caused by using `tsx` instead of `tsx.cmd` on Windows. The fixed wrapper detects Windows and uses the correct command.

## License

Same as happy-cli (MIT)

