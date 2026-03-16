## SETUP
1. clone project 
2. create virtual environment with python
3. in virtual environment, add Flask, mongoDB, python-dotenv, bcrypt
    pip install flask pymongo python-dotenv
4. run app 
    flask --app main run
5. configure .env
    .env file with mongoDB connection URI, example : MONGO_URI=mongodb://localhost:27017/myapp

## Use cases 

Create a new stat : in home, fill the form and submit 
Read all stats : /stats

