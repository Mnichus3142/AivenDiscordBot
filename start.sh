#!/bin/bash
nohup npx tsx ./aivenChecker/index.ts > aivenChecker.log 2>&1 &
nohup npx tsx ./worker/index.ts > worker.log 2>&1 &
