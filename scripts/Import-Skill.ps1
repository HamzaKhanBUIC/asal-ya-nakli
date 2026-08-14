param (
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl,
    [string]$SkillName
)

Write-Host "=========================================="
Write-Host " AI EMPIRE - GLOBAL SKILL IMPORTER"
Write-Host "=========================================="

$skillsLibPath = "C:\Users\Hamza Imran\.agents\skills"

if (-not (Test-Path $skillsLibPath)) {
    New-Item -ItemType Directory -Path $skillsLibPath -Force | Out-Null
}

if (-not $SkillName) {
    $SkillName = ($RepoUrl -split '/')[-1].Replace(".git","")
}

$targetPath = Join-Path $skillsLibPath $SkillName

if (Test-Path $targetPath) {
    Write-Warning "Skill '$SkillName' already exists in the library. Overwriting..."
    Remove-Item -Recurse -Force $targetPath
}

Write-Host "Downloading skill from $RepoUrl into $targetPath..."
git clone $RepoUrl $targetPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success! Skill '$SkillName' is now globally available to all AI agents." -ForegroundColor Green
} else {
    Write-Error "Failed to download the skill."
}
