import fs from 'fs';
import path from 'path';
import sysconfig from './sysconfig';
const maxFileSize = 1024 * 1024; // 1MB
const logDirPath = path.join(process.cwd(), 'log');
console.log(logDirPath);
if (sysconfig.isVercel !== '1') {
  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
  }
}
let logCounter = 0;
const writeToFile = (type = 'log', content: unknown) => {
  if (sysconfig.isVercel === '1') {
    console.log('sequelize:', content);
    return;
  }
  if (process.env.NODE_ENV === 'test' || (process.env.IS_LOG && process.env.IS_LOG.toLowerCase() === 'true')) {
    const date = new Date();
    const dateString = `${type}: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const startTag = `========= START - ${dateString} =========\n\n`;
    const endTag = `\n\n========= END   - ${dateString} =========\n\n`;
    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }

    const logFileName = `log_${date.toLocaleDateString().replace(/\//g, '-')}_${logCounter}.txt`;
    const logFilePath = path.join(logDirPath, logFileName);

    fs.stat(logFilePath, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        // File does not exist, create new log file
        createLogFile();
      } else if (err) {
        console.error(`Error checking log file: ${logFilePath}`, err);
      } else if (stats.isFile() && stats.size > maxFileSize) {
        // File exists and is too large, create new log file
        logCounter++;
        createLogFile();
      } else {
        // Append to existing log file
        appendToLogFile();
      }
    });

    const createLogFile = () => {
      // Create new log file
      const startTag = `========= START - ${dateString} =========\n\n`;
      const endTag = `\n\n========= END   - ${dateString} =========\n\n`;

      fs.writeFile(
        logFilePath,
        `${startTag}${content}${endTag}`,
        { flag: 'w' },
        (err) => {
          if (err) {
            console.error('Failed to create log:', err);
          }
        }
      );
    };

    const appendToLogFile = () => {
      // Append to existing log file
      const startTag = `\n\n========= START - ${dateString} =========\n\n`;
      const endTag = `\n\n========= END   - ${dateString} =========\n\n`;

      fs.appendFile(
        logFilePath,
        `${startTag}${content}${endTag}`,
        { flag: 'a' },
        (err) => {
          if (err) {
            console.error('Failed to write log:', err);
          }
        }
      );
    };
  };
}

export default writeToFile;
