const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Note = require("./models/Notes.js");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

app.use(express.json());
app.use(cors());

const DB_URI = process.env.DATABASE;

mongoose
  .connect(`${DB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the Database!");
  });


app.post('/test', (req, res)=>{
    console.log(req.body);
    res.json(req.body);
})

app.post("/save", async (req, res) => {
  const Id = req.body.NoteDataId;
  const Text = req.body.NoteDataText;
  const Date = req.body.NoteDataDate;
  const UserId = req.body.UserId;

  console.log(Id, Text);

  const noteData = new Note({
    UserId: UserId,
    UserData: {
      NoteDataId: Id,
      NoteDataText: Text,
      NoteDataDate: Date,
    },
  });

  try {
    await noteData.save();
    console.log("Inserted \n" + Text + "\nfor " + UserId);
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({
    status: 'success',
    data: noteData
  })
});

app.post("/getUserData", async (req, res) => {
  try {
    const userData = await Note.find({UserId: req.body.email});
    res.send({ status: "ok", data: userData });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.delete("/deleteNote/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
  
    try {
        const result = await Note.findOneAndDelete({ "UserData.NoteDataId": noteId });
  
      if (!result) {
        return res.status(404).send({ message: "Note not found" });
      }
  
      res.send({ status: "ok", message: "Note deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });
  

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
