import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import Graph from "./Graph";
import axios from "axios";

export default function Content() {
  const [interval, setIntervalId] = useState(false);
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
    const response = await axios.get("http://localhost:5000/newresponse");
    setResponseTimes((prevResponseTimes) => {
      const newData = { ...prevResponseTimes };
      for (const websiteData of response.data) {
        newData[websiteData.website].responses.push(websiteData.response_time);
        newData[websiteData.website].responses.shift();
        console.log(newData[websiteData.website].responses);
      }
      console.log(newData);
      return newData;
    });
  };
  const btnOnClick = () => {
    setIntervalId((prevInterval) => {
      if (prevInterval) {
        clearInterval(prevInterval);
        return false;
      } else {
        const intervalId = setInterval(activateResponses, 3000);
        return intervalId;
      }
    });
  };

  return (
    <div>
      <div>
        {interval ? (
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
