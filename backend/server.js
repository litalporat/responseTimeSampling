const axios = require("axios");
const express = require("express");
const knex = require("./db/db");
const app = express();
const cors = require("cors");

const WEBSITES = {
  google: "https://www.google.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  cnet: "https://www.cnet.com/",
  amazon: "https://www.amazon.com/",
};
const COLORS = {
  google: "#ff6384",
  facebook: "#35a2eb",
  twitter: "#cce657",
  cnet: "#519f58",
  amazon: "#db7ae0",
};

const QUERTY_SIZE = 10 * Object.keys(WEBSITES).length;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

function measureResponse(websiteUrl, websiteName) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    axios
      .get(websiteUrl)
      .then(() => {
        const responseTime = performance.now() - startTime;
        resolve({ website: websiteName, time: responseTime });
      })
      .catch((e) => reject(`${websiteName}: ${e}`));
  });
}

app.get("/newresponse", async (req, res) => {
  const measurementPromises = [];
  for (const [websiteName, websiteUrl] of Object.entries(WEBSITES)) {
    measurementPromises.push(measureResponse(websiteUrl, websiteName));
  }

  try {
    const responseTimes = await Promise.all(measurementPromises);
    const rowsToInsert = responseTimes.map(({ website, time }) => ({
      website,
      response_time: time,
    }));
    res.json(rowsToInsert);
    knex("responses")
      .insert(rowsToInsert)
      .catch((error) => {
        console.error(`Error inserting ${websiteName} data: ${error}`);
      });
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
});

app.get("/history", async (req, res) => {
  const resultsMap = new Map();
  Object.keys(WEBSITES).map((key) => {
    resultsMap.set(key, []);
  });
  knex("responses")
    .orderBy("id", "desc")
    .select("website", "response_time")
    .limit(QUERTY_SIZE)
    .then((data) => {
      data.map((row) => {
        resultsMap.get(row["website"]).push(row["response_time"]);
      });
      const resultJson = Object.keys(WEBSITES).map((websiteName) => ({
        websiteName,
        responses: resultsMap.get(websiteName),
        color: COLORS[websiteName],
      }));
      res.json(resultJson);
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error}`);
    });
});

app.listen("5000", () => {
  console.log("Server is runnig on port 5000");
});
