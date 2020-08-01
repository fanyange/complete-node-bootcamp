const fs = require('fs');
const superagent = require('superagent');
const url_mod = require('url');
const path = require('path');

// const saveFilePro = (url) => {
//   return new Promise((resolve, reject) => {
//     superagent
//       .get(url)
//       .then((res) => {
//         const filename = path.parse(url_mod.parse(url).pathname).base;
//         const writable = fs.createWriteStream(filename, 'utf-8');
//         res.pipe(writable);
//         resolve('successfully saved picture to ' + filename);
//       })
//       .catch((err) => reject(err));
//   });
// };

// Use callbacks
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-image.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file!');
//       });
//     })
//     .catch((err) => console.log(err.message));
// });

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        err.message = 'I could not find that file 😢:' + file;
        reject(err);
      }
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        err.message = 'Counld not write file 😢';
        reject(err);
      }
      resolve(`Successfully saved the file: ${file}`);
    });
  });
};

// Use promises
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     // return writeFilePro('dog-img.txt', res.body.message);
//     return superagent.get(res.body.message);
//   })
//   .then((data) => {
//     console.log('Writing data to a image file...');
//     return writeFilePro('dog-img.png', data.body);
//   })
//   .then((success) => {
//     console.log(success);
//   })
//   .catch((err) => console.log(err.message));

// Async/await
const downloadPic = async (url, savePath) => {
  const res = await superagent.get(url);
  const img_url = res.body.message;
  console.log(img_url);

  const img_data = await superagent.get(img_url);
  const success = await writeFilePro(savePath, img_data.body);
  return success;
};

const getDogPic = async () => {
  const breed = await readFilePro(`${__dirname}/dog.txt`);
  console.log(`Breed: ${breed}`);

  const url = `https://dog.ceo/api/breed/${breed}/images/random`;

  const pros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) =>
    downloadPic(url, `dog-${i}.png`)
  );
  const successes = await Promise.all(pros);

  // for (const i of [1,2,3,4,5,6,7,8,9,10]) {
  //   const success = await downloadPic(url, `dog-${i}.png`);
  //   console.log(success);
  // }

  console.log(successes.join('\n'));

  return '2. ready 🐶';
};

console.log('1. get Dog pic');
getDogPic()
  .then((success) => {
    console.log(success);
    console.log('3. close');
  })
  .catch((err) => console.log(err.message));
