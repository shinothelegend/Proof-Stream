$ErrorActionPreference = 'Stop'
Write-Host "Fetching latest Foundry release info from GitHub..."
$url = 'https://api.github.com/repos/foundry-rs/foundry/releases/latest'
$response = Invoke-RestMethod -Uri $url -Headers @{ "User-Agent" = "PowerShell" }
$asset = $response.assets | Where-Object { $_.name -like '*win32_amd64.zip' -or $_.name -like '*win32_amd64.tar.gz' } | Select-Object -First 1

if (-not $asset) {
    Write-Host "Falling back to nightly release..."
    $url = 'https://api.github.com/repos/foundry-rs/foundry/releases/tags/nightly'
    $response = Invoke-RestMethod -Uri $url -Headers @{ "User-Agent" = "PowerShell" }
    $asset = $response.assets | Where-Object { $_.name -like '*win32_amd64.zip' -or $_.name -like '*win32_amd64.tar.gz' } | Select-Object -First 1
}

Write-Host "Found asset: $($asset.name) from $($asset.browser_download_url)"
$destDir = "$env:USERPROFILE\.foundry\bin"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$archivePath = "$destDir\$($asset.name)"
Write-Host "Downloading to $archivePath..."
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $archivePath

Write-Host "Extracting archive..."
if ($asset.name -like '*.zip') {
    Expand-Archive -Path $archivePath -DestinationPath $destDir -Force
} elseif ($asset.name -like '*.tar.gz') {
    tar -xzf $archivePath -C $destDir
}

Write-Host "Verifying forge.exe..."
if (Test-Path "$destDir\forge.exe") {
    Write-Host "✅ Foundry installed successfully at $destDir\forge.exe"
    & "$destDir\forge.exe" --version
} else {
    Write-Host "❌ forge.exe not found after extraction in $destDir"
    Get-ChildItem $destDir
}
