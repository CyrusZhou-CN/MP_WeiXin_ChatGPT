import fs from 'fs';

const writeToFile = (type = 'log', content: unknown) => {
  if (process.env.NODE_ENV === 'test') {
    const date = new Date();
    const dateString = `${type}: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const startTag = `========= START - ${dateString} =========\n\n`;
    const endTag = `\n\n========= END   - ${dateString} =========\n\n`;

    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }

    const filePath = `log/log_${date.toLocaleDateString().replace(/\//g, '-')}.txt`;

    fs.appendFileSync(
      filePath,
      `${startTag}${content}${endTag}`,
      { flag: 'a+' }
    );
  }
};

export default writeToFile;
