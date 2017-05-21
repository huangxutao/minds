const Ejs = require('ejs');
const Fs = require('fs');

/**
 * 生成静态 html 文件
 * 
 * @param {String} tplFile 
 * @param {String} htmlFile 
 * @param {Object} data 
 */
function render(tplFile, htmlFile, data) {
  Ejs.renderFile(tplFile, data, function(err, str) {
    if(err) {throw new Error(`渲染出错：${err}`)}
    Fs.writeFile(htmlFile, str, function(err) {
      if(err) {
        throw new Error(`写入文件出错：${err}`);
      } else {
        console.log(`write to ${htmlFile} success`);
      }
    })
  });
}

module.exports = render;