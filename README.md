# 图片压缩网站

这是一个简洁优雅的图片压缩工具网站,采用苹果设计风格。

## 功能特点

- 支持上传 PNG、JPG 等格式图片
- 可预览原图和压缩后的效果对比
- 显示压缩前后文件大小
- 支持自定义压缩比例
- 一键下载压缩后的图片
- 响应式设计,支持各种设备

## 技术实现

- 使用原生 HTML5 和 CSS3 构建界面
- 使用 JavaScript 处理图片压缩逻辑
- 采用 Flexbox 布局实现响应式设计
- 使用 FileReader API 实现图片预览
- 使用 Canvas API 实现图片压缩

## 项目结构 

```
.
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互逻辑
├── upload-icon.svg     # 上传图标
└── README.md           # 项目说明
```

## 部署说明

本项目是纯静态网站，可以部署在任何支持静态网站托管的平台上。

### 本地运行

1. 克隆仓库
```bash
git clone YOUR_REPOSITORY_URL
cd image-compressor
```

2. 使用本地服务器运行
- 使用 Python: `python -m http.server 8080`
- 使用 Node.js: `npx serve`
- 或者使用 VSCode 的 Live Server 插件

### 线上部署

可以部署到以下平台：
- GitHub Pages
- Vercel
- Netlify
- 或任何支持静态网站的托管服务

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m '添加某个特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。