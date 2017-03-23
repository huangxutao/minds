const Marked = require('marked');
const Hljs = require('highlightjs');

/**
 * Function mark 解析 markdown
 * 
 * @param {String} str
 * @returns {String}
 */
function mark(str) {
  Marked.setOptions({
    renderer: (() => {
      const renderer = new Marked.Renderer();

      renderer.heading = (text, level) => {
        if(level == 2) {
          return `<a href="#${text}"><h${level} id="${text}">${text}</h${level}></a>`;
        } else {
          return `<h${level} id="${text}">${text}</h${level}>`;
        }
      };

      return renderer;
    })(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: code => {return Hljs.highlightAuto(code).value;}
  });

  return Marked(str)
}

module.exports = mark;