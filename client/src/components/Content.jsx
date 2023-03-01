import React, { useState } from "react";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import Graph from "./Gragh";

export default function Content() {
  const [flagInterval, setFlagInterval] = useState(false);
  const btnOnClick = () => setFlagInterval(!flagInterval);
  const list = ["Google", "Facebook", "Twitter", "Cnet", "Amazon"];
  return (
    <div>
      <span>
        {flagInterval ? (
          <Button variant="contained" color="error" onClick={btnOnClick}>
            Stop
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={btnOnClick}>
            Start
          </Button>
        )}
      </span>
      <br />
      <br />

      <Card variant="outlined">
        <Graph list={list} />
      </Card>
    </div>
  );
}
