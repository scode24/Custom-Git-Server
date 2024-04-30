const fs = require("node:fs");
const { exec } = require("child_process");

const createRepository = (req, res) => {
  try {
    const repositoryName = req.body.repositoryName;
    const folderName = process.env.REPOSITORY_PATH + "/" + repositoryName;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }

      const commands = "cd " + folderName + " && git init --bare";
      exec(commands, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        res.json({
          message: `${repositoryName} has been created successfully. Clone this repository with URL ${getCloneUrl(
            repositoryName
          )}`,
        });
      });
    } catch (err) {
      console.error(err);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCloneUrl = (repositoryName) => {
  return (
    process.env.REPOSITORY_USER +
    "@" +
    process.env.REPOSITORY_IP +
    ":" +
    process.env.REPOSITORY_PATH +
    "/" +
    repositoryName
  );
};

module.exports = { createRepository };
