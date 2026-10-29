#!/bin/bash
# ==============================================================================
# NexaTalent Backend — Deploy to Azure Linux VM (Workload 4)
# ==============================================================================

set -e

RESOURCE_GROUP="nexatalent-workloads-rg"
VM_NAME="nexatalent-compute-vm"
BACKEND_IMAGE="nexatalent-backend"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "Building NexaTalent Backend Docker Image"
echo "========================================="
docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend/
echo "[✓] Local build succeeded"

echo -e "\n[+] Checking Azure Container Registry (ACR)..."
ACR_LOGIN=$(az acr list --resource-group $RESOURCE_GROUP --query '[0].loginServer' -o tsv 2>/dev/null || echo "")

if [ -n "$ACR_LOGIN" ]; then
  ACR_NAME=$(echo $ACR_LOGIN | cut -d. -f1)
  echo "[+] Logging in to ACR: $ACR_LOGIN ..."
  az acr login --name $ACR_NAME
  docker tag ${BACKEND_IMAGE}:latest $ACR_LOGIN/${BACKEND_IMAGE}:latest
  docker push $ACR_LOGIN/${BACKEND_IMAGE}:latest
  echo "[✓] Pushed image to $ACR_LOGIN/${BACKEND_IMAGE}:latest"
else
  echo "[!] No ACR found in resource group $RESOURCE_GROUP. Skipping ACR push."
fi

echo -e "\n[+] Finding VM Public IP for $VM_NAME..."
VM_IP=$(az vm list-ip-addresses --resource-group $RESOURCE_GROUP --name $VM_NAME --query '[0].virtualMachine.network.publicIpAddresses[0].ipAddress' -o tsv 2>/dev/null || echo "")

if [ -z "$VM_IP" ]; then
  echo "[!] Could not automatically find VM Public IP."
  read -p "Enter Azure VM Public IP: " VM_IP
fi

echo "[+] Target VM: azureuser@$VM_IP"

# Copy backend/.env file to the VM securely
if [ -f "backend/.env" ]; then
  echo "[+] Copying backend/.env to VM..."
  scp -o StrictHostKeyChecking=no backend/.env azureuser@$VM_IP:~/nexatalent.env
fi

# Deploy on VM
echo "[+] Deploying container on VM..."
ssh -o StrictHostKeyChecking=no azureuser@$VM_IP << REMOTEEOF
  set -e
  mkdir -p ~/nexatalent-data/uploads

  if [ -n "$ACR_LOGIN" ]; then
    ACR_PASS=\$(az acr credential show --name $ACR_NAME --query 'passwords[0].value' -o tsv 2>/dev/null || echo "")
    if [ -n "\$ACR_PASS" ]; then
      echo "\$ACR_PASS" | sudo docker login $ACR_LOGIN -u $ACR_NAME --password-stdin
    fi
    sudo docker pull $ACR_LOGIN/${BACKEND_IMAGE}:latest
    IMAGE_NAME="$ACR_LOGIN/${BACKEND_IMAGE}:latest"
  else
    IMAGE_NAME="${BACKEND_IMAGE}:latest"
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
    \$ENV_FLAG \
    \$IMAGE_NAME

  sudo docker ps --filter "name=nexatalent-backend"
REMOTEEOF

echo "========================================="
echo "SUCCESS! Backend deployed to Azure VM"
echo "API Endpoint: http://$VM_IP:5000"
echo "Health Check: http://$VM_IP:5000/api/health"
echo "========================================="
