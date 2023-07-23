const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./models/employee');
const UserModel = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Menghubungkan ke database MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

// Menentukan rute dan pengendali

// Rute untuk login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No user found with the provided email");
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

// Rute untuk register
app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then(employee => res.json(employee))
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

// Rute untuk pengambilan data pengguna
app.get('/users', (req, res) => {
  UserModel.find({})
    .then(users => res.json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

// Rute untuk pengambilan data pengguna berdasarkan ID
app.get('/getUser/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.json("No user found with the provided ID");
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

// Rute untuk pembaruan pengguna berdasarkan ID
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndUpdate(id, req.body)
    .then(() => res.json("User updated successfully"))
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

// Rute untuk penghapusan pengguna berdasarkan ID
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then(() => res.json("User deleted successfully"))
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

// Rute untuk pembuatan pengguna baru
app.post('/create', (req, res) => {
  UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
})
// Menjalankan server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});