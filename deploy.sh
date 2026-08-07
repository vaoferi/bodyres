#!/bin/bash
# Deploy script for BodyRes landing page
# Usage: ./deploy.sh [railway|render|fly|local]

set -e

DEPLOY_MODE=${1:-local}

echo "🚀 Deploying BodyRes..."

case $DEPLOY_MODE in
  railway)
    echo "📦 Deploying to Railway..."
    railway login
    railway init
    railway up
    railway domain
    ;;

  render)
    echo "📦 Deploying to Render..."
    render deploy --service=$(basename $PWD)
    ;;

  fly)
    echo "📦 Deploying to Fly.io..."
    fly launch
    fly deploy
    fly status
    ;;

  local)
    echo "🏠 Building for local preview..."
    docker build -t bodyres:latest .
    docker run -p 3000:3000 --rm bodyres:latest
    ;;

  docker-compose)
    echo "🐳 Starting with docker-compose..."
    docker-compose up -d
    docker-compose logs -f
    ;;

  *)
    echo "Usage: ./deploy.sh [railway|render|fly|local|docker-compose]"
    exit 1
    ;;
esac

echo "✅ Deploy complete!"
