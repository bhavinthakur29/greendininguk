@echo off
echo Starting Green Dining Application...

echo Starting server...
start cmd /k "title Green Dining Server && bun run server"

echo Starting frontend...
start cmd /k "title Green Dining Frontend && bun run dev"

echo Green Dining application started. You can access it at:
echo Frontend: http://localhost:5173
echo API: http://localhost:3001/api 