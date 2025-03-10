# 盒模型（2）

> [!NOTE]
> 以下是 AI 生成的，不代表 xuyue 的观点

## 1. 盒模型简介

在 HTML 和 CSS 中，每个元素都可以看作是一个矩形的盒子。这个盒子由四个部分组成：内容（content）、内边距（padding）、边框（border）和外边距（margin）。理解盒模型是掌握网页布局的关键。


![box](/tutorial/3/box.svg)

## 2. 盒模型的组成部分

### 2.1 内容（Content）
内容区域是盒子的核心部分，显示元素的实际内容，如文本、图片等。内容的大小可以通过 `width` 和 `height` 属性来设置。

```html
<div>DeepSeek V3</div>
```

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;
}
```

### 2.2 内边距（Padding）
内边距是内容区域与边框之间的空间。它可以通过 `padding` 属性来设置。内边距会增加元素的总宽度和高度。

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    padding: 10px; /* 上下左右的内边距都为10px */
}
```

你也可以分别设置四个方向的内边距：

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    padding-top: 10px;
    padding-right: 15px;
    padding-bottom: 20px;
    padding-left: 25px;
}
```

### 2.3 边框（Border）
边框是围绕内容和内边距的线条。你可以通过 `border` 属性来设置边框的宽度、样式和颜色。

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    border: 2px solid black; /* 2px宽的黑色实线边框 */
}
```

你也可以分别设置边框的宽度、样式和颜色：

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    border-width: 2px;
    border-style: solid;
    border-color: black;
}
```

### 2.4 外边距（Margin）
外边距是元素与其他元素之间的空间。它可以通过 `margin` 属性来设置。外边距不会影响元素的总宽度和高度，但会影响元素在页面中的位置。

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    margin: 10px; /* 上下左右的外边距都为10px */
}
```

你也可以分别设置四个方向的外边距：

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    margin-top: 10px;
    margin-right: 15px;
    margin-bottom: 20px;
    margin-left: 25px;
}
```

## 3. 盒模型的计算

盒模型的总宽度和高度可以通过以下公式计算：

- **总宽度** = `width` + `padding-left` + `padding-right` + `border-left` + `border-right` + `margin-left` + `margin-right`
- **总高度** = `height` + `padding-top` + `padding-bottom` + `border-top` + `border-bottom` + `margin-top` + `margin-bottom`

### 3.1 示例

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;
    padding: 10px;
    border: 2px solid black;
    margin: 20px;
}
```

- **总宽度** = 200px (width) + 10px (padding-left) + 10px (padding-right) + 2px (border-left) + 2px (border-right) + 20px (margin-left) + 20px (margin-right) = 264px
- **总高度** = 100px (height) + 10px (padding-top) + 10px (padding-bottom) + 2px (border-top) + 2px (border-bottom) + 20px (margin-top) + 20px (margin-bottom) = 164px

## 4. `box-sizing` 属性

默认情况下，CSS 使用标准盒模型（`content-box`），即元素的宽度和高度只包括内容区域。如果你希望元素的宽度和高度包括内边距和边框，可以使用 `box-sizing: border-box;`。

```css
div {
    background-color: lightblue;
    width: 200px;
    height: 100px;

    box-sizing: border-box;
    padding: 10px;
    border: 2px solid black;
    margin: 20px;
}
```

在这种情况下，元素的总宽度和高度将包括内容、内边距和边框，而外边距仍然在外部。

## 5. 总结

- **内容（Content）**：元素的实际内容。
- **内边距（Padding）**：内容与边框之间的空间。
- **边框（Border）**：围绕内容和内边距的线条。
- **外边距（Margin）**：元素与其他元素之间的空间。

理解盒模型是掌握网页布局的基础。通过合理设置 `padding`、`border` 和 `margin`，你可以更好地控制元素的外观和位置。

## 任务

### 任务目标

使用 `padding`、`margin` 和 `border` 来调整盒子的布局，完成一个拼图式的页面。你需要通过合理设置这三个属性，让多个盒子按照要求排列组合，最终形成一个完整的图案。

### 任务要求

#### 1. 基础盒子
- 创建 6 个 `div` 元素，每个元素的 `width` 和 `height` 都为 `100px`。
- 每个盒子的背景色可以不同，方便区分。

#### 2. 使用 `padding`、`margin` 和 `border`
- 每个盒子必须设置 `padding`、`margin` 和 `border`，且值不能为 `0`。
- 通过调整这三个属性，让盒子按照以下规则排列：
  - 盒子之间不能有重叠。
  - 盒子之间的间距必须完全由 `margin` 控制。
  - 盒子的内容区域必须清晰可见（通过 `padding` 控制内容与边框的距离）。
  - 边框必须清晰可见，且每个盒子的边框颜色可以不同。

#### 3. 排列规则
- 将 6 个盒子排列成一个 **2x3 的网格**。
- 网格的行间距和列间距必须完全由 `margin` 控制。
- 每个盒子的 `padding` 和 `border` 必须清晰可见。

### 4. 最终效果
- 页面中应该有一个清晰的 2x3 网格，每个盒子之间有均匀的间距。
- 每个盒子的内容区域、内边距和边框都应该清晰可见。

## 初始代码
```html
<div class="container">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
    <div class="box">5</div>
    <div class="box">6</div>
</div>
```

```css
/* 容器样式 */
.container {
    display: flex;
    flex-wrap: wrap;
    width: 400px; /* 容器宽度 */
    margin: 0 auto; /* 居中 */
}

/* 基础盒子样式 */
.box {
    width: 100px;
    height: 100px;
    background-color: lightblue;
    padding: 10px; /* 内边距 */
    border: 5px solid black; /* 边框 */
    margin: 15px; /* 外边距 */
    text-align: center;
    line-height: 100px; /* 文字垂直居中 */
}
```

### 任务提示

1. **`padding`**
   - 控制内容与边框之间的距离。
   - 尝试为不同的盒子设置不同的 `padding` 值，观察内容区域的变化。

2. **`border`**
   - 控制边框的宽度、样式和颜色。
   - 尝试为不同的盒子设置不同的边框样式（如 `dashed`、`dotted`）。

3. **`margin`**
   - 控制盒子之间的间距。
   - 尝试为不同的盒子设置不同的 `margin` 值，观察盒子之间的间距变化。

4. **布局调整**
   - 使用 `display: flex` 和 `flex-wrap: wrap` 来实现 2x3 的网格布局。
   - 调整 `margin` 的值，确保盒子之间的间距均匀。

### 任务扩展（可选）

1. **动态效果**
   - 使用 `:hover` 伪类，当鼠标悬停在盒子上时，改变盒子的 `padding`、`margin` 或 `border`。
   - 例如：
     ```css
     .box:hover {
         padding: 20px;
         margin: 10px;
         border: 10px solid red;
     }
     ```

2. **颜色变化**
   - 为每个盒子设置不同的背景色、边框颜色和内边距颜色，让拼图更生动。

### 最终效果

完成后的页面应该是一个整齐的 2x3 网格，每个盒子之间有均匀的间距，且内容区域、内边距和边框都清晰可见。通过调整 `padding`、`margin` 和 `border`，你可以直观地感受到它们对布局的影响。
