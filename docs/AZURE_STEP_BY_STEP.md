# ==============================================================================
# NexaTalent — Azure Backend Deployment, Auto-Deploy & Blob Storage Guide
# ==============================================================================

This guide provides complete step-by-step instructions for:
1. **Provisioning Azure Workloads & Virtual Machine** (Compute Workload 4).
2. **Configuring Azure Blob Storage** (Storage Workload 2 for resumes & docs).
3. **Setting Up Production `.env` Variables**.
4. **Enabling Automated CI/CD Deployment on every Git Push via GitHub Actions**.
5. **Connecting Frontend (`VITE_API_BASE_URL`) with Backend**.

---

## Architecture Overview

```mermaid
flowchart LR
    subgraph Client ["Client Browser"]
        FE["Azure Static Web App (Frontend)"]
    end

    subgraph Azure ["Azure Cloud"]
        ACR["Azure Container Registry (ACR)"]
        VM["Azure Linux VM (Docker :5000)"]
        BLOB["Azure Blob Storage ('resumes' container)"]
        DB["PostgreSQL / Persistent JSON Store"]
    end

    subgraph GitHub ["GitHub Repository"]
        REPO["Git Push (main branch)"]
        GHA["GitHub Actions Workflow (deploy.yml)"]
    end

    REPO --> GHA
    GHA -->|Build & Push Image| ACR
    GHA -->|SSH Deploy| VM
    VM -->|Pull Image| ACR
    FE -->|REST API Requests| VM
    VM -->|Upload/Download Resumes| BLOB
    VM -->|Data Persistence| DB
```

---

## Part 1: Provision the Azure Virtual Machine (Workload 4)

You can create the VM either using **Azure Cloud Shell** (recommended) or the **Azure Portal UI**.

### Option A: Azure Cloud Shell / Azure CLI (1-Click)

Open [Azure Cloud Shell](https://shell.azure.com) (Bash) and run:

```bash
# 1. Variables
RESOURCE_GROUP="nexatalent-workloads-rg"
LOCATION="centralindia"
VM_NAME="nexatalent-compute-vm"

# 2. Create Resource Group (if not already created)
az group create --name $RESOURCE_GROUP --location $LOCATION

# 3. Create Ubuntu 22.04 Virtual Machine
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard

# 4. Open Port 5000 (Backend API) and Port 22 (SSH) in the Network Security Group
az vm open-port --resource-group $RESOURCE_GROUP --name $VM_NAME --port 5000 --priority 1001
az vm open-port --resource-group $RESOURCE_GROUP --name $VM_NAME --port 80 --priority 1002
az vm open-port --resource-group $RESOURCE_GROUP --name $VM_NAME --port 443 --priority 1003

# 5. Get the Public IP
az vm list-ip-addresses --resource-group $RESOURCE_GROUP --name $VM_NAME --output table
```

### Option B: Azure Portal (GUI Steps)
1. Go to [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** > **Virtual machine** > **Create**.
3. Fill in the basics:
   - **Resource group**: `nexatalent-workloads-rg`
   - **Virtual machine name**: `nexatalent-compute-vm`
   - **Region**: Central India (or preferred region)
   - **Image**: `Ubuntu Server 22.04 LTS - x64 Gen2`
   - **Size**: `Standard_B1s` (1 vCPU, 1 GiB RAM - eligible for free credits)
   - **Authentication type**: SSH public key (or generate new key pair and download `.pem`)
   - **Username**: `azureuser`
4. Under **Networking**:
   - Inbound ports: Select **SSH (22)**, **HTTP (80)**, **HTTPS (443)**.
5. Click **Review + create** > **Create**.
6. After creation, open the VM page > **Networking** > **Add inbound port rule**:
   - Destination port ranges: `5000`
   - Protocol: `TCP`
   - Action: `Allow`
   - Name: `Port_5000_Backend`
   - Click **Add**.

### Install Docker on the VM
SSH into your VM:
```bash
ssh azureuser@<YOUR_VM_PUBLIC_IP>
```
Run this single command on the VM to install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker azureuser
sudo systemctl enable docker
sudo systemctl start docker
exit
```

---

## Part 2: Set Up Azure Blob Storage (Workload 2)

### 1. Create Storage Account
In Azure Cloud Shell or Portal:
```bash
STORAGE_ACCOUNT="nexatalentstore$RANDOM"
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --allow-blob-public-access true
```

### 2. Create the `resumes` Blob Container
```bash
az storage container create \
  --account-name $STORAGE_ACCOUNT \
  --name resumes \
  --public-access blob
```

### 3. Get the Connection String & Key
```bash
# Get Connection String
az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query connectionString -o tsv

# Get Primary Access Key
az storage account keys list \
  --account-name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query '[0].value' -o tsv
```

> [!TIP]
> In Azure Portal, you can also view this under:
> **Storage Account > Security + networking > Access keys > Connection string**.

---

## Part 3: Create and Use the Environment (`.env`) File

The backend includes a pre-configured `.env` in `backend/.env` and a documented template in `backend/.env.example`.

### Required Production Environment Variables:

```bash
# Server Runtime
PORT=5000
NODE_ENV=production

# Frontend Client URL & CORS (Allow Static Web App & Custom Domain)
CLIENT_URL=https://brave-rock-07c996e0f.azurestaticapps.net
CORS_ORIGINS=https://brave-rock-07c996e0f.azurestaticapps.net,https://salmon-island-078be1a0f.azurestaticapps.net,https://nexatalent-frontend-app.azurewebsites.net,http://localhost:3000,http://localhost:4200

# Security (JWT secrets must be 32+ characters; Webhook 16+ characters)
JWT_SECRET=2399f00e8a8b2be62d46b96dbc04d6a3ed41c4368fcdae5dacfc245ed6150f6e
REFRESH_TOKEN_SECRET=b0cdd703f795963d9d0b2f7d61823a06055755092943cba85ff0e0e04e357ee8
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
PAYMENT_WEBHOOK_SECRET=60456e566ea47d8f1d61bb38fa166e12e4b0acf35ef1f08c
BOOTSTRAP_KEY=fbb16bbd022c323aed756f149726ada69a21d5f8

# Azure Blob Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=<STORAGE_ACCOUNT>;AccountKey=<STORAGE_KEY>;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT=<STORAGE_ACCOUNT>
AZURE_STORAGE_KEY=<STORAGE_KEY>
AZURE_STORAGE_CONTAINER=resumes
```

---

## Part 4: Automated CI/CD on Every Git Push (GitHub Actions)

Every time you `git push` to `main`, GitHub Actions automatically:
1. Builds the backend Docker container.
2. Pushes the image to Azure Container Registry (ACR).
3. Connects to your Azure VM via SSH.
4. Mounts the persistent volume (`/home/azureuser/nexatalent-data:/app/data`).
5. Pulls the latest container and restarts the backend with zero downtime.

### Configure GitHub Repository Secrets
Go to your GitHub repository:
**Settings > Secrets and variables > Actions > New repository secret**

Add the following secrets:

| Secret Name | Example / Value | Description |
|---|---|---|
| `AZURE_CREDENTIALS` | `{"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}` | Azure Service Principal credentials for CLI login |
| `AZURE_REGISTRY` | `nexatalentacr1234.azurecr.io` | ACR Login server |
| `ACR_NAME` | `nexatalentacr1234` | Name of your ACR registry |
| `ACR_USERNAME` | `nexatalentacr1234` | ACR Admin username (from `az acr credential show`) |
| `ACR_PASSWORD` | `<primary_password>` | ACR Admin password |
| `VM_IP` | `20.xxx.xxx.xxx` | Public IP of `nexatalent-compute-vm` |
| `VM_USER` | `azureuser` | SSH username |
| `SSH_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | Private SSH key to access the VM |
| `JWT_SECRET` | `2399f00e8a8b2be62d46b96dbc04d6a3ed41c4368fcdae5dacfc245ed6150f6e` | 32+ char JWT secret |
| `REFRESH_TOKEN_SECRET` | `b0cdd703f795963d9d0b2f7d61823a06055755092943cba85ff0e0e04e357ee8` | 32+ char refresh token secret |
| `PAYMENT_WEBHOOK_SECRET` | `60456e566ea47d8f1d61bb38fa166e12e4b0acf35ef1f08c` | 16+ char webhook secret |
| `BOOTSTRAP_KEY` | `fbb16bbd022c323aed756f149726ada69a21d5f8` | 16+ char bootstrap key |
| `CLIENT_URL` | `https://brave-rock-07c996e0f.azurestaticapps.net` | Frontend URL |
| `CORS_ORIGINS` | `https://brave-rock-07c996e0f.azurestaticapps.net,https://salmon-island-078be1a0f.azurestaticapps.net,https://nexatalent-frontend-app.azurewebsites.net` | Allowed CORS origins |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpointsProtocol=https;...` | Azure Blob connection string |
| `AZURE_STORAGE_CONTAINER` | `resumes` | Blob container name |

### How to Create `AZURE_CREDENTIALS` (Service Principal)
Run in Azure Cloud Shell:
```bash
az ad sp create-for-rbac \
  --name "nexatalent-github-actions" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/nexatalent-workloads-rg \
  --sdk-auth
```
Copy the JSON output directly into the `AZURE_CREDENTIALS` GitHub Secret.

---

## Part 5: Connect Frontend to the Deployed Backend

In your Azure Static Web App:
1. Go to **Azure Portal > Static Web Apps > brave-rock-07c996e0f** (or your Static Web App name).
2. Click **Configuration** (under Settings).
3. Under **Application settings**, click **+ Add**:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `http://<YOUR_VM_PUBLIC_IP>:5000` (or `https://api.yourdomain.com`)
4. Click **Save**.

The frontend will immediately point all authentication, candidate directory, resumes, and enterprise workflows to your Azure backend!

---

## Part 6: How Azure Blob Storage Works in the Backend

The backend code in [blob.ts](file:///c:/Users/USER/Documents/vedasynk-websites/nexatalent/backend/src/storage/blob.ts) provides seamless storage:
- **Resumes & Candidate Applications**: Handled automatically in [extended.ts](file:///c:/Users/USER/Documents/vedasynk-websites/nexatalent/backend/src/routes/extended.ts) and [sales.ts](file:///c:/Users/USER/Documents/vedasynk-websites/nexatalent/backend/src/routes/sales.ts).
- **Zero Loss on Container Restart**: Uploaded files are streamed directly into Azure Blob Storage and cached on disk. If a container restarts or changes servers, the backend downloads the file straight from Azure Blob Storage!

---

## Verification Commands

After deployment, verify the backend from your terminal or browser:

```bash
# Check Health Check Endpoint
curl http://<YOUR_VM_IP>:5000/api/health

# Check Container Status on the VM
ssh azureuser@<YOUR_VM_IP> "sudo docker ps"

# Check Live Container Logs
ssh azureuser@<YOUR_VM_IP> "sudo docker logs -f nexatalent-backend"
```
