#!/bin/bash

echo "📄 Tailing logs for all services. Press Ctrl+C to exit."
echo "----------------------------------------------------"
docker-compose logs -f "$@"