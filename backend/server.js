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

app.post("/response", async (req, res) => {
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

app.get("/response", async (req, res) => {
  const resultsPromises = [];
  for (const website in WEBSITES) {
    resultsPromises.push(
      new Promise((resolve, reject) => {
        knex("responses")
          .select("response_time")
          .limit(10)
          .where("website", website)
          .then((data) => {
            resolve({ website: website, responses: data });
          })
          .catch((e) => reject(`${websiteName}: ${e}`));
      })
    );
  }
  const results = await Promise.all(resultsPromises);
  res.json(results);
});

// app.put("/response", (req, res) => {
//   knex("responses")
//     .where("id", 6)
//     .update({ response_time: 5 })
//     .then(() => {
//       knex
//         .select()
//         .from("responses")
//         .then((responses) => {
//           res.send(responses);
//         });
//     });
// });

// app.delete("/response", (req, res) => {
//   knex("responses")
//     .where("id", 8)
//     .del()
//     .then(() => {
//       knex
//         .select()
//         .from("responses")
//         .then((responses) => {
//           res.send(responses);
//         });
//     });
// });

app.listen("5000", () => {
  console.log("Server is runnig on port 5000");
});
