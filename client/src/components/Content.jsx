import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import Graph from "./Graph";
import axios from "axios";
import { useInterval } from "usehooks-ts";

const INTERVAL_DELAY = 3000;
export default function Content() {
  const [intervalFlag, setIntervalFlag] = useState(false);
  const [responseTimes, setResponseTimes] = useState();

  useEffect(() => {
    axios.get("http://localhost:5000/history").then((res) => {
      const websites = {};
      for (const { websiteName, responses, color } of res.data) {
        websites[websiteName] = { responses, color };
      }
      setResponseTimes(websites);
    });
  }, []);

  const activateResponses = async () => {
    const response = await axios.get("http://localhost:5000/newmeasure");
    setResponseTimes((prevResponseTimes) => {
      const newData = { ...prevResponseTimes };
      for (const websiteData of response.data) {
        if (newData[websiteData.website].responses.length < 10) {
          newData[websiteData.website].responses = [
            ...newData[websiteData.website].responses,
            websiteData.response_time,
          ];
        } else {
          newData[websiteData.website].responses = [
            ...newData[websiteData.website].responses.slice(1),
            websiteData.response_time,
          ];
        }
      }
      return newData;
    });
  };
  useInterval(activateResponses, intervalFlag ? INTERVAL_DELAY : null);

  const btnOnClick = () => {
    setIntervalFlag((prevIntervalFlag) => {
      return !prevIntervalFlag;
    });
  };

  return (
    <div>
      <div>
        {intervalFlag ? (
          <Button
            variant="contained"
            color="error"
            sx={{ marginBottom: "20px" }}
            onClick={btnOnClick}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            sx={{ marginBottom: "20px" }}
            onClick={btnOnClick}
          >
            Start
          </Button>
        )}
      </div>

      <Card
        variant="outlined"
        sx={{
          width: "150vh",
          height: "70vh",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {responseTimes && <Graph data={responseTimes} />}
      </Card>
    </div>
  );
}
