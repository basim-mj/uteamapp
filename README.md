# UTeam APP
Team's Chating and file sharing desktop app
built using [Electron](https://electron.atom.io/) and use [Firebase](https://firebase.google.com/) as backend

##Build the app
you need [Node](https://nodejs.org) installed before building the app

#### use terminal or command prompt
```
git clone https://github.com/basim-mj/uteamapp.git
```

```
cd uteamapp
```

```
npm install
```


or 

```
sudo npm install
```

on mac

#### to build app for windows 32bit

```
npm run build-w32
```

#### win64

```
npm run build-w64
```


#### osx

```
npm run build-d
```

#### app location
you can find the built app in **builds** , create shorcut for faster access to desktop or pin the app

## using the app

### hosting the team
create new firebase [project](https://console.firebase.google.com/)
then if you need file sharing for the team click on **Storage** to setup new bucket 

if you did not click on storage file sharing may not work

### user authentication
to enable sign-up/sign-in for the team click on **Authentication** | **sign-in method**
enable email/password

### config file 
click on **Overview** then on **Add Firebase to your web app**

open the app | new team and fill the needed info

firebase config

```javascript

<script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>

<script>

  // Initialize Firebase

  var config = {

    apiKey: "[copy-this]",

    authDomain: "[copy-this]",

    databaseURL: "[copy-this]",

    projectId: "[copy-this]",

    storageBucket: "[copy-this]",

    messagingSenderId: "not needed"

  };

  firebase.initializeApp(config);

</script>
```

### team passport
send the created passport + the password to your team members

### join team
in the app click on **Taems** **My Team** **add team** file the password and import the passport file ,  select the new team from the dropdown , and click select



### file download
after sign-in to new team that use file sharing , you need to setup the download folder , in team page **setup**

