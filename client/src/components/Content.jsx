import React, { useCallback, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import Graph from "./Graph";
import axios from "axios";
import { useInterval } from "usehooks-ts";

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

  const activateResponses = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/newmeasure");
    setResponseTimes((prevResponseTimes) => {
      const newData = { ...prevResponseTimes };
      for (const websiteData of response.data) {
        newData[websiteData.website].responses = [
          ...newData[websiteData.website].responses.slice(1),
          websiteData.response_time,
        ];
        console.log(newData[websiteData.website].responses);
      }
      console.log(newData);
      return newData;
    });
  }, []);
  useInterval(activateResponses, intervalFlag ? 3000 : null);

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
          width: "140vh",
          height: "65vh",
        }}
      >
        {responseTimes && <Graph data={responseTimes} />}
      </Card>
    </div>
  );
}
