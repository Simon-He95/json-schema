// import Util from '../common';
import { SUCommon } from '@silent-manage/util';
import Vue from 'vue';
import _ from 'lodash';
import md5 from 'md5';

const inventory = {
  path: (path) => {
    let p = path.split('/');
    console.log(p);
    let data = {
      // namespace: p[2],
      table: p[1],
      suffix: p[2] || '',
    };
    return data;
  },
  data: (inventory, basis) => {
    const obj = {
      schema: {
        main: null,
        top: null,
        remove: null,
        disable: null,
        destroy: null,
        restore: null,
        table: {
          label: true,
          collect: true,
        },
      },
      apollo: {
        // 延迟加载的阻断
        skip: { first: true, second: true, other: true },
        // 刷新
        refresh: false,
        table: basis.table,
        suffix:
          '-' + basis.namespace + '-' + basis.company + '-' + basis.suffix,
      },
      // 分页信息
      page: {
        // 分页等级
        paging: {
          opts: [10, 20, 50, 100, 200, 500, 1000],
          change: false, // 当翻页时开启这个
        },
        change: false,
        memory: {},
        value: 0,
        total: 0,
        // 被删除数据
        trash: 0,
      },
      // 批量操作
      command: {
        // 选框
        checkbox: { ids: [], lists: {}, isAll: false },
        // 选中 ID
        // selected: [],
        lists: [{ value: 'do', label: '批量操作', text: '批量操作' }],
      },
      options: {},
      recycle: null,
    };
    let deep = _.cloneDeep(obj);
    deep.schema = Object.assign(deep.schema, inventory.schema);
    deep.apollo = Object.assign(deep.apollo, inventory.apollo);
    deep.page = Object.assign(deep.page, inventory.page);
    deep.command = Object.assign(deep.command, inventory.command);
    if (deep.schema.disable) {
      deep.command.lists.push({
        value: 'enable',
        label: '启 用',
        text: '<font color="#2b85e4">启 用</font>',
      });
      deep.command.lists.push({
        value: 'disable',
        label: '禁 用',
        text: '<font color="#ff9900">禁 用</font>',
      });
    }
    if (deep.schema.remove)
      deep.command.lists.push({
        value: 'remove',
        label: '删 除',
        text: '<font color="#ed4014">删 除</font>',
      });
    if (deep.schema.destroy)
      deep.command.lists.push({
        value: 'destroy',
        label: '销 毁',
        text: '<font color="#ed4014">销 毁</font>',
      });
    if (deep.schema.restore)
      deep.command.lists.push({
        value: 'restore',
        label: '恢 复',
        text: '<font color="#19be6b">恢 复</font>',
      });
    // -
    deep.options = Object.assign(deep.options, inventory.options);
    deep.recycle = deep.schema.remove ? 'WITHOUT' : null;
    return Object.assign({}, inventory, deep);
  },
  /*
   * 选项值
   * 默认每页最少条数
   * 是否为回收站
   * */
  variables: (opts, self, pageSize, recycle) => {
    let data = {
      system: {
        program:
          opts.system && opts.system.program
            ? opts.system.program
            : self.program,
        schema:
          opts.system && opts.system.schema ? opts.system.schema : self.program,
        company: self.company,
        project:
          opts.system && opts.system.project
            ? opts.system.project
            : self.project,
      },
    };
    // let orderBy = inventory.order([{ top_time: false }], opts.orderBy)
    // let namespace = that.schema.name || that.namespace { id: false },
    data.first = opts.pageSize || pageSize;
    data.page = opts.page;
    // { top_time: false }
    data.order_by = inventory.order([], opts.orderBy);
    // ID 多选
    let ids = opts.ids;
    if (opts.search.select === 'id' && opts.search.value !== '') {
      ids = opts.search.value.split(' ');
    }
    if (ids.length > 0) data.ids = ids;
    // 启用/禁用
    if (opts.disable !== 'ALL') data.is_disable = opts.disable;
    // 回收站
    if (recycle) {
      data.trashed = recycle || 'WITH'; // ONLY WITH WITHOUT
    }
    // 时间范围
    if (opts.time.value[0]) {
      if (opts.time.select === 'updated_at') {
        data.updated_at_from = opts.time.value[0] + ':00';
        data.updated_at_to = opts.time.value[1] + ':00';
      } else if (opts.time.select === 'created_at') {
        data.created_at_from = opts.time.value[0] + ':00';
        data.created_at_to = opts.time.value[1] + ':00';
      }
    }
    if (recycle === 'ONLY' && opts.deletedAt && opts.deletedAt[0]) {
      data.deleted_at_from = opts.deletedAt[0] + ' 00:00:00';
      data.deleted_at_to = opts.deletedAt[1] + ' 00:00:00';
    }
    // 搜索
    if (opts.search.value !== '' && opts.search.select !== '') {
      data[opts.search.select] = '%' + opts.search.value + '%';
    }
    return data;
  },
  // 将排序数组转换为 gql 支持的字符串格式
  order: (arr, order) => {
    let str = '';
    arr.forEach((list, i) => {
      str +=
        '{ field: "' +
        Object.keys(list)[0] +
        '", order: ' +
        (Object.values(list)[0] ? 'ASC' : 'DESC') +
        ' }';
    });
    // 此类数据如 属性值为 - 时不上传
    order.forEach((list, i) => {
      let value = Object.values(list)[0];
      if (typeof value !== 'boolean') return;
      str +=
        '{ field: "' +
        Object.keys(list)[0] +
        '", order: ' +
        (value ? 'ASC' : 'DESC') +
        ' }';
    });
    return '[' + str + ']';
  },
  init: {
    options: (that, key) => {
      // console.log(that)
      // let suffix = that.inventory.apollo.suffix
      let options = that.inventory.options;
      key = 'option-' + key;
      if (that.inventory.recycle) {
        if (!Object.prototype.hasOwnProperty.call(localStorage, key))
          that.$ls.set(key, JSON.stringify(options));
        //suffix = suffix + that.recycle
      }
      let value = md5(JSON.stringify(options));
      // JSON.stringify(options) . MD5
      let version = that.$ls.get(key + '-' + ' version');
      // console.log(value, version)
      if (version != value) {
        // console.log('消除 ls options')
        that.$ls.remove(key + '-' + that.inventory.recycle);
        that.$ls.set(key + '-' + ' version', value);
        return;
      }
      let json = that.$ls.get(key + '-' + that.inventory.recycle);
      // console.log('that.inventory.options.page 缓存', key + '-' + that.inventory.recycle, json)
      if (json) {
        // 主代码
        that.inventory.options = Object.assign({}, options, JSON.parse(json));
      }
    },
    collect: (that, key) => {
      let collect = that.$ls.get('collect-' + key);
      if (collect) that.tableCollect = JSON.parse(collect);
    },
    label: (that, key) => {
      let label = that.$ls.get('label-' + key);
      if (label && that.tableLabels) that.tableLabels.data = JSON.parse(label);
    },
  },
  watch: {
    options: (that, key) => {
      key = 'option-' + key;
      that.$watch('inventory.options', {
        handler: function (_new, _old) {
          console.warn('inventory.options', _new);
          let json = JSON.stringify(_new);
          // 支持回收站的页面
          let recycle = that.inventory.recycle;
          console.log(key + '-' + recycle, json);
          if (recycle) {
            // 有删除功能的页面
            that.$ls.set(key + '-' + recycle, json);
          } else {
            // console.warn('常规存储')
            that.$ls.set(key, json);
          }
        },
        deep: true,
      });
      that.$watch('inventory.options.pageSize', (_new, _old) => {
        if (that.inventory.options.page !== 1) {
          that.setOptions('page', 1);
        }
      });
    },
    collect: (that, key) => {
      // 收藏夹
      that.$watch('tableCollect', (_new, _old) => {
        // console.log('tableCollects.record_ids')
        // that.tableCollect.loading = false
        let name = 'collect-' + key;
        if (_new) that.$ls.set(name, JSON.stringify(_new));
        else localStorage.removeItem(name);
      });
    },
    label: (that, key) => {
      // 标签
      that.$watch('tableLabels.data', (_new, _old) => {
        // console.log('tableLabels.data')
        let ids = that.inventory.options.ids;
        if (ids.length > 0) {
          // 消除标签选中后记忆功能导致的选中问题
          let labels = {};
          _new.forEach((item) => {
            labels['i' + item.id] = JSON.stringify(item.record_ids);
          });
          _old.forEach((item) => {
            let recordIdJson = JSON.stringify(item.record_ids);
            if (recordIdJson === JSON.stringify(ids)) {
              if (labels['i' + item.id]) {
                if (recordIdJson !== labels['i' + item.id]) {
                  console.warn('数据变化');
                  that.$nextTick(() => {
                    that.setOptions('ids', []);
                  });
                }
              } else {
                console.warn('消除数据');
                that.$nextTick(() => {
                  that.setOptions('ids', []);
                });
              }
            }
          });
        }
        let name = 'label-' + key;
        if (_new) that.$ls.set(name, JSON.stringify(_new));
        else localStorage.removeItem(name);
      });
    },
    total: (that, key) => {
      // 1、页面主体数据变化 主要是数据正在减少时
      let options = that.inventory.options;
      that.$watch('data.paginatorInfo.total', (_new, _old) => {
        if (options.page > Math.ceil(_new / options.pageSize))
          that.setOptions('page', 1);
      });
    },
    page: (that, key) => {
      if (that.inventory.options.page !== 1) {
        that.$Message.info('您正在第 ' + that.inventory.options.page + ' 页');
      }
      // 2、翻页
      that.$watch('inventory.options.page', (_new, _old) => {
        console.log('options.page A');
        if (_old === 0) {
          console.log('options.page B');
          if (_new !== 1) {
            console.log('options.page C');
            that.$Message.info('您正在第 ' + _new + ' 页');
            return;
          }
        }
        that.inventory.command.checkbox.lists = {};
      });
    },
  },
  start: (that, fun) => {
    let suffix = that.inventory.apollo.suffix;
    let key = that.basis.table + suffix;
    inventory.init.options(that, key);
    inventory.init.collect(that, key);
    inventory.init.label(that, key);
    that.$nextTick(() => {
      inventory.watch.options(that, key);
      inventory.watch.collect(that, key);
      inventory.watch.label(that, key);
      inventory.watch.total(that, key);
      inventory.watch.page(that, key);
      fun();
    });
  },
  command: {
    checkbox: (command, all, ids) => {
      console.log(command, all, ids);
      if (ids === []) {
        console.log(all, ids);
        all.forEach((id) => {
          Vue.set(command.checkbox.lists, 'i' + id, false);
        });
      } else if (all === ids) {
        all.forEach((id) => {
          Vue.set(command.checkbox.lists, 'i' + id, true);
        });
      } else {
        all.forEach((id) => {
          if (SUCommon.inArray(id, ids)) {
            Vue.set(command.checkbox.lists, 'i' + id, true);
          } else {
            Vue.set(command.checkbox.lists, 'i' + id, false);
          }
        });
      }
    },
  },
  apollo: {
    refresh: (apollo, key, fun) => {
      console.log('main.refresh start', apollo, key);
      // that.refresh = true
      // let total = that.data.paginatorInfo.total
      if (typeof apollo.queries[key].refetch !== 'function') {
        if (fun) fun();
        return;
      }
      apollo.queries[key].refetch().then((res) => {
        console.log('main.refresh end', res);
        if (fun) fun();
      });
    },
    main: {
      top(apollo, gql, id, top_time, fun) {
        if (!gql) {
          alert('Missing mutation !');
          return false;
        }
        apollo
          .mutate({
            mutation: gql,
            variables: { id: Number(id), top_time: Number(top_time) },
          })
          .then((res) => {
            console.log(res);
            fun(res.data[gql.definitions[0].name.value]);
          });
      },
    },
    collect: {
      create(apollo, gql, array, table, fun) {
        apollo
          .mutate({
            mutation: gql, // || GQL.common.tableCollectCreate,
            variables: { record_ids: array, admin_open_id: 0, table: table },
          })
          .then((res) => {
            console.log(res);
            fun(res.data[gql.definitions[0].name.value]);
          });
      },
      update(apollo, gql, array, id, fun) {
        console.log('4、collectUpdate');
        // let id = this.tableCollect.id
        let variables = { record_ids: array, id: id };
        // variables.system.schema = (this.schema ? this.schema.name : false) || this.Namespace
        // let suffix = ApolloSuffix(this)
        apollo
          .mutate({
            mutation: gql, // || GQL.common.tableCollectUpdate,
            variables: variables,
          })
          .then((res) => {
            console.log(res);
            if (fun) fun(res.data[gql.definitions[0].name.value]);
          });
      },
      remove(apollo, gql, id, fun) {
        apollo
          .mutate({
            mutation: gql, // || GQL.common.tableCollectRemove,
            variables: { id: id },
          })
          .then((res) => {
            console.log(res);
            fun(res.data[gql.definitions[0].name.value]);
          });
      },
      mutation: (apollo, collect, odj, mutation, fun) => {
        let array = collect.record_ids
          ? JSON.parse(JSON.stringify(collect.record_ids))
          : [];
        if (!collect.id) {
          // console.log('创建')
          array.push(odj.itemId);
          inventory.apollo.collect.create(
            apollo,
            mutation.create,
            array,
            odj.table,
            (res) => {
              fun(res, true);
            }
          );
          return;
        }
        console.log(odj, array);
        let isJoin = false;
        if (odj.is_collect && !SUCommon.inArray(odj.itemId, array)) {
          console.log('加入');
          array.push(odj.itemId);
          isJoin = true;
        } else if (!odj.is_collect && SUCommon.inArray(odj.itemId, array)) {
          // console.log('移出')
          var index = array.indexOf(odj.itemId);
          if (index > -1) array.splice(index, 1);
        }
        if (array.length > 0) {
          inventory.apollo.collect.update(
            apollo,
            mutation.update,
            array,
            collect.id,
            (res) => {
              fun(res, isJoin);
            }
          );
          // CollectUpdate(that, array, message)
        } else {
          // console.log('删除')
          inventory.apollo.collect.remove(
            apollo,
            mutation.remove,
            collect.id,
            (res) => {
              fun(res, false);
            }
          );
        }
        return true;
      },
    },
    label: {
      async create(apollo, gql, variables) {
        let res = await apollo
          .mutate({
            mutation: gql, // || GQL.common.tableLabelCreate,
            variables: variables,
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
        if (res.data) {
          return res.data[gql.definitions[0].name.value];
        }
        return res;
      },
      async update(apollo, gql, variables) {
        let res = await apollo
          .mutate({
            mutation: gql, // || GQL.common.tableLabelUpdate,
            variables: variables,
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
        if (res.data) {
          return res.data[gql.definitions[0].name.value];
        }
        return res;
      },
      remove(apollo, gql, id, fun) {
        apollo
          .mutate({
            mutation: gql, // || GQL.common.tableLabelRemove,
            variables: { id: id },
          })
          .then((res) => {
            fun(res.data[gql.definitions[0].name.value]);
            // console.log(this.suffix)
            // console.log(res)
            // window.$Message.success('标签已删除')
          })
          .catch((err) => {
            // this.look = false
            fun(err);
          });
      },
      mutation: async (apollo, labels, data, mutation, table, fun) => {
        let arr = [];
        labels.forEach((item) => {
          arr['id' + item.id] = item;
        });
        let lists = JSON.parse(JSON.stringify(data));
        // console.log(lists, arr)
        for (let index in lists) {
          let item = lists[index];
          // console.log(item.id_count)
          if (item.id > 1000000) {
            // if (item.id_count === undefined) {
            // 新增
            // item.id_json = item.id_json || '[]'
            item.internal = item.internal || 0;
            // console.log(item)
            // console.log(item.id_json, item.name, item.color)
            console.log('新增 ', item.record_ids, item.name, item.color);
            // return
            let variables = {
              record_ids: item.record_ids,
              name: item.name,
              color: item.color,
              internal: item.internal,
              order: index,
              table: table,
              admin_open_id: 0,
            };
            // console.log(variables)
            fun('loading', index);
            let res = await inventory.apollo.label
              .create(apollo, mutation.create, variables)
              .then((res) => {
                fun('success', index, res);
                return res;
              })
              .catch((err) => {
                fun('error', index, res);
                return err;
              });
            // await this.$apollo.mutate({
            //   mutation: mutation.create,
            //   variables: ,
            // }).then((res) => {
            //   // console.log(this.suffix)
            //   // console.log(res)
            //   this.$Message.success('标签 ' + item.name + ' 已添加')
            //   console.log(res.data['tableLabelCreate' + this.suffix].id)
            // })
          } else {
            // 修改
            let list = arr['id' + item.id];
            console.log(
              '修改 ',
              item.order,
              item.record_ids,
              item.name,
              item.color,
              item.internal
            );
            // console.log(item.id_json, list.id_json, item.name, list.name, item.color, list.color, item.internal, list.internal, item.order, list.order)
            // if (
            //   item.record_ids === list.record_ids &&
            //   item.name === list.name &&
            //   item.color === list.color &&
            //   item.internal === list.internal &&
            //   item.order === list.order
            // ) continue
            // console.log(JSON.stringify(item.record_ids), JSON.stringify(list.record_ids))
            // console.log('提交 ', list.order, list.id_json, list.name, list.color, list.internal, list.id_count)
            // this.labels[index].id_json = item.id_json
            let update = {};
            if (
              JSON.stringify(item.record_ids) !==
              JSON.stringify(list.record_ids)
            )
              update.record_ids = item.record_ids;
            if (item.name !== list.name) update.name = item.name;
            if (item.color !== list.color) update.color = item.color;
            if (item.internal !== list.internal)
              update.internal = item.internal;
            // console.log(item.order, list.order)
            if (item.order !== list.order) update.order = item.order;
            if (JSON.stringify(update) === '{}') {
              continue;
            }
            console.log('提交 ', update);
            update.id = item.id;
            fun('loading', index);
            let res = await inventory.apollo.label
              .update(apollo, mutation.update, update)
              .then((res) => {
                fun('success', index, res);
                return res;
              })
              .catch((err) => {
                fun('error', index, res);
                return err;
              });
            // console.log(res)
            // return
            // await this.$apollo.mutate({
            //   mutation: tableLabelUpdate,
            //   variables: update,
            // }).then((res) => {
            //   // console.log(this.suffix)
            //   // console.log(res)
            //   this.$Message.success('标签 ' + item.name + ' 已修改')
            // })
          }
        }
        console.log('完成');
        fun('finish');
      },
      clear: async (apollo, gql, labels) => {
        // console.log(apollo, gql, labels)
        // let ids = []
        // let labelIds = []
        // let lists = []
        // labels.forEach((item) => {
        //   ids.push(item.id)
        //   item.lists.forEach((label) => {
        //     // console.log(item.lists)
        //     if (!SUCommon.inArray(label.id, labelIds)) {
        //       labelIds.push(label.id)
        //       lists.push(label)
        //     }
        //   })
        // })
        // console.log(lists)
        // ids.forEach((id) => {
        //   lists.forEach((list) => {
        //     var index = list.record_ids.indexOf(id)
        //     if (index > -1) list.record_ids.splice(index, 1)
        //   })
        // })
        // for (let i in lists) {
        //   let list = lists[i]
        //   let variables = { record_ids: list.record_ids, id: list.id }
        //   await inventory.apollo.label.update(apollo, gql, variables)
        // }
        return true;
      },
    },
    perform: async (apollo, lists, command, gpl, fun) => {
      // let lists = that._lists.filter(item => { return that.checkbox.lists['i' + item.id] })
      // let command = that.options.command
      // let variables = {
      //   system: {
      //     schema: (that.schema ? that.schema.name : false) || that.Namespace,
      //   },
      // }
      console.log(fun);
      let task = {
        num: 0,
        add: () => {
          task.num++;
          // console.log('task add' , task.num)
        },
        run: (fun) => {
          task.num--;
          console.log('task run', task.num);
          if (task.num < 1) {
            // console.log('is already')
            fun();
          }
        },
      };
      // console.log(apollo, lists, command, gpl, fun)
      let message = '';
      // let collects = []
      let ids = [];
      switch (command) {
        // 删除
        case 'remove':
        case 'destroy':
          // var collects = Object.assign([], that.collects)
          // console.log(collects)
          lists.forEach((item) => {
            if (!item.is_remove) {
              ids.push(item.id);
            }
          });
          console.log(ids);
          if (ids.length === 0) return;
          // 判断 删除和销毁
          var ql = '';
          if (command === 'remove') {
            if (!gpl.remove) {
              alert('Missing mutation !');
              return;
            }
            message = '批量删除 完成';
            ql = gpl.remove;
          } else {
            if (!gpl.destroy) {
              alert('Missing mutation destroy !');
              return;
            }
            message = '批量销毁 完成';
            ql = gpl.destroy;
          }
          // console.log(gpl)
          await apollo
            .mutate({
              mutation: ql,
              variables: {
                id: ids,
                command: command,
                is_need_permission: true,
              },
            })
            .then((res) => {
              console.log(res);
              console.log(lists);
              lists.forEach((item, key) => {
                // 增加 remove 属性
                item.is_remove = true;
                console.log(item);
              });
              // that.checkbox.lists = {}
              // that.$Message.success(message)
              // apollo, gql, array, id, fun
              // if (command === 'remove' && collects.length > 0) inventory.apollo.collect.update(apollo)
              // if (command === 'destroy' || (command === 'remove' && !gpl.destroy)) inventory.apollo.label.clear(labels, that)
            })
            .finally(() => {
              task.run(fun);
            });
          break;
        // --
        // 恢复数据
        case 'restore':
          if (!gpl.restore) {
            alert('Missing mutation restore !');
            return;
          }
          lists.forEach((item, key) => {
            console.log(item.deleted_at);
            if (!item.deleted_at) return;
            ids.push(Number(item.id));
            console.log(item);
          });
          console.log(command);
          console.log(ids);
          if (ids.length === 0) return;
          await apollo
            .mutate({
              mutation: gpl.restore,
              variables: {
                id: ids,
                command: command,
                is_need_permission: true,
              },
              // update: (store, { data: { removeTicket } }) => {},
            })
            .then((res) => {
              console.log(res);
              lists.forEach((item, key) => {
                // 修改 remove 属性
                item.is_remove = false;
                item.deleted_at = null;
                console.log(item);
              });
              // that.checkbox.lists = {}
              // that.$Message.success('批量恢复 完成')
            })
            .catch(() => {
              /* console.error(error) */
            });
          break;
        // --
        // 启用 禁用
        case 'enable':
        case 'disable':
          if (!gpl.disable) {
            alert('Missing mutation disable !');
            return;
          }
          // console.log('enable disable')
          var is_disable = command === 'disable';
          // var arr = []
          console.log(lists);
          lists.forEach((item) => {
            console.log(item);
            task.add();
            if (item.is_disable !== is_disable) {
              // console.warn('准备 apollo')
              apollo
                .mutate({
                  mutation: gpl.disable,
                  variables: {
                    id: item.id,
                    is_disable: Number(is_disable),
                    is_need_permission: true,
                  },
                })
                .then(() => {
                  item.is_disable = is_disable;
                })
                .finally(() => {
                  task.run(fun);
                });
            } else {
              task.run(fun);
            }
          });
          break;
      }
      // console.warn('返回数据')
      return message;
    },
  },
  query: (lists) => {
    if (!lists.length) return [];
    // console.error(' ----- box query ----- ')
    let isDeedDisable = Object.prototype.hasOwnProperty.call(
      lists[0],
      'is_disable'
    );
    let isDeedCreated = Object.prototype.hasOwnProperty.call(
      lists[0],
      'created_at'
    );
    let isDeedUpdated = Object.prototype.hasOwnProperty.call(
      lists[0],
      'updated_at'
    );
    let date = new Date();
    let year = String(date.getFullYear());
    // -
    lists.forEach((item) => {
      item.id = Number(item.id);
      if (isDeedDisable) {
        item.Is_disable = item.is_disable
          ? '<font color="#aaaaaa">禁用</font>'
          : '<font color="#2d8cf0">启用</font>';
      }
      if (isDeedCreated) {
        if (item.created_at && item.created_at.substr(0, 4) === year) {
          item.Created_at =
            '<div class="right">' +
            (item.created_at ? item.created_at.slice(5, -3) : '-') +
            '</div>';
        } else {
          item.Created_at =
            '<div class="right">' +
            (item.created_at ? item.created_at.slice(0, -3) : '-') +
            '</div>';
        }
      }
      if (isDeedUpdated) {
        if (item.updated_at && item.updated_at.substr(0, 4) === year) {
          item.Updated_at =
            '<div class="right">' +
            (item.updated_at ? item.updated_at.slice(5, -3) : '-') +
            '</div>';
        } else {
          item.Updated_at =
            '<div class="right">' +
            (item.updated_at ? item.updated_at.slice(0, -3) : '-') +
            '</div>';
        }
      }
    });
    return lists;
  },
  excl: (data, head, title) => {
    // console.log(data);
    // console.log(head);
    // console.log(Object.keys(head));
    // console.log(Object.values(head));
    const tHeader = Object.values(head).map((v) => {
      let text = String(v).replace(/<[^>]+>/g, '');
      return text.replace(/^\s+|\s+$/g, '');
    });
    const filterVal = Object.keys(head);
    data = data.map((v) =>
      filterVal.map((j) => {
        let text = String(v[j]).replace(/<[^>]+>/g, '');
        return text.replace(/^\s+|\s+$/g, '');
      })
    );
    return {
      header: tHeader,
      data,
      filename: title,
    };
  },
};
export default inventory;
