# HTML 基本标签 —— 标题和段落

> [!NOTE]
> 这是测试的版本

## 标题

`h1` 到 `h6`，一共六级标题。

```html
<h1>标题 1</h1>
<h2>标题 2</h2>
<h3>标题 3</h3>
<h4>标题 4</h4>
<h5>标题 5</h5>
<h6>标题 6</h6>
```

给六个标题字体颜色换一下，注意：`color` 表示**字体颜色**。

```css
h1 {
    color: red;
}

h2 {
    color: orange;
}

h3 {
    color: yellow;
}

h4 {
    color: green;
}

h5 {
    color: blue;
}

h6 {
    color: purple;
}
```

颜色的表示可以是英文，也可以是十六进制（注意前面有个井号），也可以是 RGB。

比如

```css
h1 {
    color: #333333;
}
h2 {
    color: rgb(163, 174, 46);
}
```

## 段落

`p` 表示段落

```html
<p>
  月光如流水一般，静静地泻在这一片叶子和花上。薄薄的青雾浮起在荷塘里。叶子和花仿佛在牛乳中洗过一样；又像笼着轻纱的梦。虽然是满月，天上却有一层淡淡的云，所以不能朗照；但我以为这恰是到了好处——酣眠固不可少，小睡也别有风味的。月光是隔了树照过来的，高处丛生的灌木，落下参差的斑驳的黑影，峭楞楞如鬼一般；弯弯的杨柳的稀疏的倩影，却又像是画在荷叶上。塘中的月色并不均匀；但光与影有着和谐的旋律，如梵婀玲上奏着的名曲。
</p>
```

用 `font-size` 改变字体大小，`line-height` 改变行高。注意单位是 px（像素）

```css
p {
    font-size: 24px;
    line-height: 48px;
    text-indent: 2em;
}
```

`text-indent: 2em;` 表示首行缩进 2 个字符（单位不是 px，而是 em）

## 任务

标题和段落的简单美化。

### 要求

完成下面《白鹭》散文（节选）的排版：

- 标题：使用 `h1` 标签，设置字号 32px，颜色黑色;
- 每个段落：设置字号 28px，颜色（#333），行间距 40px，首行缩进两字符；

### 文字材料

白鹭

白鹭是一首精巧的诗。

色素的配合，身段的大小，一切都很适宜。

白鹤太大而嫌生硬，即如粉红的朱鹭或灰色的苍鹭，也觉得大了一些，而且太不寻常了。

然而白鹭却因为它的常见，而被人忘却了它的美。

那雪白的蓑毛，那全身的流线型结构，那铁色的长喙，那青色的脚，增之一分则嫌长，减之一分则嫌短，素之一忽则嫌白，黛之一忽则嫌黑。

### 效果
```html preview
<h1 style="font-size: 32px; color: black;">白鹭</h1>
<p style="font-size: 28px; color: #333; line-height: 40px; text-indent: 2em">白鹭是一首精巧的诗。</p>
<p style="font-size: 28px; color: #333; line-height: 40px; text-indent: 2em">色素的配合，身段的大小，一切都很适宜。</p>
<p style="font-size: 28px; color: #333; line-height: 40px; text-indent: 2em">白鹤太大而嫌生硬，即如粉红的朱鹭或灰色的苍鹭，也觉得大了一些，而且太不寻常了。</p>
<p style="font-size: 28px; color: #333; line-height: 40px; text-indent: 2em">然而白鹭却因为它的常见，而被人忘却了它的美。</p>
<p style="font-size: 28px; color: #333; line-height: 40px; text-indent: 2em">那雪白的蓑毛，那全身的流线型结构，那铁色的长喙，那青色的脚，增之一分则嫌长，减之一分则嫌短，素之一忽则嫌白，黛之一忽则嫌黑。</p>
```

## 总结
### HTML
标题：h1 到 h6  
段落：p

### CSS
color 字体颜色  
font-size 字体大小  
line-height 行间距  
text-indent: 2em; 表示首行缩进2字符  