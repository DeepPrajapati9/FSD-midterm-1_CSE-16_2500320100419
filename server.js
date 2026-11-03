const express = require("express");

const app = express();
const port = 3000;
const students = [];

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Express server is running.");
});

app.post("/api/students", (request, response) => {
  const studentInfo = request.body;

  if (
    studentInfo === null ||
    typeof studentInfo !== "object" ||
    Array.isArray(studentInfo)
  ) {
    return response.status(400).json({ error: "Student information must be a JSON object." });
  }

  const requiredFields = ["id", "name", "email", "course", "age"];
  const missingFields = requiredFields.filter(
    (field) =>
      studentInfo[field] === undefined ||
      studentInfo[field] === null ||
      (typeof studentInfo[field] === "string" && studentInfo[field].trim() === ""),
  );

  if (missingFields.length > 0) {
    return response.status(400).json({
      error: "Missing required student fields.",
      fields: missingFields,
    });
  }

  if (!Number.isInteger(studentInfo.id) || studentInfo.id <= 0) {
    return response.status(400).json({ error: "Student ID must be a positive integer." });
  }

  if (students.some((existingStudent) => existingStudent.id === studentInfo.id)) {
    return response.status(409).json({ error: "A student with this ID already exists." });
  }

  if (
    typeof studentInfo.name !== "string" ||
    typeof studentInfo.email !== "string" ||
    typeof studentInfo.course !== "string" ||
    !Number.isInteger(studentInfo.age) ||
    studentInfo.age <= 0
  ) {
    return response.status(400).json({
      error: "Name, email, and course must be strings; age must be a positive integer.",
    });
  }

  const student = { ...studentInfo };
  students.push(student);

  return response.status(201).json({
    message: "Student created successfully.",
    student,
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
