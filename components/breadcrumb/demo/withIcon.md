# 带有图标的

- order: 1

图标放在文字前面。

---

````jsx
var Breadcrumb = require('antd/lib/breadcrumb');

React.render(
  <Breadcrumb>
    <Breadcrumb.Item href="">
      <i className="anticon anticon-home"></i>
    </Breadcrumb.Item>
    <Breadcrumb.Item href="">
      <i className="anticon anticon-user"></i>
      应用列表
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      应用
    </Breadcrumb.Item>
  </Breadcrumb>
, document.getElementById('components-breadcrumb-demo-withicon'));
````

