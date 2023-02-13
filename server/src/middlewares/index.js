import  {expressjwt} from "express-jwt"
import Users from "../models/Users.js"
import Courses from "../models/Courses.js"
import busboy from "busboy" 
import os from 'os'

export const requireSignin = expressjwt({
  secret: 'THis is the secret',
  algorithms: ["HS256"],
  getToken: (req, res)=> req.cookies.token,
})

export const isInstructor = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id).exec()
    if (!user.role.includes("Instructor")){
      return res.sendStatus(403)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
  }
}

export const isEnrolled = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id).exec()
    const course = await Courses.findOne({slug: req.params.slug}).exec()
    
    // check if course id is found in user courses array
    let ids = [];
    for (let i = 0; i < user.courses.length; i++) {
      ids.push(user.courses[i].toString());
    }

    if (!ids.includes(course._id.toString())) {
      res.sendStatus(403);
    } else {
      next();
    }

  } catch (error) {
    console.log(err)
  }
}

export const uploadFile = async (req, res, next) => {
  try{
    // See https://cloud.google.com/functions/docs/writing/http#multipart_data
  const bb = busboy({
    headers: req.headers,
    limits: {
      // Cloud functions impose this restriction anyway
      fileSize: 10 * 1024 * 1024,
    },
  });

  const fields = {};
  const files = [];
  const fileWrites = [];
  // Note: os.tmpdir() points to an in-memory file system on GCF
  // Thus, any files in it must fit in the instance's memory.
  const tmpdir = os.tmpdir();

  bb.on("field", (key, value) => {
    // You could do additional deserialization logic here, values will just be
    // strings
    fields[key] = value;
  });

  bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const filepath = path.join(tmpdir, filename);
    console.log(
      `Handling file upload field ${fieldname}: ${filename} (${filepath})`
    );
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    fileWrites.push(
      new Promise((resolve, reject) => {
        file.on("end", () => writeStream.end());
        writeStream.on("finish", () => {
          fs.readFile(filepath, (err, buffer) => {
            const size = Buffer.byteLength(buffer);
            console.log(`${filename} is ${size} bytes`);
            if (err) {
              return reject(err);
            }

            files.push({
              fieldname,
              originalname: filename,
              encoding,
              mimetype,
              buffer,
              size,
            });

            try {
              fs.unlinkSync(filepath);
            } catch (error) {
              return reject(error);
            }

            resolve();
          });
        });
        writeStream.on("error", reject);
      })
    );
  });

  bb.on("finish", () => {
    Promise.all(fileWrites)
      .then(() => {
        req.body = fields;
        req.files = files;
        next();
      })
      .catch(next);
  });

  bb.end(req.rawBody);

  } catch (error) {
    console.log(error)
  }
  };