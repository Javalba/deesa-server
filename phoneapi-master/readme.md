# Express Server API

This is a simple API for educational purposes

## Create a database with Mlab

- Create an account in [mlab.com](https://mlab.com)
- In your dashboard you will see `MongoDB Deployments` click the button `create new`
- select the cloud provider that you want and select `single-node` and `sandbox` plan and name it

![step1](https://cloud.githubusercontent.com/assets/13393006/26530614/8024372e-43d8-11e7-9390-18b861df5608.png)

Once your database is created we need to create the users.

-	Select the tab users and create an user for that database

![step2](https://cloud.githubusercontent.com/assets/13393006/26530734/f28c41f6-43da-11e7-976e-8d8becb5dfe5.png)

In order to connect using the driver you need to copy the address similar to this one.
`mongodb://<dbuser>:<dbpassword>@ds1516621.mlab.com:51661/phoneapi`

Modify `dbuser` and `dbpassword` with the user that you have created.

## Install and Configuration

Before start you need to rename `.env.sample` to `.env` and modify the env variable called `DATABASE` with your database.

```
NODE_ENV=development
DATABASE=mongodb://localhost:27017/<DBname>
```

In terminal run `npm install` in order to install all the dependencies. Once all the dependencies are installed type `npm start`. 

Now you server is running in `http://localhost:3000`.

```bash
$ npm install
$ npm start
```

## Routes

| URL | HTTP verb | Request body | Action |
|-----|----------|-----------|--------|
| `/api/phones` | GET | (empty) | Returns all the phones |
| `/api/phones` | POST | JSON | Add a new phone |
| `/api/phones/:id` | GET | (empty) | Returns the specified phone |
| `/api/phones/:id` | PUT | JSON | Edits the specified phone |
| `/api/phones/:id` | DELETE | (empty) | Deletes the specified phone |

## Phone Model

The phone model has the following structure that you will pass into the body

```JSON
{
  "brand": "Nokia",
  "name": "3310",
  "image": "http://placekitten.com/200/300",
  "specs": [
    "barato",
    "bonito",
    "vintage"
  ]
}
```

