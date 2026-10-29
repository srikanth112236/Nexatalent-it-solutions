# ==============================================================================
# NexaTalent Backend — Deploy to Azure Linux VM (PowerShell for Windows)
# ==============================================================================

param (
    [string]$ResourceGroup = "nexatalent-workloads-rg",
    [string]$VmName = "nexatalent-compute-vm",
    [string]$BackendImage = "nexatalent-backend"
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Building NexaTalent Backend Docker Image" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

docker build -t "${BackendImage}:latest" -f backend/Dockerfile backend/
if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }

Write-Host "`n[+] Checking Azure Container Registry (ACR)..." -ForegroundColor Cyan
$AcrLogin = (az acr list --resource-group $ResourceGroup --query '[0].loginServer' -o tsv 2>$null)

if ($AcrLogin) {
    $AcrName = $AcrLogin.Split('.')[0]
    Write-Host "[+] Logging in to ACR: $AcrLogin ..." -ForegroundColor Cyan
    az acr login --name $AcrName
    docker tag "${BackendImage}:latest" "$AcrLogin/${BackendImage}:latest"
    docker push "$AcrLogin/${BackendImage}:latest"
    Write-Host "[✓] Pushed image to $AcrLogin/${BackendImage}:latest" -ForegroundColor Green
} else {
    Write-Host "[!] No ACR found in $ResourceGroup. Skipping push." -ForegroundColor Yellow
}

Write-Host "`n[+] Finding VM Public IP for $VmName..." -ForegroundColor Cyan
$VmIp = (az vm list-ip-addresses --resource-group $ResourceGroup --name $VmName --query '[0].virtualMachine.network.publicIpAddresses[0].ipAddress' -o tsv 2>$null)

if (-not $VmIp) {
    $VmIp = Read-Host "Enter Azure VM Public IP"
}

Write-Host "[+] Target VM: azureuser@$VmIp" -ForegroundColor Green

if (Test-Path "backend/.env") {
    Write-Host "[+] Copying backend/.env to VM..." -ForegroundColor Cyan
    scp -o StrictHostKeyChecking=no backend/.env "azureuser@${VmIp}:~/nexatalent.env"
}

Write-Host "[+] Deploying container to VM..." -ForegroundColor Cyan

$RemoteScript = @"
  set -e
  mkdir -p ~/nexatalent-data/uploads

  if [ -n "$AcrLogin" ]; then
    ACR_PASS=`$(az acr credential show --name $AcrName --query 'passwords[0].value' -o tsv 2>/dev/null || echo "")
    if [ -n "`$ACR_PASS" ]; then
      echo "`$ACR_PASS" | sudo docker login $AcrLogin -u $AcrName --password-stdin
    fi
    sudo docker pull $AcrLogin/${BackendImage}:latest
    IMAGE_NAME="$AcrLogin/${BackendImage}:latest"
  else
    IMAGE_NAME="${BackendImage}:latest"
  fi

  sudo docker stop nexatalent-backend || true
  sudo docker rm nexatalent-backend || true

  ENV_FLAG=""
  if [ -f ~/nexatalent.env ]; then
    ENV_FLAG="--env-file /home/azureuser/nexatalent.env"
  fi

  sudo docker run -d \
    --name nexatalent-backend \
    -p 5000:5000 \
    --restart unless-stopped \
    -v /home/azureuser/nexatalent-data:/app/data \
    `$ENV_FLAG \
    `$IMAGE_NAME

  sudo docker ps --filter "name=nexatalent-backend"
"@

ssh -o StrictHostKeyChecking=no "azureuser@$VmIp" $RemoteScript

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "SUCCESS! Backend deployed to Azure VM" -ForegroundColor Green
Write-Host "API Endpoint: http://${VmIp}:5000" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
