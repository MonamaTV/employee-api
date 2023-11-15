const express = require("express");
const cors = require("cors");
const { db, auth } = require("./firebase");
const { verifyUser } = require("./authenticate.js");
const { sendEmail } = require("./mail");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.raw());
// The admin logs in
app.use(verifyUser);

app.get("/", (req, res) => {
  res.send({
    message: "hello, world",
  });
});

// Add new employee
app.post("/employees", async (req, res) => {
  const { name, surname, phone, email, position } = req.body;
  const userID = req.userID;
  try {
    await db.collection("employees").add({
      name,
      surname,
      phone,
      email,
      position,
      adminID: userID,
    });
    res.json({
      message: "New employee has been added",
      code: 201,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Employee could not be added",
      code: 400,
      success: false,
    });
  }
});

app.patch("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db
      .collection("employees")
      .doc(id)
      .update({ ...req.body });
    res.json({
      message: "Employee has been updated",
      code: 201,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Employee has not been updated",
      code: 400,
      success: false,
    });
  }
});

app.get("/employees", async (req, res) => {
  const userID = req.userID;

  try {
    const dbUsers = await db
      .collection("employees")
      .where("adminID", "==", userID)
      .get();

    const users = [];
    dbUsers.forEach((user) => {
      if (user.exists)
        users.push({
          id: user.id,
          ...user.data(),
        });
    });
    res.json({
      message: "Employees",
      code: 200,
      data: users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Employee could not be updated",
      code: 400,
      success: false,
    });
  }
});

app.get("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const userID = req.userID;
  try {
    const dbUser = await db.collection("employees").doc(id).get();

    const user = { ...dbUser.data() };

    if (user.adminID !== userID) {
      return res.json({
        message: "User does not exist",
        success: false,
        code: 404,
      });
    }

    res.json({
      message: "Employee details",
      code: 200,
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Employee could not be found",
      code: 400,
      success: false,
    });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("employees").doc(id).delete();
    res.json({
      message: "Employee has been deleted",
      code: 200,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Employee could not be deleted",
      code: 400,
      success: false,
    });
  }
});

app.get("/send-welcome-email/:email", async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({
      message: "The email is invalid",
      code: 400,
      success: false,
    });
  }

  try {
    const response = await sendEmail(email);
    res.json({
      message: "Email sent",
      data: response,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Email failed to send",
      data: error,
      success: false,
    });
  }
});

app.listen(8000, () => {
  console.log("The server is running");
});
