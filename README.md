<span><div style="text-align: center;">
![img](/assets/icon.jpg)
</div></span>


## JSON Schema
将JSON数据转换为表单，并具有表单的特性

## 优势
- 支持多条件的显隐正则控制
- 支持多条件的必填正则控制
- 数据结构简洁

## 安装
```bash
npm install json-schema-transform-form
```

## 使用
```vue
<my-schema ref="formEl" :schema="schema" />
```json-schema-transform-form
```json
{
  "description": "A simple form example.",
  "order": [
    "firstName",
    "lastName",
    "bio",
    "*",
    "date",
    "switch",
    "age"
  ],
  "attribs": {
    "age": {
      "max": 80,
      "min": 16,
      "label": "Age:",
      "description": "Enter your age.",
      "type": "Number",
      "precision": 2,
      "step": 5
    },
    "bio": {
      "maxlength": 10,
      "label": "Bio:",
      "type": "Text",
      "required": true,
      "rules": {
        "[0-9]": "Must contain at least one number.",
        "[a-zA-Z]": "Must contain at least one alpha."
      }
    },
    "checkbox": {
      "options": [
        {
          "label": "选项一",
          "value": "option-1"
        },
        {
          "label": "选项二",
          "value": "option-2",
          "disabled": true
        }
      ],
      "label": "多选:",
      "type": "Enumeration"
    },
    "firstName": {
      "default": "Jun",
      "label": "First name:",
      "type": "Text"
    },
    "lastName": {
      "rule": "必须输入Last Name",
      "label": "Last name:",
      "type": "Text",
      "placeholder": "请输入内容"
    },
    "switch": {
      "label": "开关:",
      "type": "Boolean"
    },
    "textarea": {
      "placeholder": "请输入内容",
      "default": "我被switch控制",
      "type": "RichText",
      "label": "textarea",
      "required": true,
      "show": {
        "switch": {
          "value": true
        }
      }
    },
    "upload": {
      "placeholder": "请输入内容",
      "type": "Upload"
    }
  },
  "size": "large",
  "title": "Schema Form"
}
```

## 方法
- submit: 提交表单动作，对表单进行校验，返回表单数据
- getFormData: 获取当前表单数据
- resetField：重置表单数据

## :coffee: 
[请我喝一杯咖啡](https://github.com/Simon-He95/sponsor)

## GitHub地址
[欢迎PR](https://github.com/Simon-He95/json-schema-transform-form)
