const axios = require("axios");
const express = require("express");
const knex = require("./db/db");
const app = express();
const list_url = {
  google: "https://www.google.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  cnet: "https://www.cnet.com/",
  amazon: "https://www.amazon.com/",
};

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/response", (req, res) => {
  for (const website in list_url) {
    const url = list_url[website];
    const startTime = performance.now();
    axios
      .get(url)
      .then(() => {
        const responseTime = performance.now() - startTime;
        console.log(
          `${website}'s response time is ${responseTime} milliseconds`
        );
        knex(`${website}_responses`)
          .insert({
            response_time: responseTime,
          })
          .catch((error) => {
            console.error(`Error inserting ${website} data: ${error}`);
          });
      })
      .catch((error) => {
        console.error(`Error fetching data from ${website}: ${error}`);
      });
  }
  res.send("Successfuly added all responses to database");
});

app.put("/response", (req, res) => {
  knex("responses")
    .where("id", 6)
    .update({ response_time: 5 })
    .then(() => {
      knex
        .select()
        .from("responses")
        .then((responses) => {
          res.send(responses);
        });
    });
});

app.delete("/response", (req, res) => {
  knex("responses")
    .where("id", 8)
    .del()
    .then(() => {
      knex
        .select()
        .from("responses")
        .then((responses) => {
          res.send(responses);
        });
    });
});

app.listen("3000", () => {
  console.log("Server is runnig on port 3000");
});
