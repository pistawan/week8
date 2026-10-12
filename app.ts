import express from "express";
import { logger } from "./logger.js";

export const app = express();

app.use(express.json());
app.use(logger);

type Student = {
  id: string;
  code: string;
  name: string;
  email: string;
  score: number;
  active: boolean;
};

const students: Student[] = [
  {
    id: "test-student-001",
    code: "66010001",
    name: "Somying",
    email: "somying@dpu.ac.th",
    score: 78,
    active: true,
  },
];

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// GET all students with pagination and search
app.get("/api/v1/students", (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const q = String(req.query.q || "").toLowerCase();

  const filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(q) ||
      student.code.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q)
  );

  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.status(200).json({
    data,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  });
});



app.post("/api/v1/students", (req, res) => {
  const { code, name, email, score } = req.body ?? {};

  // ตรวจสอบข้อมูลที่จำเป็น
  if (
    typeof code !== "string" || !code.trim() ||
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.includes("@")
  ) {
    return res.status(400).json({
      error: "กรุณาระบุ code, name และ email ให้ถูกต้อง",
    });
  }

  // ตรวจสอบข้อมูลซ้ำ
  const duplicate = students.some(
    (student) =>
      student.code === code.trim() ||
      student.email === email.trim()
  );

  if (duplicate) {
    return res.status(409).json({
      error: "รหัสนักศึกษาหรืออีเมลนี้มีอยู่แล้ว",
    });
  }

  const newScore = score === undefined ? 0 : Number(score);

  if (!Number.isInteger(newScore) || newScore < 0 || newScore > 100) {
    return res.status(400).json({
      error: "คะแนนต้องเป็นจำนวนเต็มระหว่าง 0 ถึง 100",
    });
  }

  const newStudent: Student = {
    id: `student-${Date.now()}`,
    code: code.trim(),
    name: name.trim(),
    email: email.trim(),
    score: newScore,
    active: true,
  };

  students.push(newStudent);

  return res.status(201).json({
    message: "เพิ่มนักศึกษาเรียบร้อยแล้ว",
    data: newStudent,
  });
});



app.get("/api/v1/students/:id", (req, res) => {
  const student = students.find(
    (item) => item.id === req.params.id
  );

  if (!student) {
    return res.status(404).json({
      error: "ไม่พบนักศึกษา",
    });
  }

  return res.status(200).json({
    data: student,
  });
});




app.patch("/api/v1/students/:id", (req, res) => {
  const student = students.find(
    (item) => item.id === req.params.id
  );

  if (!student) {
    return res.status(404).json({
      error: "ไม่พบนักศึกษา",
    });
  }

  const { name, email, score, active } = req.body ?? {};

  if (Object.keys(req.body ?? {}).length === 0) {
    return res.status(400).json({
      error: "กรุณาระบุข้อมูลที่ต้องการแก้ไข",
    });
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "ชื่อไม่ถูกต้อง" });
    }
    student.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "อีเมลไม่ถูกต้อง" });
    }
    student.email = email.trim();
  }

  if (score !== undefined) {
    if (typeof score !== "number" ||
        !Number.isInteger(score) || score < 0 || score > 100) {
      return res.status(400).json({
        error: "คะแนนต้องเป็นจำนวนเต็มระหว่าง 0 ถึง 100",
      });
    }
    student.score = score;
  }

  if (active !== undefined) {
    if (typeof active !== "boolean") {
      return res.status(400).json({
        error: "active ต้องเป็น true หรือ false",
      });
    }
    student.active = active;
  }

  return res.status(200).json({
    message: "แก้ไขข้อมูลนักศึกษาเรียบร้อยแล้ว",
    data: student,
  });
});



app.delete("/api/v1/students/:id", (req, res) => {
  const index = students.findIndex(
    (student) => student.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "ไม่พบนักศึกษา",
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  return res.status(200).json({
    message: "ลบนักศึกษาเรียบร้อยแล้ว",
    data: deletedStudent,
  });
});



app.delete("/api/v1/students/:id", (req, res) => {
  const index = students.findIndex(
    (student) => student.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "ไม่พบนักศึกษา",
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  return res.status(200).json({
    message: "ลบนักศึกษาเรียบร้อยแล้ว",
    data: deletedStudent,
  });
});



app.delete("/api/v1/students/:id", (req, res) => {
  const index = students.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "ไม่พบนักศึกษา",
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  return res.status(200).json({
    message: "ลบนักศึกษาเรียบร้อยแล้ว",
    data: deletedStudent,
  });
});
