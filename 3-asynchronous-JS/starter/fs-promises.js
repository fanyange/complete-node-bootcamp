const fs = require('fs/promises');

(async () => {
  const content = await fs.readFile(
    '/Users/maorui/Dropbox/notes/Web TODO.md',
    'utf-8'
  );
  console.log(content);
})();
