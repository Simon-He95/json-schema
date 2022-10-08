<template>
  <Select class="server-select" :placeholder="placeholder" v-model="innerValue">
    <Option
      v-for="option in serversData"
      :key="option.id"
      :value="option.id"
      >{{ option.name }}</Option
    >
  </Select>
</template>

<script>
import { servers } from './server.gql';
import { getJSONString, getInt } from '../../../utils/utils'

export default {
  name: 'ServerSelect',
  props: {
    placeholder: String,
    value: String | Number,
  },

  data () {
    return {
      serversData: {},
      innerValue: '',
    }
  },

  watch: {
    value: {
      deep: true,
      handler (val, prevVal) {
        console.log('==value', val)
        if (val !== prevVal) {
          this.innerValue = getInt(val)
        }
      },
    },

    innerValue: {
      deep: true,
      handler (val, prevVal) {
        console.log('==innerValue', val)
        if (val !== prevVal) {
          this.$emit('input', getInt(val))
        }
      },
    },
  },

  apollo: {
    // 服务列表接口
    servers: {
      query() {
        return servers;
      },
      variables() {
        return {
          page: 1,
          first: 50,
          order_by: '[{ field: "id", order: DESC }]',
        };
      },
      throttle: 800,
      manual: true,
      result({ data, loading }) {
        if (!loading && data) {
          console.error(' ----- apollo servers result ----- ', data, 'servers');

          this.servers = getJSONString(data['servers'].data);

          this.setServersMap(data['servers'].data);
        }
      },
    },
  },

  methods: {
    setServersMap(data = []) {
      const serversMap = {};
      data.forEach((item) => {
        serversMap[item.id] = {
          ...item,
          id: getInt(item.id)
        };
      });
      this.serversData = serversMap;
    },
  },
}
</script>