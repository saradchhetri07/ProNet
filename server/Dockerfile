# Use the latest Node.js Alpine image
FROM node:20-alpine

#set the current working director
WORKDIR /app

#copy the package.json and package-lock.json files
COPY package*.json ./

#Install dependencies
RUN npm install

#copy the rest of the application code
COPY . .

#Exposing the port my app runs on
EXPOSE 3000

#command to run the app
CMD ["sh", "-c", "npm run migrate && npm start"]