import express from "express"; //krijojme server api
import cors from "cors";  //me leju komunikim me frontend(react)
import userRoutes from "./routes/userRoutes.js";  //marrim routes qe kemi
const app = express();  

//ky file ka me pranu request ka me i dergu te routes edhe ka me kthy respond
app.use(cors()); //na lejon me lexu request nga fronti(react), me vone e bejme me front 
app.use(express.json()); //me leju me lexu json body

app.use("/users", userRoutes);  //krejt requst-at qe fillojne me users mi dergu ne userRoutes

//kjo me posht vetem me testu kur e hapim url me get a po funksionon edhe a po na kthehet mesazhi 
app.get("/", (req, res) => {
  res.json({ message: "HireFlow API is working" });
});

export default app;