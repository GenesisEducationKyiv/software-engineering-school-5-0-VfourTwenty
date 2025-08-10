#!/bin/bash
set -e

for service in backend weather subscription notification email; do
  echo "Running unit tests in $service..."
  (cd ../apps/$service && npm run test:unit)
done