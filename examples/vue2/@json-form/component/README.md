# `@silent-manage/component`

## 使用

- formPage 可作为独立组件使用，关联菜单和 table

<!--
  currentPage = { name: 'group', content: 'Content-Type Builder' } // 切换页面
  menuList = [ // 修改菜单名称
     { title: 'base', content: 'create new base type',}
     { title: 'single', content: 'create new single type',}
     { title: 'common', content: 'create new common type',}
  ]
 -->
<formPage :current="currentPage" :menuList="menuList" />

- jsonForm 可作为独立组件使用，关联表单数据
  <!--
    tableData 是table的数据 存储一个个json schema的数组集合
    Methods :{
      getFormData: 获取表单数据
      transformToJson: 获取key映射后的表单数据
      resetFields：重置表单
    }
    tableData 中可针对某个json schema 使用自定义渲染器 [{
      customRender:(h, update) => {
        // 在自定义组件v-model绑定update同步到表单数据
        return h(自定义组件, { props: { update } })
      }
    }]
   -->
  <jsonForm :data="tableData" / >
