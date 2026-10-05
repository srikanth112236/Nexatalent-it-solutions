#!/bin/bash
# ==============================================================================
# Microsoft for Startups Founders Hub - 5 Active Azure Workloads Setup Script
# Unlocks Tier Acceleration (Up to $25,000 Azure Credits)
# ==============================================================================

RESOURCE_GROUP="nexatalent-workloads-rg"
LOCATION="centralindia"
APP_PLAN="nexatalent-app-plan"
WEB_APP="nexatalent-frontend-app"
RAND=$RANDOM
STORAGE_ACC="nexatalentstore$RAND"
ACR_NAME="nexatalentacr$RAND"
VM_NAME="nexatalent-compute-vm"
DB_SERVER="nexatalent-pg-db-$RAND"

echo "========================================="
echo "Starting Deployment of 5 Active Azure Workloads"
echo "========================================="

# 1. Login check
az account show --output none || az login

# Create Resource Group
echo -e "\n[+] Creating Resource Group: $RESOURCE_GROUP in $LOCATION..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# ------------------------------------------------------------------------------
# WORKLOAD 1: Azure App Service (Frontend Host Workload)
# ------------------------------------------------------------------------------
echo -e "\n[1/5] Deploying Workload 1: Azure App Service (Linux B1 Plan)..."
az appservice plan create --name $APP_PLAN --resource-group $RESOURCE_GROUP --location $LOCATION --sku B1 --is-linux
az webapp create --name $WEB_APP --resource-group $RESOURCE_GROUP --plan $APP_PLAN --runtime "NODE:20-lts"
az webapp config set --resource-group $RESOURCE_GROUP --name $WEB_APP --startup-file "npx serve -s site -l 8080"
echo "[✓] Workload 1 Deployed: $WEB_APP.azurewebsites.net"

# ------------------------------------------------------------------------------
# WORKLOAD 2: Azure Storage Account (Blob Storage Workload)
# ------------------------------------------------------------------------------
echo -e "\n[2/5] Deploying Workload 2: Azure Blob Storage Account..."
az storage account create --name $STORAGE_ACC --resource-group $RESOURCE_GROUP --location $LOCATION --sku Standard_LRS --kind StorageV2
az storage container create --name "resumes" --account-name $STORAGE_ACC --public-access blob
echo "[✓] Workload 2 Deployed: Storage Account $STORAGE_ACC"

# ------------------------------------------------------------------------------
# WORKLOAD 3: Azure Container Registry (ACR Workload)
# ------------------------------------------------------------------------------
echo -e "\n[3/5] Deploying Workload 3: Azure Container Registry..."
az acr create --name $ACR_NAME --resource-group $RESOURCE_GROUP --sku Basic --admin-enabled true
echo "[✓] Workload 3 Deployed: Container Registry $ACR_NAME.azurecr.io"

# ------------------------------------------------------------------------------
# WORKLOAD 4: Azure Linux Virtual Machine (Compute Workload)
# ------------------------------------------------------------------------------
echo -e "\n[4/5] Deploying Workload 4: Azure Linux Compute VM (Standard_B1s)..."
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard
echo "[✓] Workload 4 Deployed: Linux Compute VM $VM_NAME"

# ------------------------------------------------------------------------------
# WORKLOAD 5: Azure Database for PostgreSQL (Database Workload)
# ------------------------------------------------------------------------------
echo -e "\n[5/5] Deploying Workload 5: Azure PostgreSQL Flexible Server..."
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --location $LOCATION \
  --admin-user nexadmin \
  --admin-password "NexaTalentSecure2026!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access All
echo "[✓] Workload 5 Deployed: PostgreSQL Database Server $DB_SERVER"

echo "========================================="
echo "SUCCESS! All 5 Active Azure Workloads are Deployed & Active"
echo "========================================="
