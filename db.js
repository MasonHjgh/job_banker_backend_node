import { response } from "express";
import pg from "pg";

const client = new pg.Pool({
  user: "job_banker_user_app",
  password: "123456",
  host: "localhost",
  port: "5432",
  database: "Job-banker",
});

class Job {
  constructor({
    company_name = "",
    position_name = "",
    salary = "",
    job_link = "",
    job_description = "",
    contact = "",
    status = 1,
    application_date = "",
    interview_date = "",
    resume_link = "",
    cover_letter_link = "",
    saved_date = "",
  } = {}) {
    this.company_name = company_name;
    this.position_name = position_name;
    this.salary = salary;
    this.job_link = job_link;
    this.job_description = job_description;
    this.contact = contact;
    this.status = status;
    this.application_date = application_date;
    this.interview_date = interview_date;
    this.resume_link = resume_link;
    this.cover_letter_link = cover_letter_link;
    this.saved_date = saved_date;
  }
}

export const getJobs = (request, response) => {
  console.log("Read jobs");
  client.query("SELECT * from Job", (error, results) => {
    if (error) {
      console.log("error");
    }
    response.status(200).json(results.rows);
  });
};

export const getJob = (request, response) => {
  
  const jobid = request.params.id;
  client.query("SELECT * from Job where id = $1", [jobid], (error, results) => {
    if (error) {
      console.log("error");
    }
    response.status(200).json(results.rows);
  });
};

export const addJob = async (request, response) => {
  const job = new Job(request.body);
  const query = `
      INSERT INTO Job (
        company_name, position_name, salary, job_link, job_description,
        contact, status, application_date, interview_date, resume_link,
        cover_letter_link, saved_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *
    `;
  const values = [
    job.company_name,
    job.position_name,
    job.salary,
    job.job_link,
    job.job_description,
    job.contact,
    job.status,
    job.application_date,
    job.interview_date,
    job.resume_link,
    job.cover_letter_link,
    job.saved_date,
  ];
  const result = await client.query(query, values, (error, results) => {
    if (error) {
      console.log("error");
    }
    response.status(200).json(results.rows);
  });
};
export const editJob = async (request, response) => {
  const jobId = request.params.id;
  const job = new Job(request.body);

  const query = `
  UPDATE Job
  SET
    company_name = $1,
    position_name = $2,
    salary = $3,
    job_link = $4,
    job_description = $5,
    contact = $6,
    status = $7,
    application_date = $8,
    interview_date = $9,
    resume_link = $10,
    cover_letter_link = $11,
    saved_date = $12
  WHERE id = $13
  RETURNING *;
`;

  const values = [
    job.company_name,
    job.position_name,
    job.salary,
    job.job_link,
    job.job_description,
    job.contact,
    job.status,
    job.application_date,
    job.interview_date,
    job.resume_link,
    job.cover_letter_link,
    job.saved_date,
    jobId,
  ];

  try {
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      response.status(200).json(result.rows);
    } else {
      response.status(404).send("Job not found");
    }
  } catch (error) {
    console.error("Error updating job:", error);
    response.status(500).send("Error updating job");
  }
};

export const deleteJob = (request, response) => {
  const jobId = request.params.id;
  client.query(
    "delete from Job where id = $1 Returning *",
    [jobId],
    (error, results) => {
      if (error) {
        console.log("error");
      }
      response.status(200);
    }
  );
};
