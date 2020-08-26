# dash-homepage

This app is a home landing page with widgets to fetch the current weather, keep a collection of links to reduce tabs and save memory, and a stock monitor.  It utilizes Firebase platform to manage user authentication, datastore, and serverless functions which drives a web UI built with Vue.

## To Install

This project uses basic Vue CLI commands for building and serving a dev server.

- To clone the project and install dependencies:
```
git clone https://github.com/djdietrick/dash-homepage.git
cd dash-homepage
npm install
```

- To serve up a dev server with hot refresh:
```
npm run serve
```

- To build the project for distribution:
```
npm run build
```

## Tech Stack

All of the backend functionality is run on Firebase.  Firebase is a Google platform that offers a variety of cloud services such as authentication management, datebases and file storage, serverless functions, website hosting, and much more.  The database for this project is Firestore, Firebase's NoSQL database.  Authentication is handled by Firebase's Authentication module.  

Firebase also allows you to upload functions that can be called on demand either via an HTTP request or directly from you app.  This allows for you to have backend logic, such as making cross-origin requests or doing complex calculations, without the need to own a whole server.

The web UI is built using Vue. The interface is styled using SCSS and components from Shoelace.css.  The UI is driven by Vuex which communicates with the databases and other services while maintaining the state of the UI.  Everything is the hosted on Firebase's Hosting service which just serves up the built Vue application as a single html file.

## Project Structure

- `dist`
    - Target for Vue build
- `functions`
    - Firebase cloud functions. They have their own separate dependencies from the main Vue project
- `public`
    - Entry point for Vue application. Holds `index.html` that is the main page the app attaches to.
- `src`
    - `assets`
        - Static assets for the Vue app
    - `components`
        - Vue components that make up the UI
    - `store` 
        - Vuex store and actions. Code that communicates with Firestore, authentication, and cloud functions.
    - `styles`
        - SCSS for the UI style
    - `views`
        - Higher level Vue components, for main pages.
    - `App.vue`
        - Main Vue app which holds all components and views
    - `main.js`
        - Initializes the Vue app