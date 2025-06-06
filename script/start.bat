cd ..
cd backend
cd .docker
docker-compose up -d
cd ..

start cmd /k "npm run start:dev"

cd ..
cd frontend

start cmd /k "npm run dev"