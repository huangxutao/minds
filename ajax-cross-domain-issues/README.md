# Ajax 跨域问题


## 我的理解

![Ajax 跨域问题](mind.png)


## 为什么会存在跨域问题？

浏览器的安全机制限制 -- js 代码不能从不同的服务器读取载入文档内容，这便是浏览器的同源策略。

做到同源便是要求

1. 域名
2. 协议
3. 端口

三者均相同，缺一不可。


## 如何解决？

基于 Ajax 立场寻求方案：

- HTTP 访问控制即 CORS (IE 10 +，无需改动 js 代码)
- 服务器端代理 （兼容性好且无需改动 js 代码，但成本会有些）

跳过 Ajax 范畴：

- jsonp （GET Method 承载信息量有限，但兼容性好）

## 代码示例

### 1 .HTTP 访问控制(CORS)

在目标服务端添加跨源资源共享 ( CORS ) 机制让 Web 应用服务器能支持跨站访问控制。

Node Server：

```javascript
const http = require('http');
const app = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  // 控制可获取数据的域名， '*' 代表所用
    'Access-Control-Allow-Headers': 'Content-Type',  // 控制可控请求头信息，非必须但如果 Ajax 有用 setRequestHeader 方法设置请求头信息，则必须在服务器端添加相应请求头字段
    'Access-Control-Request-Method': 'GET'  // 请求方式控制，非必须 （可选 GET, POST, PUT, DELETE, PATCH 等）
  });

  res.end(JSON.stringify({
    name: 'hxtao'
  }));
});

app.listen(3000, '127.0.0.1', () => {
  console.log('Server running at 3000 port...');
});
```

Ajax:

```javascript
;(function() {
  var getJson = function(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4 && cb) {
        cb(xhr);
      }
    };
    xhr.send();
  };

  getJson('http://localhost:3000', function(xhr) {
    var res = JSON.parse(xhr.responseText);
    
    console.log('JSON Data: ', res);
  });
}());
```

### 2. 服务器端代理

nginx 比较方便 ^_^

Nginx Sever:

```nginx
...

server {
  server_name server_1.com;

  location /images {
          proxy_pass http://server_2.com/;
  }
}

...
```

如上 http://server_1.com/images 下的请求都会被转发到 http://server_2.com 上

例如：

http://server_1.com/images/1.png  --转发至--> http://server_2.com/1.png

### 3. jsonp

jsonp 全称为 JSON with padding，而 padding 意为填充。所以需要注意的是 jsonp ≠ json 不能混淆二者之间的关系。

jsonp 与 Ajax 不是一回事，而是通过动态插入 `script` 标记然后出发网络请求，得到 js 文件

例如现有 a.js:

```javascript
var data = {name: hxtao};

console.log(data);
```

然后页面中添加 `<script src="a.js"></script>` 可想而知，控制台会输出 `data` , console.log() 函数为全局方法。

所以我们可以简单封装下：

注：参照上边 `console.log()` ，回调函数是需要在全局范围内可访问的。

```javascript
var getJSONP = function(url, cb) {
  var script = document.createElement('script');
  
  getJSONP.callback = cb;

  if(url.indexOf('?') < 0) {
    script.src = url + '/?jsonp=getJSONP.callback';
  } else {
    script.src = url + '&jsonp=getJSONP.callback';
  }

  document.body.appendChild(script);
  script.parentNode.removeChild(script);
};

getJSONP('http://localhost:3000/', function(data) {
  console.log('get data with jsonp: ', data);
});
```

当然还需服务器端支持：

约定 querystring 中有 jsonp 字段且不为空（有指定回调函数的名称）时返回 js 文档即要求 `application/javascript` ，否则正常返回 JSON 数据。

```javascript
const http = require('http');
const url = require('url');
const app = http.createServer((req, res) => {
  let data = {name: 'hxtao'};
  let query = url.parse(req.url, true).query;

  if(query && query.jsonp) {
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    data = `${query.jsonp}(${JSON.stringify(data)})`;
  } else {
    res.writeHead(200, {'Content-Type': 'application/json'});
    data = JSON.stringify(data);
  }

  res.end(data);
});

app.listen(3000, () => {
  console.log('Running ....');
});
```
