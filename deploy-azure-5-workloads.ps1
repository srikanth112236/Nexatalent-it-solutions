# ==============================================================================
# Microsoft for Startups Founders Hub - 5 Active Azure Workloads Setup Script
# Unlocks Tier Acceleration (Up to $25,000 Azure Credits)
# ==============================================================================

$ResourceGroup = "nexatalent-workloads-rg"
$Location = "centralindia"
$AppServicePlan = "nexatalent-app-plan"
$WebAppName = "nexatalent-frontend-app"
$StorageAccountName = "nexatalentstore$(Get-Random -Minimum 1000 -Maximum 9999)"
$ContainerRegistryName = "nexatalentacr$(Get-Random -Minimum 1000 -Maximum 9999)"
$VmName = "nexatalent-compute-vm"
$DbServerName = "nexatalent-pg-db-$(Get-Random -Minimum 1000 -Maximum 9999)"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Starting Deployment of 5 Active Azure Workloads" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# 1. Login check
az account show --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "Logging into Azure..." -ForegroundColor Yellow
    az login
}

# Create Resource Group
Write-Host "`n[+] Creating Resource Group: $ResourceGroup in $Location..." -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location

# ------------------------------------------------------------------------------
# WORKLOAD 1: Azure App Service (Frontend Host Workload)
# ------------------------------------------------------------------------------
Write-Host "`n[1/5] Deploying Workload 1: Azure App Service (Linux B1 Plan)..." -ForegroundColor Yellow
az appservice plan create --name $AppServicePlan --resource-group $ResourceGroup --location $Location --sku B1 --is-linux
az webapp create --name $WebAppName --resource-group $ResourceGroup --plan $AppServicePlan --runtime "NODE:20-lts"
# Set Startup command for Vite SPA
az webapp config set --resource-group $ResourceGroup --name $WebAppName --startup-file "npx serve -s site -l 8080"
Write-Host "[✓] Workload 1 Deployed: $WebAppName.azurewebsites.net" -ForegroundColor Green

# ------------------------------------------------------------------------------
# WORKLOAD 2: Azure Storage Account (Blob Storage Workload)
# ------------------------------------------------------------------------------
Write-Host "`n[2/5] Deploying Workload 2: Azure Blob Storage Account..." -ForegroundColor Yellow
az storage account create --name $StorageAccountName --resource-group $ResourceGroup --location $Location --sku Standard_LRS --kind StorageV2
az storage container create --name "resumes" --account-name $StorageAccountName --public-access blob
Write-Host "[✓] Workload 2 Deployed: Storage Account $StorageAccountName" -ForegroundColor Green

# ------------------------------------------------------------------------------
# WORKLOAD 3: Azure Container Registry (ACR Workload)
# ------------------------------------------------------------------------------
Write-Host "`n[3/5] Deploying Workload 3: Azure Container Registry..." -ForegroundColor Yellow
az acr create --name $ContainerRegistryName --resource-group $ResourceGroup --sku Basic --admin-enabled true
Write-Host "[✓] Workload 3 Deployed: Container Registry $ContainerRegistryName.azurecr.io" -ForegroundColor Green

# ------------------------------------------------------------------------------
# WORKLOAD 4: Azure Linux Virtual Machine (Compute Workload)
# ------------------------------------------------------------------------------
Write-Host "`n[4/5] Deploying Workload 4: Azure Linux Compute VM (Standard_B1s)..." -ForegroundColor Yellow
az vm create `
  --resource-group $ResourceGroup `
  --name $VmName `
  --image Ubuntu2204 `
  --size Standard_B1s `
  --admin-username azureuser `
  --generate-ssh-keys `
  --public-ip-sku Standard
Write-Host "[✓] Workload 4 Deployed: Linux Compute VM $VmName" -ForegroundColor Green

# ------------------------------------------------------------------------------
# WORKLOAD 5: Azure Database for PostgreSQL (Database Workload)
# ------------------------------------------------------------------------------
Write-Host "`n[5/5] Deploying Workload 5: Azure PostgreSQL Flexible Server..." -ForegroundColor Yellow
az postgres flexible-server create `
  --resource-group $ResourceGroup `
  --name $DbServerName `
  --location $Location `
  --admin-user nexadmin `
  --admin-password "NexaTalentSecure2026!" `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --public-access All
Write-Host "[✓] Workload 5 Deployed: PostgreSQL Database Server $DbServerName" -ForegroundColor Green

# ------------------------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------------------------
Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "SUCCESS! All 5 Active Azure Workloads are Deployed & Active" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroup"
Write-Host "Workload 1 (App Service): $WebAppName.azurewebsites.net"
Write-Host "Workload 2 (Storage): $StorageAccountName"
Write-Host "Workload 3 (Container Registry): $ContainerRegistryName"
Write-Host "Workload 4 (Compute VM): $VmName"
Write-Host "Workload 5 (PostgreSQL Database): $DbServerName"
Write-Host "`nKeep all 5 workloads active for 60 days to qualify for the $25,000 Founders Hub Credit Upgrade!" -ForegroundColor Yellow
