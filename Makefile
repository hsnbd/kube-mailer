# Kube-Mailer Makefile
# Manages Docker builds and deployments for all microservices

# Default target
.PHONY: help
help: ## Show this help message
	@echo "Kube-Mailer Management Commands"
	@echo "================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Production Build commands (for Kubernetes deployment)
.PHONY: build
build: build-prod ## Build production images (alias for build-prod)

.PHONY: build-prod
build-prod: ## Build all production Docker images for Kubernetes
	@echo "🏗️  Building production images for Kubernetes deployment..."
	@echo "Building mail-ui production image..."
	docker build -t kube-mailer/mail-ui:latest -t kube-mailer/mail-ui:$(shell date +%Y%m%d-%H%M%S) ./services/mail-ui
	@echo "Building primary-server production image..."
	docker build -t kube-mailer/primary-server:latest -t kube-mailer/primary-server:$(shell date +%Y%m%d-%H%M%S) ./services/primary-server
	@echo "Building decorator-server production image..."
	docker build -t kube-mailer/decorator-server:latest -t kube-mailer/decorator-server:$(shell date +%Y%m%d-%H%M%S) ./services/decorator-server
	@echo "Building worker production image..."
	docker build -t kube-mailer/worker:latest -t kube-mailer/worker:$(shell date +%Y%m%d-%H%M%S) ./services/worker
	@echo "✅ All production images built successfully!"

.PHONY: build-prod-no-cache
build-prod-no-cache: ## Build all production images without cache
	@echo "🏗️  Building production images without cache..."
	docker build --no-cache -t kube-mailer/mail-ui:latest ./services/mail-ui
	docker build --no-cache -t kube-mailer/primary-server:latest ./services/primary-server
	docker build --no-cache -t kube-mailer/decorator-server:latest ./services/decorator-server
	docker build --no-cache -t kube-mailer/worker:latest ./services/worker
	@echo "✅ All production images built successfully!"

# Docker registry commands (for Kubernetes)
.PHONY: push
push: build-prod ## Build and push production images to registry
	@echo "📤 Pushing images to registry..."
	@echo "Note: Configure your Docker registry first (docker login)"
	docker push kube-mailer/mail-ui:latest
	docker push kube-mailer/primary-server:latest
	docker push kube-mailer/decorator-server:latest
	docker push kube-mailer/worker:latest
	@echo "✅ All images pushed successfully!"

.PHONY: tag-and-push
tag-and-push: ## Tag with custom version and push
	@read -p "Enter version tag (e.g., v1.0.0): " version; \
	echo "🏷️  Tagging with version: $$version"; \
	docker tag kube-mailer/mail-ui:latest kube-mailer/mail-ui:$$version; \
	docker tag kube-mailer/primary-server:latest kube-mailer/primary-server:$$version; \
	docker tag kube-mailer/decorator-server:latest kube-mailer/decorator-server:$$version; \
	docker tag kube-mailer/worker:latest kube-mailer/worker:$$version; \
	echo "📤 Pushing tagged images..."; \
	docker push kube-mailer/mail-ui:$$version; \
	docker push kube-mailer/primary-server:$$version; \
	docker push kube-mailer/decorator-server:$$version; \
	docker push kube-mailer/worker:$$version; \
	echo "✅ Tagged images pushed successfully!"

# Cleanup commands
.PHONY: clean-dev
clean-dev: ## Remove development containers, networks, and volumes
	@echo "Cleaning up development environment..."
	docker compose down -v --remove-orphans

.PHONY: clean-prod-images
clean-prod-images: ## Remove production images
	@echo "Removing production images..."
	docker rmi kube-mailer/mail-ui:latest || true
	docker rmi kube-mailer/primary-server:latest || true
	docker rmi kube-mailer/decorator-server:latest || true
	docker rmi kube-mailer/worker:latest || true

.PHONY: clean-all-images
clean-all-images: ## Remove all kube-mailer images
	@echo "Removing all kube-mailer images..."
	docker images | grep kube-mailer | awk '{print $$1":"$$2}' | xargs -r docker rmi -f

.PHONY: health-dev
health-dev: ## Check health of development services
	@echo "Development Health Check:"
	@echo "========================="
	@echo "Primary Server:"
	@curl -s http://localhost:3001/health | jq . || echo "❌ Primary server not responding"
	@echo "\nDecorator Server:"
	@curl -s http://localhost:3002/health | jq . || echo "❌ Decorator server not responding"
	@echo "\nWorker:"
	@curl -s http://localhost:3003/health | jq . || echo "❌ Worker not responding"

# Install commands
.PHONY: install
install: ## Install npm dependencies for all services
	@echo "Installing dependencies for all services..."
	@cd services/mail-ui && npm install
	@cd services/primary-server && npm install
	@cd services/decorator-server && npm install
	@cd services/worker && npm install
	@echo "✅ All dependencies installed"
