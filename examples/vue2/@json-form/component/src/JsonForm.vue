<script>
import { nanoid } from 'nanoid';
import { mapTransform, mapTransformBack } from '@json-form/util';
import {
  DATE_TYPE_DATE,
  DATE_TYPE_DATETIME,
  DATE_TYPE_YEAR,
  DATE_TYPE_MONTH,
  TIME_TYPE_TIME,
  RANGE_TYPE_DATERANGE,
  RANGE_TYPE_DATETIMERANGE,
  RANGE_TYPE_TIMERANGE,
} from './utils/options';
import { JFServerSelect, JFPidBatchQuerySelect } from './component';

function addStyle(str) {
  const s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = str;
  document.head.appendChild(s);
  return () => document.head.removeChild(s);
}

function isPlanObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

let remove;
let styles = '';
export default {
  name: 'JsonForm',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: {},
      rules: {},
      groupData: {},
      dialogShow: false,
      previewSrc: '',
      count: 0,
      groupKeys: [],
      schema: {},
      map: {},
      groupCurrent: {},
      noPassedItems: [],
    };
  },
  watch: {
    data: {
      handler() {
        this.resetFields();
        this.model = {};
        this.transformToJson();
      },
      deep: true,
    },
  },
  mounted() {
    this.transformToJson();
  },
  methods: {
    validate() {
      return new Promise((resolve) =>
        this.$refs.jsonFormEL.validate((success) => {
          resolve(success);
          this.focusError();
        })
      );
    },
    focusError() {
      const error = this.noPassedItems[0];
      if (!error) return;
      const el = this.$refs[error].$el;
      if (!el) return;
      el.scrollIntoView({
        behavior: 'smooth',
      });
      el.querySelector('input')?.focus();
    },
    // 获取表单结构数据
    getFormSchema() {
      return this.schema;
    },

    resetFields() {
      this.$refs.jsonFormEL.resetFields();
    },
    transformToJson() {
      const result = {
        description: '',
        attribs: {},
        id: nanoid(),
      };
      if (Array.isArray(this.data)) {
        this.data.reduce((result, item) => {
          result[item.key] = item;
          return result;
        }, result.attribs);
        this.map = this.getMap(this.data);
      }
      this.schema = result;
    },
    getMap(data, map = {}) {
      data.forEach((item) => {
        const mapKey = item.mapKey;
        if (item.type === 'Group') {
          this.getMap(item.group, map);
        } else if (mapKey) {
          map[mapKey] = item.key;
        }
      });
      return map;
    },
    judgeShow(formItemClass, show) {
      const el = document.querySelector(`.${formItemClass}`);
      if (!el) return;
      if (!show) return (el.style.display = 'block');
      for (let i = 0; i < show.length; i++) {
        const item = show[i];
        const val = this.model[item.relevancy];
        const type = item.controlType;
        if (type === 'value') {
          if (!val) return (el.style.display = 'none');
        } else {
          if (!item.controlReg) continue;
          const reg = new RegExp(item.controlReg);
          if (!reg.test(val)) return (el.style.display = 'none');
        }
      }
      return (el.style.display = 'block');
    },
    getFormData() {
      this.groupKeys.forEach((key) => {
        this.model[key] = this.model[key].map((item) => {
          Object.keys(item).forEach((_key) => {
            const value = item[_key];
            if (isPlanObject(value) && value.value) item[_key] = value.value;
          });
          return item;
        });
      });
      return this.model;
    },
    validators(validator, key, rules, required) {
      if (validator) {
        this.rules[key] = [
          {
            validator,
          },
        ];
      } else if (rules.length) {
        this.rules[key] = [
          {
            required,
            validator: (o, value = '', callback) => {
              for (const item of rules) {
                if (!new RegExp(item.regExp).test(value)) {
                  this.noPassedItems.push(o.field);
                  return callback(
                    new Error(item.errMsg || `${key} is invalid`)
                  );
                }
              }
              callback();
            },
          },
        ];
      } else if (required) {
        this.rules[key] = [
          {
            required,
            validator: (o, value = '', callback) => {
              this.noPassedItems.push(o.field);
              return value ? callback() : callback(new Error('该项是必输项'));
            },
          },
        ];
      }
    },
    onPreview(uploadFile) {
      this.previewSrc = uploadFile.url;
      this.dialogShow = true;
    },
    uploadChange(data, model, key, limit) {
      if (!model[key]) model[key] = [];
      if (model[key].length < limit) model[key].push(data);
    },
    removeFile(data, model, key) {
      model[key].splice(data, 1);
    },
    modelValue(val, model, key) {
      this.$set(model, key, val);
    },
    getTypeComponent(h, form, model, key) {
      let flag = false;
      if (key === true) {
        flag = true;
        key = undefined;
      }
      const {
        type,
        cascader,
        date,
        class: className,
        multiple,
        default: value,
        style,
        len,
        options,
        disabled,
        border,
        precision,
        upload = {},
        step,
        debounce = 300,
        placeholder,
        group,
        key: _key,
        label,
        switchTrue,
        switchFalse,
        customRender,
        description,
      } = form[key] || form;
      if (key && value) this.$set(model, key, value);
      key = key || _key;
      const { min, max } = len || {};
      if (group) {
        return this.renderGroup(group, h, model, key);
      }
      const typeComponent = {
        Text: (type = 'text') =>
          h('Input', {
            props: {
              value: model[key] || this.$set(model, key, ''),
              type,
              maxlength: max,
              placeholder,
              disabled,
              key,
            },
            class: className,
            on: {
              input: (val) => this.modelValue(val, model, key),
            },
          }),
        Email: () => typeComponent.Text(),
        Textarea: () => typeComponent.Text('textarea'),
        RichText: () => typeComponent.Text('textarea'),
        Password: () => typeComponent.Text('password'),
        Date: () => {
          const { type, format } = date || {};

          switch (type) {
            // 日期类型
            case DATE_TYPE_DATE:
            case DATE_TYPE_DATETIME:
            case DATE_TYPE_YEAR:
            case DATE_TYPE_MONTH:
              return h('DatePicker', {
                props: {
                  value: model[key] || this.$set(model, key, ''),
                  type,
                  placeholder,
                },
                on: {
                  input: (val) => this.modelValue(val, model, key),
                },
              });

            // 日期范围
            case RANGE_TYPE_DATERANGE:
            case RANGE_TYPE_DATETIMERANGE:
              return h('DatePicker', {
                props: {
                  value: model[key] || this.$set(model, key, []),
                  type,
                  placeholder,
                },
                on: {
                  input: (val) => this.modelValue(val, model, key),
                },
              });

            // 时间类型
            case TIME_TYPE_TIME:
              return h('TimePicker', {
                props: {
                  value: model[key] || this.$set(model, key, ''),
                  type,
                  confirm: true,
                  disabled,
                },
                on: {
                  input: (val) => this.modelValue(val, model, key),
                },
              });

            // 时间范围
            case RANGE_TYPE_TIMERANGE:
              return h('TimePicker', {
                props: {
                  value: model[key] || this.$set(model, key, []),
                  type,
                  confirm: true,
                  disabled,
                },
                on: {
                  input: (val) => this.modelValue(val, model, key),
                },
              });
          }

          // switch (type) {
          //   case 'time':
          //     return h('TimePicker', {
          //       props: {
          //         value: model[key] || (model[key] = ''),
          //         type: 'time',
          //         confirm: true,
          //         placeholder,
          //         disabled,
          //       },
          //       on: {
          //         input: (val) => this.modelValue(val, model, key),
          //       },
          //     });
          //   case 'timezone':
          //     return h('TimePicker', {
          //       props: {
          //         value: model[key] || (model[key] = []),
          //         type: 'timerange',
          //         confirm: true,
          //         disabled,
          //       },
          //       on: {
          //         input: (val) => this.modelValue(val, model, key),
          //       },
          //     });
          //   case 'datetime':
          //     return h('DatePicker', {
          //       props: {
          //         value: model[key] || '',
          //         type: 'datetime',
          //         format,
          //         placeholder,
          //       },
          //       on: {
          //         input: (val) => this.modelValue(val, model, key),
          //       },
          //     });
          //   case 'datetimezone':
          //     return h('DatePicker', {
          //       props: {
          //         value: model[key] || [],
          //         type: 'datetimerange',
          //         format,
          //         disabled,
          //       },
          //       on: {
          //         input: (val) => this.modelValue(val, model, key),
          //       },
          //     });
          //   case 'datezone':
          //     return h('DatePicker', {
          //       props: {
          //         value: model[key],
          //         type: 'daterange',
          //         format,
          //         disabled,
          //       },
          //       on: {
          //         input: (val) => this.modelValue(val, model, key),
          //       },
          //     });
          //   default:
          //     return h('DatePicker', {
          //       props: {
          //         value: model[key],
          //         type: 'date',
          //         placeholder,
          //         format,
          //         disabled,
          //       },
          //       on: {
          //         input: (val) => this.modelValue(val, model, key),
          //       },
          //     });
          // }
        },
        Number: () =>
          h('InputNumber', {
            props: {
              value: model[key] ? model[key] : this.$set(model, key, null),
              class: className,
              style,
              disabled,
              placeholder,
              min: min || undefined,
              max: max || undefined,
              precision,
              step,
            },
            on: {
              input: (val) => this.modelValue(val, model, key),
            },
          }),
        Enumeration: () => {
          return h(
            'Select',
            {
              props: {
                value: multiple
                  ? model[key]
                  : isPlanObject(model[key])
                  ? model[key].value
                  : model[key],
                class: className,
                style,
                disabled,
                placeholder,
                multiple,
                labelInValue: true,
              },
              on: {
                'on-change': (val) => {
                  if (multiple) val = val.map((item) => item.value);
                  this.modelValue(val, model, key);
                },
              },
            },
            (options || []).map((item, i) =>
              h('Option', {
                props: {
                  value: item.value,
                  label: item.label,
                  disabled: item.disabled,
                },
              })
            )
          );
        },
        Boolean: () =>
          h('i-switch', {
            props: {
              value: model[key] || this.$set(model, key, switchFalse || false),
              class: className,
              style,
              'false-value': switchFalse === '' ? false : switchFalse,
              'true-value': switchTrue === '' ? true : switchTrue,
              disabled,
            },
            on: {
              'on-change': (val) => this.modelValue(val, model, key),
            },
          }),
        Radio: (type = 'radio') =>
          h(
            'RadioGroup',
            {
              props: {
                value: model[key],
                class: className,
                style,
                disabled,
              },
              on: {
                input: (val) => this.modelValue(val, model, key),
              },
            },
            (options || []).map((item) =>
              h(
                type === 'radio' ? 'Radio' : 'Radio-button',
                {
                  props: {
                    label: item.value,
                    disabled: item.disabled || false,
                    border,
                  },
                },
                item.label
              )
            )
          ),
        Checkbox: (type = 'checkbox') =>
          h(
            'CheckboxGroup',
            {
              props: {
                value: model[key] || this.$set(model, key, []),
                class: className,
                style,
                disabled,
              },
              on: {
                input: (val) => this.modelValue(val, model, key),
              },
            },

            (options || []).map((item, i) =>
              h(
                type === 'checkbox' ? 'Checkbox' : 'Checkbox-button',
                {
                  props: {
                    label: item.value,
                    disabled: item.disabled || false,
                    value: item.value,
                    border,
                  },
                },
                item.label
              )
            )
          ),
        CheckboxButton: () => typeComponent.Checkbox('checkboxButton'),
        RadioButton: () => typeComponent.Radio('radioButton'),
        Cascader: () =>
          h('Cascader', {
            props: {
              value: model[key] || this.$set(model, key, []),
              class: className,
              data: cascader || [],
              debounce,
              style,
              disabled,
              multiple,
              placeholder,
              filterable: true,
              'collapse-tags-tooltip': true,
            },
            on: {
              input: (val) => this.modelValue(val, model, key),
            },
          }),
        Upload: () => [
          h(
            'Upload',
            {
              props: {
                fileList: model[key] || this.$set(model, key, []),
                class: className,
                action: upload.action || '#',
                autoUpload: false,
                multiple: !!upload.multiple,
                headers: upload.headers || {},
                data: upload.data || {},
                maxSize: upload.maxSize,
                accept: upload.accept,
                type: 'drag',
                disabled,
                onChange: (data) => this.uploadChange(data, model, key),
                onRemove: (data) => this.removeFile(data, model, key),
                onPreview: this.onPreview,
              },
              style: 'display: inline-block;width:58px;',
              on: {
                input: this.modelValue,
              },
            },
            [
              h(
                'div',
                {
                  style: 'width: 58px;height:58px;line-height: 58px;',
                },
                [
                  h('Icon', {
                    type: 'ios-camera',
                    props: {
                      type: 'ios-camera',
                      size: 20,
                    },
                  }),
                ]
              ),
            ]
          ),
          h(
            'Modal',
            {
              props: {
                visible: this.dialogShow,
                modal: false,
              },
              on: {
                close: () => {
                  this.dialogShow = false;
                },
              },
            },

            [
              h('img', {
                class: 'w-full',
                attrs: {
                  alt: 'Preview Image',
                  src: this.previewSrc,
                },
              }),
            ]
          ),
        ],

        // 业务组件
        //  - 服务器选择
        ServerSelect: () =>
          h(JFServerSelect, {
            props: {
              value: model[key] || this.$set(model, key, ''),
              class: className,
              placeholder,
            },
            on: {
              input: (val) => this.modelValue(val, model, key),
            },
          }),
        //  - 角色ID批量添加
        PidBatchSelect: () =>
          h(JFPidBatchQuerySelect, {
            props: {
              value: model[key] || this.$set(model, key, []),
              class: className,
            },
            on: {
              input: (val) => this.modelValue(val, model, key),
            },
          }),
      };

      return flag
        ? h(
            'FormItem',
            {
              props: {
                label,
                prop: key,
              },
              ref: key,
              class: `json_${nanoid()} mb4!`,
            },
            [
              h(
                'div',
                {
                  style:
                    'width:100%;font-size:0.25rem;display:flex;line-height:1rem;color: rgba(75, 85, 99, 0.5); margin-bottom: 0.25rem;',
                },
                description
              ),
              customRender
                ? customRender(h, function (val) {
                    model[key] = val;
                  })
                : typeComponent[type](),
            ]
          )
        : typeComponent[type]
        ? typeComponent[type]()
        : '';
    },
    dragEvent() {
      setTimeout(() => {
        const dragRef = document.querySelector('#draggableRef');
        let movedChild = null;
        let preIndex = null;
        if (dragRef?.children)
          dragRef.children.forEach((child, i) => {
            child.addEventListener('drop', () => {
              const currentIndex = [...dragRef.children].findIndex(
                (item) => item === child
              );
              if (!movedChild || preIndex === currentIndex) return;
              if (preIndex > currentIndex)
                dragRef.insertBefore(movedChild, child);
              else dragRef.insertBefore(movedChild, child.nextSibling);
              preIndex = null;
            });
            child.addEventListener('dragover', (e) => {
              e.preventDefault();
            });

            child.addEventListener('dragstart', () => {
              movedChild = child;
              preIndex = [...dragRef.children].findIndex(
                (item) => item === child
              );
            });
          });
      });
    },
    renderGroup(group, h, model, key) {
      if (model[key]) {
        this.$set(this.groupData, key, model[key]);
        this.dragEvent();
      }
      const groupList = model[key].length
        ? h(
            'Collapse',
            {
              attrs: {
                id: 'draggableRef',
              },
            },
            [
              model[key].map((child, i) =>
                h(
                  'Panel',
                  {
                    attrs: {
                      draggable: true,
                      draggableIndex: i,
                    },
                  },
                  [
                    h(
                      'span',
                      {
                        style:
                          'float:right;display: flex; align-items: center; height: 100%;margin-right:20px',

                        on: {
                          click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            model[key].splice(i, 1);
                          },
                        },
                      },
                      [
                        h(
                          'Icon',

                          {
                            props: { type: 'ios-backspace', size: 18 },
                          }
                        ),
                      ]
                    ),
                    h(
                      'span',
                      {
                        style:
                          'float:right;display: flex; align-items: center; height: 100%;margin-right:20px',

                        on: {
                          click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('move');
                          },
                        },
                      },
                      [
                        h('Icon', {
                          props: { type: 'md-move', size: 18 },
                        }),
                      ]
                    ),
                    h(
                      'div',
                      {
                        slot: 'content',
                      },
                      group.map((item) =>
                        this.getTypeComponent(
                          h,
                          item,
                          this.groupData[key][i] ||
                            this.$set(this.groupData[key], i, {}),
                          true
                        )
                      )
                    ),
                  ]
                )
              ),
            ]
          )
        : '';

      return h('div', { style: 'font-size:0;' }, [
        groupList,
        model[key].length
          ? h(
              'Button',
              {
                style: 'width:100%',
                on: {
                  click: () => {
                    this.groupData[key].push({});
                    this.$set(model, key, this.groupData[key]);
                    console.log(model[key]);
                    this.forceUpdate();
                  },
                },
              },
              '+ 新增'
            )
          : h(
              'Button',
              {
                style:
                  'width:100%;padding:48px 0;display:flex;justify-content:center;align-items:center;',
                on: {
                  click: () => {
                    this.groupData[key].push({});
                    this.$set(model, key, this.groupData[key]);
                    console.log(model[key]);
                    this.forceUpdate();
                  },
                },
              },
              '创建组'
            ),
      ]);
    },
    renderForm(h, form = {}) {
      const groupKeys = [];
      Object.keys(form).forEach((key) => {
        const item = form[key];
        if (!item.group) return;
        groupKeys.push(item.key);
        if (!this.groupData[item.key]) this.$set(this.groupData, item.key, []);
        this.model[item.key] = this.model[item.key] || [];
      });
      this.groupKeys = groupKeys;
      return Object.keys(form).reduce((formList, key) => {
        const {
          colorTitle,
          label,
          rules = [],
          required,
          description,
          show,
          validator,
          customRender,
          type,
        } = form[key];
        const formItemClass = `json_${nanoid()} jf-item-${type.toLowerCase()}`;
        setTimeout(() => this.judgeShow(formItemClass, show));

        // 规则检验
        this.validators(validator, key, rules, required);

        // 注入style
        this.insertStyle(colorTitle, formItemClass, label);

        formList.push(
          h(
            'FormItem',
            {
              props: {
                label,
                prop: key,
              },
              class: formItemClass,
              ref: key,
            },
            [
              h(
                'div',
                {
                  class: 'mb1 w-full text-1 flex lh-1 text-gray-500',
                },
                description
              ),
              customRender
                ? customRender(h, function (val) {
                    this.model[key] = val;
                  })
                : this.getTypeComponent(h, form, this.model, key),
            ]
          )
        );
        return formList;
      }, []);
    },
    insertStyle(colorTitle, formItemClass, labelShow) {
      styles += `
          .${formItemClass} .ivu-form-item-label{
              padding:0!important;
              margin-bottom:4px;
            }
          `;
      if (colorTitle) {
        styles += `
                    .${formItemClass} .ivu-form-item-label{
                      color:${colorTitle};
                      ${!labelShow ? 'visibility: hidden' : ''}
                    }
                    `;
      } else if (!labelShow) {
        styles += `.${formItemClass} .ivu-form-item-label{
                visibility: hidden;
                    }
                    `;
      }
    },
    getMapJSON(value = this.getFormData()) {
      const mapValues = Object.values(this.map);
      return Object.assign(
        Object.keys(value).reduce((result, key) => {
          if (!mapValues.includes(key)) result[key] = value[key];
          return result;
        }, {}),
        mapTransformBack(value, this.map)
      );
    },
    forceUpdate() {
      this.count++;
    },
  },
  render(h) {
    this.count;
    return this.schema
      ? h(
          'div',
          {
            style: {
              textAlign: 'left',
            },
            class: 'json_schema',
          },
          [
            h(
              'h3',
              {
                class: 'text-2xl mb-2',
              },
              this.schema.name
            ),
            h(
              'h1',
              {
                class: 'text-sm mb-3',
              },
              this.schema.description
            ),
            h(
              'Form',
              {
                props: {
                  ref: 'formEl',
                  model: this.model,
                  rules: this.rules,
                  class: this.schema.class,
                },
                ref: 'jsonFormEL',
              },
              wrapper.call(this, this.renderForm(h, this.schema.attribs))
            ),
          ]
        )
      : '';

    function wrapper(data = []) {
      if (remove) remove();
      remove = addStyle(styles);
      return data;
    }
  },
};
</script>
