/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const fs = require("fs");
const cors = require('cors');


const async = require("async");

const express = require("express");
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const processFormBody = multer({ storage: multer.memoryStorage() }).single(
  "uploadedphoto"
);

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// this line for tests and before submission!
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());

app.use(cors({ origin: true, credentials: true }));


app.use((request, res, next) => {
  console.log(
    "Request Method: ",
    request.method,
    " , Request URL: ",
    request.originalUrl,
    ", Request Body: ",
    JSON.stringify(request.body)
  );

  // console.log("Request Headers", JSON.stringify(request.headers));
  console.log()
  next();
});


app.use((req, res, next) => {
  // Store original send method
  const originalSend = res.send;
  res.send = function (body) {
    console.log('Response Data:', body);

    originalSend.call(this, body);
  };

  // Continue to the next middleware/route handler
  next();
});


app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause express to accept URLs with /test/<something> and return the something in request.params.p1.
 *
 * If implement the get as follows:
 * /test - Returns the SchemaInfo object of the database in JSON format. This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections in JSON format.
 */

app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

// URL /user/list - Returns all the User objects.
app.get("/user/list", function (request, response) {
  if (!request.session.user_id) response.status(401).send();

  User.find({}, "_id first_name last_name")
    .lean()
    .exec()
    .then((result) => {
      //console.log(JSON.stringify(result));
      response.status(200).send(JSON.stringify(result));
    })
    .catch(() => {
      response.status(500).end();
    });
});

// URL /user/:id - Returns the information for User (id).
app.get("/user/:id", function (request, response) {
  const param = request.params.id;

  if (!request.session.user_id) {
    console.log("id not found")
    response.status(401).send();
  }

  User.findById(param, "first_name last_name location description occupation")
    .lean()
    .exec()
    .then((result) => {
      if (result === null) response.status(400).end(JSON.stringify(result));
      else response.status(200).end(JSON.stringify(result));
    })
    .catch((error) => {
      console.log("error", error)
      response.status(400).end();
    });
});

// URL /photosOfUser/:id - Returns the Photos for User (id).
app.get("/photosOfUser/:id", function (request, response) {
  const param = request.params.id;

  if (!request.session.user_id) {
    console.log("id not found")
    response.status(401).send();
  }

  Photo.find({ user_id: param }, "file_name date_time user_id comments likes")
    .populate({
      path: "comments.user_id",
      select: "first_name last_name _id",
    })
    .lean()
    .exec()
    .then((result) => {
      if (result.length === 0) {
        response.status(200).send(result);
        return;
      }

      // Copies values from 'user_id' into a new 'user' property.
      // This is because the user_id prop is used as a joiner and contains
      // user data assocaited with user_id

      const transformedResult = result.map((photo) => {
        const transformedComments = photo.comments.map((comment) => ({
          ...comment,
          user: comment.user_id,
        }));

        return {
          ...photo,
          comments: transformedComments,
        };
      });

      // Remove user_id from comments
      transformedResult.forEach((photo) => {
        photo.comments.forEach((comment) => delete comment.user_id);
      });

      response.status(200).json(transformedResult);
    })
    .catch((err) => {
      console.error(err);
      response.status(400).end();
    });
});

app.post("/user", function (request, response) {
  const first_name = request.body.first_name || "";
  const last_name = request.body.last_name || "";
  const location = request.body.location || "";
  const description = request.body.description || "";
  const occupation = request.body.occupation || "";
  const login_name = request.body.login_name || "";
  const password = request.body.password || "";

  if (first_name === "") {
    console.error("Error in /user", first_name);
    response.status(400).send("first_name is required");
    return;
  }
  if (last_name === "") {
    console.error("Error in /user", last_name);
    response.status(400).send("last_name is required");
    return;
  }
  if (login_name === "") {
    console.error("Error in /user", login_name);
    response.status(400).send("login_name is required");
    return;
  }
  if (password === "") {
    console.error("Error in /user", password);
    response.status(400).send("password is required");
    return;
  }

  User.exists({ login_name: login_name }, function (err, returnValue) {
    if (err) {
      console.error("Error in /user", err);
      response.status(500).send();
    } else if (returnValue) {
      console.error("Error in /user", returnValue);
      response.status(400).send();
    } else {
      User.create({
        _id: new mongoose.Types.ObjectId(),
        first_name: first_name,
        last_name: last_name,
        location: location,
        description: description,
        occupation: occupation,
        login_name: login_name,
        password: password,
      })
        .then((user) => {
          request.session.user_id = user._id;
          session.user_id = user._id;
          response.end(JSON.stringify(user));
        })
        .catch((error) => {
          console.error("Error in /user", error);
          response.status(500).send();
        });
    }
  });
});

app.post("/admin/login", function (request, response) {
  User.find(
    { login_name: request.body.login_name },
    "password _id first_name last_name"
  )
    .lean()
    .exec()
    .then((result) => {
      // console.log(result);
      // If there is no items found, then return 400
      if (result.length === 0) response.status(400).end(JSON.stringify(result));
      else if (request.body.password === result[0].password) {
        request.session.user_id = result[0]._id;
        request.session.first_name = result[0].first_name;
        request.session.last_name = result[0].last_name;
        response.status(200).send(
          JSON.stringify({
            _id: request.session.user_id,
            first_name: request.session.first_name,
            last_name: request.session.last_name,
          })
        );
      } else {
        response.status(400).send("Invaid password");
      }
    })
    .catch(() => {
      response.status(500).end();
    });
});

app.post("/admin/logout", function (req, res) {
  if (req.session.user_id) {
    req.session.destroy();
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

// For checking the session if the user is laready logged in. used for page reloads mainly
app.post("/admin/session/resume", function (req, res) {
  if (req.session.user_id) {
    res.status(200).send(
      JSON.stringify({
        _id: req.session.user_id,
        first_name: req.session.first_name,
        last_name: req.session.last_name,
      })
    );
  } else {
    res.status(500).send();
  }
});

app.post("/photos/new", (request, response) => {
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      // XXX -  Insert error handling code here.
      response.send(400).send("File not found or error");
      return;
    }
    const timestamp = new Date().valueOf();
    const filename = "U" + String(timestamp) + request.file.originalname;
    let visibleTo = [];
    if (request.body.visibleTo) {
      try {
        visibleTo = JSON.parse(request.body.visibleTo);
      } catch (parseError) {
        console.error('Error parsing visibleTo:', parseError);
      }
    }
    fs.writeFile("./images/" + filename, request.file.buffer, function () {
      // XXX - Once you have the file written into your images directory under the
      // name filename you can create the Photo object in the database
      Photo.create({
        file_name: filename,
        date_time: timestamp,
        user_id: request.session.user_id,
        visibleTo: visibleTo,
        comment: [],
      })
        .then(() => {
          response.status(200).send({ "msg": "done" });
        })
        .catch((error) => {
          console.log("error", error)
          response.status(500).send();
        });
    });
  });
});

app.post("/commentsOfPhoto/:photo_id", function (request, response) {
  if (!request.session.user_id) return response.status(401).send();

  const photoId = request.params.photo_id || "";
  const user_id = request.session.user_id || "";
  const commentText = request.body.comment || "";
  // Validate and convert photo_id and user_id to ObjectId if valid
  console.log(photoId);
  console.log(user_id);
  const photoObjectId = new mongoose.Types.ObjectId(photoId);
  const userObjectId = new mongoose.Types.ObjectId(user_id);
  if (!photoObjectId) {
    return response.status(400).send("Invalid photo ID format");
  }
  if (!userObjectId) {
    return response.status(400).send("Invalid user ID format");
  }
  if (commentText === "") {
    return response.status(400).send("Comment required");
  }
  // Find the photo and add the comment
  Photo.findById(photoObjectId, function (err, photo) {
    if (err) {
      console.error("Error finding photo:", err);
      return response.status(500).send("Error finding photo");
    }
    if (!photo) {
      return response.status(404).send("Photo not found");
    }
    const newComment = {
      comment: commentText,
      date_time: new Date(),
      user_id: userObjectId,
      _id: new mongoose.Types.ObjectId(), // New unique ID for the comment
    };
    photo.comments.push(newComment);
    photo.save(function (saveErr) {
      if (saveErr) {
        console.error("Error saving comment:", saveErr);
        return response.status(500).send("Error saving comment");
      }
      return response.status(200).send("Comment added successfully");
    });
  });
});


app.post("/likeOrUnlikePhoto/:photo_id", function (request, response) {
  if (!request.session.user_id) return response.status(401).send();

  const photoId = request.params.photo_id || "";
  const user_id = request.session.user_id || "";
  const likeOrUnlike = request.body.likeOrUnlike || false;
  console.log(photoId);
  console.log(user_id);
  const photoObjectId = new mongoose.Types.ObjectId(photoId);
  const userObjectId = new mongoose.Types.ObjectId(user_id);
  if (!photoObjectId) {
    return response.status(400).send("Invalid photo ID format");
  }
  if (!userObjectId) {
    return response.status(400).send("Invalid user ID format");
  }

  Photo.findById(photoObjectId, function (err, photo) {
    if (err) {
      console.error("Error finding photo:", err);
      return response.status(500).send("Error finding photo");
    }
    if (!photo) {
      return response.status(404).send("Photo not found");
    }
    let likes = photo.likes || [];

    if (likeOrUnlike) {
      likes.push(user_id);
    } else {
      likes = likes.filter((id) => { return id != user_id });
    }
    photo.likes = Array.from(likes);
    photo.save(function (saveErr) {
      if (saveErr) {
        console.error("Error saving like or unlike:", saveErr);
        return response.status(500).send("Error saving like or unlike");
      }
      return response.status(200).send((likeOrUnlike ? "like" : "unlike") + " successfully");
    });
  });
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
    port +
    " exporting the directory " +
    __dirname
  );
});
