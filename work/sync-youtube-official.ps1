$ErrorActionPreference = "Stop"
$env:PYTHONPATH = Join-Path $PSScriptRoot "yt-dlp"
$python = "python"
$outputDir = Join-Path $PSScriptRoot "youtube-official"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$categories = @(
  @{ id = "official"; title = "OFFICIAL"; zh = "官方影像"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWje6mTDcL8Yz3yQoKiHZTJhv" },
  @{ id = "unknown-planet"; title = "이 별로부터"; zh = "从那颗星"; url = "https://www.youtube.com/playlist?list=PLcvvkF9wk-hs" },
  @{ id = "iu-clip"; title = "IU CLIP"; zh = "IU 短片"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjfqBvakt9CaKDuYnjlBl8Kt" },
  @{ id = "iu-tv"; title = "IU TV"; zh = "IU TV"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjeZqunx7WlGOwcJgNIVSTTj" },
  @{ id = "iu-palette"; title = "아이유의 팔레트"; zh = "IU's Palette"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjehA7vhdz3eZW9oFVstpkTL" },
  @{ id = "palette-pieces"; title = "팔레트 조각집"; zh = "Palette 片段集"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjcakpbHXzej5KUYm-DH8vWk" },
  @{ id = "mini-palette"; title = "미니 팔레트"; zh = "Mini Palette"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjcqe-oZvNaeToPg0UTPodSf" },
  @{ id = "iu-on-air"; title = "IU On Air"; zh = "IU On Air"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjc3osuw9MYWOVA0rIkIIf1F" },
  @{ id = "mv"; title = "M/V"; zh = "官方 MV"; url = "https://www.youtube.com/playlist?list=PLGhOCcpfhWjenR_5jrOkGhdNILM1_oY9L" },
  @{ id = "shorts"; title = "Shorts"; zh = "官方 Shorts"; url = "https://www.youtube.com/@dlwlrma/shorts" }
)

foreach ($category in $categories) {
  $target = Join-Path $outputDir ($category.id + ".json")
  Write-Host "Fetching $($category.title)..."
  & $python -m yt_dlp --flat-playlist --dump-single-json --skip-download --no-warnings $category.url |
    Set-Content -Encoding utf8 $target
}

$categories | ConvertTo-Json -Depth 4 | Set-Content -Encoding utf8 (Join-Path $outputDir "categories.json")
