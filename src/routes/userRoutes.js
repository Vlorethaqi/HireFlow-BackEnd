//Këtu vendos:
// POST (krijo user)
// GET (merr users)
// UPDATE
// DELETE

import express from "express"; 
import User from "../models/User.js";

const router = express.Router(); //ketu krijohet nje mini app vetem per usera

// CREATE USER (thjesht)
router.post("/", async (req, res) => {
  try {
    //kur vjen nje request ruhet ne db
    const user = await User.create(req.body);  //eshte equal me kete INSERT INTO Users ... //ORM (Sequelize) e fut në PostgreSQL


    //kthehet res
    res.json({
      message: "User created",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll(); //merr gjith user-at nga db 

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//me delete user
router.delete("/:id", async (req, res) => { //DELETE http://localhost:3000/users/5
  try {
    const { id } = req.params; //marrim id pasi kemi nga url me express bahet me params

    const user = await User.findByPk(id);//kerkon user ne DB me primaryID

    if (!user) {
      return res.status(404).json({ message: "User not found" });// i kthen frontit mesazhin
    }

    await user.destroy();//e fshin userin ne db nese gjendet

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message }); // i kthen frontit mesazhin
  }
});

export default router;

//pra ketu po perdorim sequelize jo sql query per me kriju psh user.create dhe user.findall mi selektu