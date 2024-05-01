const fs = require("node:fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const createRepository = async (req, res) => {
  try {
    const repositoryName = req.body.repositoryName;
    if (repositoryName == null || repositoryName == undefined) {
      throw "Bad input";
    }

    if (!fs.existsSync(repositoryPath)) {
      fs.mkdirSync(repositoryPath, { recursive: true });
    }

    const { error, stdout, stderr } = await exec(
      getRepositorySetupCmds(repositoryName)
    );

    let message = `${repositoryName} has been created successfully. Clone this repository with URL ${getCloneUrl(
      repositoryName
    )}`;

    if (stderr) {
      message = `OOPs! Something went wrong`;
      res.status(500);
    }

    res.json({
      message,
      stdout,
      stderr,
      error,
    });
  } catch (error) {
    message = `OOPs! Something went wrong`;
    res.status(500).json({
      message,
      error,
    });
  }
};

const getRepositoryList = async (req, res) => {
  try {
    const { error, stdout, stderr } = await exec(getRepositoryListCmds());

    if (stderr) {
      res.status(500).json({
        message: "OOPs! Something went wrong",
        stderr,
      });
    }

    res.json({
      message: "OK",
      stdout,
    });
  } catch (error) {
    message = `OOPs! Something went wrong`;
    res.status(500).json({
      message,
      error,
    });
  }
};

const getRepositoryContent = async (req, res) => {
  try {
    const repositoryName = req.params.repositoryName;

    const { error, stdout, stderr } = await exec(
      getRepositoryContentsCmds(repositoryName)
    );

    if (stderr) {
      res.status(500).json({
        message: "OOPs! Something went wrong",
        stderr,
      });
    }

    res.json({
      message: "OK",
      stdout,
    });
  } catch (error) {
    message = `OOPs! Something went wrong`;
    res.status(500).json({
      message,
      error,
    });
  }
};

// Exec commands
const getRepositoryListCmds = () => {
  return `su ${process.env.REPOSITORY_USER} && cd ${process.env.REPOSITORY_USER}  && ls -l`;
};

const getRepositoryContentsCmds = (repositoryName) => {
  return `su ${process.env.REPOSITORY_USER} && cd ${getRepositoryPath(
    repositoryName
  )} && git ls-tree -r HEAD`;
};

const getRepositorySetupCmds = (repositoryName) => {
  return `cd ${getRepositoryPath(repositoryName)} && git init --bare`;
};

const getRepositoryPath = (repositoryName) => {
  return `${process.env.REPOSITORY_PATH}/${repositoryName}`;
};

const getCloneUrl = (repositoryName) => {
  return `${process.env.REPOSITORY_USER}@${process.env.REPOSITORY_IP}:${process.env.REPOSITORY_PATH}/${repositoryName}`;
};

module.exports = { createRepository, getRepositoryContent, getRepositoryList };
