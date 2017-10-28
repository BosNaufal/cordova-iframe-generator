
import express from 'express';
import bodyParser from 'body-parser'
import multer from 'multer';
import path from "path"

const app = express()
const upload = multer({ dest: "storages/" })

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/static", express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.post("/create", upload.any(), require("./controllers/CordovaCreate.js"))
app.post("/compile/:appName", require("./controllers/CordovaCompile.js"))
app.get("/download/:appName", require("./controllers/Download.js"))

app.listen(9000, function () {
  console.log("Listening to port 9000")
})
