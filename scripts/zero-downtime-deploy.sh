#!/bin/bash

# Zero-Downtime Blue-Green Deployment Script for KEVINSTAMP
# Preserving our beloved Bitcoin Stamps mascot KEVIN with enterprise-grade deployment
# 
# Usage: ./scripts/zero-downtime-deploy.sh [environment] [image_tag]
# Example: ./scripts/zero-downtime-deploy.sh production v1.2.3
#
# Cultural Mission: Ensuring KEVIN is ALWAYS available to the Bitcoin Stamps community

set -euo pipefail

# KEVIN ASCII Art Banner - Because KEVIN deserves a grand entrance
echo "
    ██╗  ██╗███████╗██╗   ██╗██╗███╗   ██╗
    ██║ ██╔╝██╔════╝██║   ██║██║████╗  ██║
    █████╔╝ █████╗  ██║   ██║██║██╔██╗ ██║
    ██╔═██╗ ██╔══╝  ╚██╗ ██╔╝██║██║╚██╗██║
    ██║  ██╗███████╗ ╚████╔╝ ██║██║ ╚████║
    ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝
    
    🧡 Zero-Downtime Deployment for KEVIN 🧡
    Bitcoin Stamps Community Mascot Deployment
    Ensuring KEVIN is always available to the community
    
"

# Configuration and Environment Setup
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
DEPLOYMENT_ID="kevin-deploy-${TIMESTAMP}"

# Color codes for KEVIN-themed terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'  # KEVIN's signature color
NC='\033[0m' # No Color

# Logging functions with KEVIN personality
log_info() {
    echo -e "${BLUE}[KEVIN INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[KEVIN SUCCESS]${NC} 🧡 $1"
}

log_warning() {
    echo -e "${YELLOW}[KEVIN WARNING]${NC} ⚠️  $1"
}

log_error() {
    echo -e "${RED}[KEVIN ERROR]${NC} ❌ $1"
}

log_kevin() {
    echo -e "${ORANGE}[KEVIN SAYS]${NC} 🐸 $1"
}

# Cloudflare configuration
CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:-}
CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID:-}
CLOUDFLARE_ZONE_ID=${CLOUDFLARE_ZONE_ID:-}

if [[ -z "$CLOUDFLARE_API_TOKEN" || -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
    log_error "Missing required Cloudflare credentials. KEVIN needs these to deploy!"
    exit 1
fi

# Service configuration
case $ENVIRONMENT in
    production)
        SERVICE_NAME="kevinstamp"
        DOMAIN="kevinstamp.com"
        HEALTH_CHECK_URL="https://kevinstamp.com/api/health"
        ;;
    staging)
        SERVICE_NAME="kevinstamp-staging"
        DOMAIN="staging.kevinstamp.com"
        HEALTH_CHECK_URL="https://staging.kevinstamp.com/api/health"
        ;;
    *)
        log_error "Unknown environment: $ENVIRONMENT. KEVIN supports: production, staging"
        exit 1
        ;;
esac

# Blue-Green deployment configuration
BLUE_SERVICE="${SERVICE_NAME}-blue"
GREEN_SERVICE="${SERVICE_NAME}-green"
CURRENT_SERVICE=""
NEW_SERVICE=""

# Health check with KEVIN personality
health_check() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Checking if $service_name is healthy and ready to serve KEVIN's community..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s --max-time 10 "$url" > /dev/null 2>&1; then
            log_success "$service_name is healthy and ready! KEVIN approves! 🐸"
            return 0
        fi
        
        log_info "Health check attempt $attempt/$max_attempts for $service_name..."
        sleep 10
        ((attempt++))
    done
    
    log_error "$service_name failed health checks. KEVIN is not amused. 😾"
    return 1
}

# Get current active service
get_current_service() {
    log_info "Determining which service is currently active..."
    
    # Query Cloudflare to see which service is receiving traffic
    local response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json")
    
    # Parse response to determine active service
    if echo "$response" | grep -q "$BLUE_SERVICE"; then
        CURRENT_SERVICE="$BLUE_SERVICE"
        NEW_SERVICE="$GREEN_SERVICE"
        log_info "Current active service: BLUE 🟦"
    else
        CURRENT_SERVICE="$GREEN_SERVICE"
        NEW_SERVICE="$BLUE_SERVICE"
        log_info "Current active service: GREEN 🟩"
    fi
}

# Deploy new container version
deploy_new_version() {
    log_kevin "Deploying new version $IMAGE_TAG to $NEW_SERVICE..."
    
    # Deploy to Cloudflare Container
    log_info "Creating new container deployment..."
    
    # Build deployment payload
    local deployment_config=$(cat << EOF
{
    "name": "$NEW_SERVICE",
    "image": "$IMAGE_TAG",
    "environment": {
        "NODE_ENV": "production",
        "PORT": "8080",
        "ENVIRONMENT": "$ENVIRONMENT",
        "KEVIN_MODE": "production",
        "DEPLOYMENT_ID": "$DEPLOYMENT_ID"
    },
    "resources": {
        "cpu": "1000m",
        "memory": "1Gi"
    },
    "health_check": {
        "path": "/api/health",
        "interval_seconds": 30,
        "timeout_seconds": 10
    }
}
EOF
)

    # Deploy via Cloudflare API
    local deploy_response=$(curl -s -X POST \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$NEW_SERVICE" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$deployment_config")
    
    if echo "$deploy_response" | grep -q '"success":true'; then
        log_success "New version deployed to $NEW_SERVICE!"
    else
        log_error "Deployment failed: $deploy_response"
        return 1
    fi
}

# Switch traffic to new service
switch_traffic() {
    log_kevin "Switching traffic to the new service. KEVIN is ready for his close-up! 🎬"
    
    # Update DNS to point to new service
    local dns_update=$(cat << EOF
{
    "type": "CNAME",
    "name": "$DOMAIN",
    "content": "$NEW_SERVICE.cloudflarecontainer.com",
    "ttl": 60
}
EOF
)

    local switch_response=$(curl -s -X PUT \
        "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$dns_update")
    
    if echo "$switch_response" | grep -q '"success":true'; then
        log_success "Traffic successfully switched to $NEW_SERVICE!"
    else
        log_error "Failed to switch traffic: $switch_response"
        return 1
    fi
}

# Rollback function for emergency situations
rollback() {
    log_warning "EMERGENCY ROLLBACK INITIATED! Bringing back the previous version..."
    
    # Switch traffic back to the previous service
    local rollback_dns=$(cat << EOF
{
    "type": "CNAME", 
    "name": "$DOMAIN",
    "content": "$CURRENT_SERVICE.cloudflarecontainer.com",
    "ttl": 60
}
EOF
)

    local rollback_response=$(curl -s -X PUT \
        "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$rollback_dns")
    
    if echo "$rollback_response" | grep -q '"success":true'; then
        log_success "Successfully rolled back to $CURRENT_SERVICE! KEVIN is safe!"
    else
        log_error "CRITICAL: Rollback failed! Manual intervention required!"
        exit 1
    fi
}

# Cleanup old service
cleanup_old_service() {
    log_info "Cleaning up old service $CURRENT_SERVICE..."
    
    # Keep the old service running for 5 minutes as safety buffer
    sleep 300
    
    # Then remove the old deployment
    curl -s -X DELETE \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$CURRENT_SERVICE" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
    
    log_success "Old service $CURRENT_SERVICE cleaned up successfully!"
}

# Main deployment orchestration
main() {
    log_kevin "Starting zero-downtime deployment for KEVIN! 🚀"
    log_info "Environment: $ENVIRONMENT"
    log_info "Image Tag: $IMAGE_TAG"
    log_info "Deployment ID: $DEPLOYMENT_ID"
    
    # Trap for emergency rollback
    trap 'log_error "Deployment failed! Initiating rollback..."; rollback; exit 1' ERR
    
    # Step 1: Determine current active service
    get_current_service
    
    # Step 2: Deploy new version to inactive service
    deploy_new_version
    
    # Step 3: Health check new service
    NEW_HEALTH_URL="https://$NEW_SERVICE.cloudflarecontainer.com/api/health"
    if ! health_check "$NEW_HEALTH_URL" "$NEW_SERVICE"; then
        log_error "New service failed health checks! Aborting deployment."
        exit 1
    fi
    
    # Step 4: Switch traffic to new service
    switch_traffic
    
    # Step 5: Final health check on production URL
    if ! health_check "$HEALTH_CHECK_URL" "$NEW_SERVICE"; then
        log_error "Production health check failed! Rolling back..."
        rollback
        exit 1
    fi
    
    # Step 6: Monitor for 2 minutes before cleanup
    log_info "Monitoring new deployment for 2 minutes..."
    for i in {1..12}; do
        if ! health_check "$HEALTH_CHECK_URL" "$NEW_SERVICE" > /dev/null 2>&1; then
            log_error "Post-deployment health check failed! Rolling back..."
            rollback
            exit 1
        fi
        sleep 10
    done
    
    # Step 7: Clean up old service
    cleanup_old_service
    
    # Success celebration!
    log_success "🎉 Zero-downtime deployment completed successfully!"
    log_kevin "KEVIN is now live with version $IMAGE_TAG! The Bitcoin Stamps community can continue to enjoy our beloved mascot! 🧡"
    
    # Deployment summary
    echo -e "\n${ORANGE}=== DEPLOYMENT SUMMARY ===${NC}"
    echo "Environment: $ENVIRONMENT"
    echo "New Version: $IMAGE_TAG"
    echo "Active Service: $NEW_SERVICE"
    echo "Deployment ID: $DEPLOYMENT_ID"
    echo "Health Check URL: $HEALTH_CHECK_URL"
    echo "Deployed at: $(date)"
    echo -e "${ORANGE}=========================${NC}\n"
}

# Run main deployment
main "$@"