# Music-App
Music App project during Internship at Alphabet Inc

# Overview
This is a simple Music platform, which supports Management of user's private collection. The frontend page is rendered by Vuetify2, 
sending request to backend server with Axois. The Backend is established using Node.js based on Koa Web Framwork, 
which mainly responds with the RESTful API, such as audio source of track, cover image of album, and requests to interact with user library etc. 
The data is stored in Mongo Database, including tracks, albums and user information. The backend node.js use Mongoose to interact with MongoDB and edit the data.

Functions of User Library includes
1. User Login/New user Signup
2. Add/Remove album
3. Create/Delete playlist
4. Add/Remove track to/from playlist

## Explore the entire Library
![image](https://github.com/Apocalypse990923-qshi/music-app/assets/97980766/f60da53a-2286-45cd-a4f1-aed4b1a47102)
![image](https://github.com/Apocalypse990923-qshi/music-app/assets/97980766/29c44210-0160-4b3f-b98c-63c513078443)

## User Collection
![image](https://github.com/Apocalypse990923-qshi/music-app/assets/97980766/f8613098-a0c9-4a43-983e-ceb6ce624fd7)

## Album/Playlist View
![image](https://github.com/Apocalypse990923-qshi/music-app/assets/97980766/b98f5bf5-1ac1-4b0c-86fb-4385b62e0919)
![image](https://github.com/Apocalypse990923-qshi/music-app/assets/97980766/908baeee-8ac3-4ffa-ba2c-9b530448c371)

## Login/Signup View
![image](https://github.com/Apocalypse990923-qshi/music-app/assets/97980766/6e513476-5b63-4021-9c07-26deb0051c6c)


# Technology Stack
## Frontend
Vue.js

Vuetify2

## Backend
Node.js

Koa Web Framework 

JWT(JSON Web Token)

Mongoose

## Databse
MongoDB
