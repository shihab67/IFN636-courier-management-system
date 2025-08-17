## IFN636 Assignment 1
### Courier Management System

**Technologies used**
Backend: node.js
Frontend: react.js
Database: MongoDB

**Types of users**
 1. Customer
 2. Courier
 3. Admin

### How to setup the project:

 1.Clone the project. There are two branches. main and dev-v1.0.x. Checkout to dev-v1.0.x branch and fetch
 2. Go to the backend folder and create a .env file. copy contents from .env.example.
 3. Go to the frontend folder and create a .env file and copy everything from .env.example file.
 4. Create a database in Mongodb then get the connection URL and put it in backend .env file. 
 5. Whitelist your IP in security to access the database.
 6. Run `npm install` in the backend
 7. Run `npm install` in the frontend
 8. Run `npm run seed` to seed dummy data into the database.
 9. Then in the project root run npm run `npm run dev`
 10. Visit [http://localhost:3000](http:localhost:3000) to view the site.
 11. [http://localhost:8000](http:localhost:8000) is the backend route.

**Postman Collection**

[https://crimson-sunset-9367-1.postman.co/workspace/My-Workspace~ce781ff7-23f1-4bed-8ff5-9894be6aa115/collection/10879134-89941938-d525-46fd-baee-abd703dd03c6?action=share&creator=10879134](https://crimson-sunset-9367-1.postman.co/workspace/My-Workspace~ce781ff7-23f1-4bed-8ff5-9894be6aa115/collection/10879134-89941938-d525-46fd-baee-abd703dd03c6?action=share&creator=10879134)
### Sample Data
 **User credentials and roles**
|Sl.|Email|Password|Role
|--|--|--|--|
|1.|admin@gmail.com  |adminpass  |Admin
|2.|customer1@gmail.com  |adminpass  |Customer
|3.|courier1@gmail.com  |adminpass  |Courier
