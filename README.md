- [MyLocation](#mylocation)
- [Start the app](#start-the-app) 
- [Run the tests](#run-the-tests)
  
# MyLocation

MyLocations is a little webapp that allows you to save your locations and see them on a map.

### Start the app

**Install the dependencies**

```bash
npm install
```

**Create a .env.local file**

```bash
touch .env.local
```

**Add the following environment variables to the .env.local file**

```bash
NEXT_PUBLIC_GOOGLE_API_KEY=<your google api key>
MONGO_DB_URI=<your mongo db uri>
```
For example:
```bash
NEXT_PUBLIC_GOOGLE_API_KEY=123456789
MONGO_DB_URI=mongodb://username:verysecurepassword@localhost:27017/mydb?authSource=admin
```

**Start the MongoDB server**

```bash
docker compose up # add -d to run in detached mode
```

**Start the app**

```bash
npm run dev
```

### Run the tests

```bash
npm run test
```

### Build the app

```bash
npm run build
```




