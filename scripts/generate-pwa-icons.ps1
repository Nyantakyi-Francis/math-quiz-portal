param(
  [string]$Source = "public/favicon.png",
  [string]$OutDir = "public/icons",
  [string]$MaskableBackground = "#1e3a8a"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function New-DirectoryIfMissing([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Save-ResizedPng {
  param(
    [System.Drawing.Image]$SourceImage,
    [int]$Size,
    [string]$OutPath
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $bmp.SetResolution(96, 96)

  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($SourceImage, 0, 0, $Size, $Size)

  $g.Dispose()
  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

function Save-MaskablePng {
  param(
    [System.Drawing.Image]$SourceImage,
    [int]$Size,
    [string]$OutPath,
    [System.Drawing.Color]$BackgroundColor
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $bmp.SetResolution(96, 96)

  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $g.Clear($BackgroundColor)

  # Give the artwork safe padding for maskable icons (approx 10% on each side).
  $padding = [Math]::Round($Size * 0.1)
  $innerSize = $Size - (2 * $padding)
  if ($innerSize -le 0) { $innerSize = $Size }

  $g.DrawImage($SourceImage, $padding, $padding, $innerSize, $innerSize)

  $g.Dispose()
  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

New-DirectoryIfMissing $OutDir

if (-not (Test-Path -LiteralPath $Source)) {
  throw "Source icon not found: $Source"
}

$src = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $Source))
try {
  Save-ResizedPng -SourceImage $src -Size 128 -OutPath (Join-Path $OutDir "icon-128.png")
  Save-ResizedPng -SourceImage $src -Size 192 -OutPath (Join-Path $OutDir "icon-192.png")
  Save-ResizedPng -SourceImage $src -Size 256 -OutPath (Join-Path $OutDir "icon-256.png")
  Save-ResizedPng -SourceImage $src -Size 512 -OutPath (Join-Path $OutDir "icon-512.png")
  Save-ResizedPng -SourceImage $src -Size 180 -OutPath (Join-Path $OutDir "apple-touch-icon.png")

  $bg = [System.Drawing.ColorTranslator]::FromHtml($MaskableBackground)
  Save-MaskablePng -SourceImage $src -Size 128 -OutPath (Join-Path $OutDir "maskable-128.png") -BackgroundColor $bg
  Save-MaskablePng -SourceImage $src -Size 192 -OutPath (Join-Path $OutDir "maskable-192.png") -BackgroundColor $bg
  Save-MaskablePng -SourceImage $src -Size 256 -OutPath (Join-Path $OutDir "maskable-256.png") -BackgroundColor $bg
  Save-MaskablePng -SourceImage $src -Size 512 -OutPath (Join-Path $OutDir "maskable-512.png") -BackgroundColor $bg
} finally {
  $src.Dispose()
}

Write-Output "Generated PWA icons in: $OutDir"
