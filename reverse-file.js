// reverse-file.js / reverse-file.sh -- ファイル反転

  'use strict';

  var fs = require('fs');

  // command arguments
  var file = process.argv[2];
  if (!file) return console.log('ファイル名を指定してください。\n' +
    'Usage: %s %s {file-name}', process.argv[0], process.argv[1]);

  var xff = parseInt(process.argv[3], 16) & 0xff || 0xff;
  // console.log(xff.toString(16));

  // open
  var r = fs.createReadStream(file);
  var w; // for write stream

  r.on('readable', function () {
    var buf = r.read();
    if (!buf || !buf.length) return; // empty

    // bit reverse
    for (var i = 0, n = buf.length; i < n; ++i) {
      buf[i] ^= xff;
    }

    if (!w) w = createWriteStream(file + '.rev');
    w.write(buf);
  });

  r.on('end', function () {
    if (w) w.end();
  });

  r.on('error', function (err) {
    console.log('read: ' + err);
    if (w) w.end();
  });

  function createWriteStream(file) {
    var ww = fs.createWriteStream(file);

    ww.on('error', function (err) {
      console.log('write: ' + err);
    });

    return ww;
  }
