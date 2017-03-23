const Spawn = require('child_process').spawn;

/**
 * 复制文件
 * 
 * @param {String} from 
 * @param {String} to 
 */
exports.copyDir = function copyDir(from, to) {
  let cp = Spawn('cp', ['-r', from, to]);

  cp.on('error', err => {
    throw new Error(`复制目录出错：${err}`);
  });
}

/**
 * 创建目录
 * 
 * @param {String} dirName
 */
exports.mkDir = function mkDir(dirName) {
  let mkdir = Spawn('mkdir', [dirName]);

  mkdir.on('error', err => {
    throw new Error(`创建目录出错：${err}`);
  });
}

/**
 * 删除文件夹
 * 
 * @param {String} dir 
 */
exports.rmDir = function rmDir(dir) {
  let rm = Spawn('rm', ['-r', dir]);

  rm.on('error', err => {
    throw new Error(`删除目录出错：${err}`);
  });
}