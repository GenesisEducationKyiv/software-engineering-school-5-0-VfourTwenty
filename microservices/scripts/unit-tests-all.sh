#!/bin/bash
set -e
# will add weather later
for service in backend subscription email; do
  echo "Running unit tests in $service..."
  (cd ../apps/$service && npm run test:unit)
done