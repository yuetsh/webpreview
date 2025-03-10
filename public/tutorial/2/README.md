# 盒模型（1）

> [!NOTE]
> 这是测试的版本

## div 标签

HTML 中有一个标签是用的最多的，叫做 `div`，可以表示各种块级元素，可以嵌套使用。div 标签不像 `h1` `p` 有默认的样式， div 标签没有自带样式，这点很好。比如：

```html
<div>Web前端开发工程师</div>
```

嵌套使用：

```html
<div>
    <div>Web前端开发工程师</div>
    <div>岗位要求</div>
    <div>1. 精通 Web 基础语言：HTML/CSS/JavaScript 及熟悉 W3C 网页标准；</div>
    <div>2. 熟悉 Web 数据传输：Ajax（XMLHttpRequest）、Fetch、XML、JSON、XHR 等；</div>
    <div>3. 熟悉网络协议：TCP/IP、HTTP、HTTPS、WebSocket 等； </div>
</div>
```

注意标签的闭合和层级，可以看到每个 div 标签都是占一行，这就是块级元素的意思。

## class 类名

我们在 HTML 标签上可以写 `class` 类名来命名每个标签，方便写 CSS，比如：

```html
<div class="main">
    <div class="title">Web前端开发工程师</div>
    <div class="subtitle">岗位要求</div>
    <div class="item">1. 精通 Web 基础语言：HTML/CSS/JavaScript 及熟悉 W3C 网页标准；</div>
    <div class="item">2. 熟悉 Web 数据传输：Ajax（XMLHttpRequest）、Fetch、XML、JSON、XHR 等；</div>
    <div class="item">3. 熟悉网络协议：TCP/IP、HTTP、HTTPS、WebSocket 等； </div>
</div>
```

最外层的 div 叫做 `main`，内层的分别是 `title` `subtitle` `item`

这样，我们就可以在 CSS 中指定 class 类名，写相应的样式，比如：

```css
.title {
    font-size: 32px;
    font-weight: bold; /* 字体加粗 */
    line-height: 64px;
    color: #000099;
}

.subtitle {
    font-size: 24px;
    line-height: 48px;
}

.item {
    font-size: 20px;
    text-indent: 2em;
    line-height: 40px;
}
```

> [!IMPORTANT]
> 注意 class 类名要有意义，不要随便起名，不然数量多了之后容易混淆

## 任务
### HTML
上网搜索 🔍 或询问 AI 🤖，找到【初级网络工程师】的岗位要求，通过 Div 嵌套，写上合适的 class 类名，完成 HTML 内容的排版。

### CSS
自由调整合适的字体大小、行间距、字体颜色、字重、缩进等样式，美化排版内容。

### 例子
[初级网络工程师岗位要求](/tutorial/2/demo.html)
