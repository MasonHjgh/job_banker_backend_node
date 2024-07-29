import {getJobs, addJob, editJob, deleteJob, getJob} from "./db.js";
import express from "express";
import Cors from "cors";

const app = express();
const port = 3000;

app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/jobs", getJobs);
app.get("/api/job/:id", getJob);
app.post("/api/addjob", addJob);
app.put("/api/editjob/:id", editJob);
app.delete("/api/deletejob/:id", deleteJob);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
