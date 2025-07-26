/// <reference types="vite/client" />

// CSS 模块声明
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// 声明CSS文件导入
declare module "*.css?*" {
  const content: string;
  export default content;
} 