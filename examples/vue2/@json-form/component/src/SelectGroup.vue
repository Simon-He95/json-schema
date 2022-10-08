<template>
  <div>
    <Form flex="~ gap1">
      <FormItem w-full label="标题">
        <Input v-model="label" placeholder="请输入组名" @input="change" />
      </FormItem>
      <FormItem w-full label="键名">
        <Input v-model="key" placeholder="请输入组key" @input="change" />
      </FormItem>
      <FormItem w-full label="选择已有组">
        <Select
          v-model="value"
          filterable
          placeholder="选择已有组"
          :label-in-value="true"
          @on-change="changeHandler"
        >
          <Option
            v-for="(option, index) in groups"
            :key="index"
            :value="option.value"
            >{{ option.label }}</Option
          >
        </Select>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { nanoid } from 'nanoid';
export default {
  props: {
    currentGroup: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      value: '',
      label: '',
      key: '',
      id: '',
      groups: [],
      groupName: '',
    };
  },
  mounted() {
    const { label, key, id, value } = this.currentGroup;
    const { commonList } = this.$store.state.jsonFormStore;
    const options = [];
    Object.keys(commonList).forEach((key) => {
      const item = commonList[key];
      item.children.forEach((child) => {
        options.push({
          label: key + '-' + child.name,
          value: child.id,
        });
      });
    });
    this.groups = options;
    this.value = value;
    this.label = label;
    this.id = id;
    this.key = key;
  },
  methods: {
    changeHandler(choose) {
      const { label, value } = choose;
      this.value = value;
      this.groupName = label;
    },
    save() {
      return {
        value: this.value,
        label: this.label,
        key: this.key,
        id: this.id || nanoid(),
        groupName: this.groupName,
      };
    },
  },
};
</script>

<style scoped>
>>> .ivu-select-single .ivu-select-selection {
  height: auto;
}
</style>
