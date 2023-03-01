const axios = require("axios");
const express = require("express");
const knex = require("./db/db");
const app = express();

const WEBSITES = {
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

function measureResponse(websiteUrl, websiteName) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    axios
      .get(websiteUrl)
      .then(() => {
        const responseTime = performance.now() - startTime;
        console.log(
          `${websiteName}'s response time is ${responseTime} milliseconds`
        );
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

app.listen("3000", () => {
  console.log("Server is runnig on port 3000");
});
