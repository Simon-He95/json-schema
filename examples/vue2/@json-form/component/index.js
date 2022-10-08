import JsonForm from './src/JsonForm.vue';
import formPage from './src/formPage.vue';
import MenuWrapper from './src/MenuWrapper.vue';
import jsonFormStore from './store';
import './src/index.css';
// 组件列表
const arr = [JsonForm, formPage, MenuWrapper];

// 为组件提供 install 安装方法，供按需引入
// Object.keys(components).forEach(key => {
//   Vue.component(key, components[key])
// })
const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return;
  // 遍历注册全局组件
  arr.map((component) => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue)
// }
const Form = {
  install,
};
export { JsonForm, formPage, jsonFormStore, MenuWrapper };
// 导出组件
export default Form;
