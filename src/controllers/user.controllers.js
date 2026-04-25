import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//logjika e API që qendron  mes routes dhe modelit