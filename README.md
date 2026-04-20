## SETUP
1. Clone project 
2. Create virtual environment with python
3. In virtual environment, add modules
    `.venv/Scripts/Activate`    
    `pip install flask pymongo python-dotenv bcrypt`
4. configure environment file
    .env file with mongoDB connection URI and secret_key, example : 
    `
    MONGO_URI=mongodb://localhost:27017/myapp    
    SECRET_KEY=secret-key
    `
5. install mongoDB community server
6. run app (--debug for autoreload on code change)
    `flask --app main --debug run`

## Use cases 

- Create account
- Login
- Logout
- Create a new stat : in home, fill the form and submit 
- Read all stats : /stats

