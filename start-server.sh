#!/bin/bash

echo "Starting development server..."
$env:NODE_ENV="development"
tsx server/index.ts