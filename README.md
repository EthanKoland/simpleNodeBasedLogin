# Overview
This is a simple project to learn how to set up a express and node based login using passport. This follows a youtube tutorial by Web Dev Simplified. The link to the tutorial is [here](https://www.youtube.com/watch?v=-RCnNyD0L-s&t=1s).

# Learning Objectives
1. Hot to set up a basic login page using passport
2. understand how to use passport to authenticate users
3. Be able to regesiter a new user as needed

# How to run
1. Clone the repo
2. Set up an .env file with the following variables
    - PORT=3000
    - SESSION_SECRET=secret
3. run `npm i express express-session passport passport-local ejs bcrypt dotenv`
4. run `npm i -D nodemon`
5. run `npm run devStart`