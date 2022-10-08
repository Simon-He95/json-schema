<template>
  <JFBatchQuerySelect
    v-model="values"
    class="jf-batch-query-select"
    primaryKey="pid"
    :options="options"
    :columns="columns"
    :defaultValue="defaultValue"
    :searchHandler="handlePidSearch"
    :styleConfig="{ width: '100%' }"
  >
    <template #time="{ row }">
      {{ formatUnixDate(row.time) }}
    </template>

    <div class="batch-query-select-server">
      <JFServerSelect v-model="serverId" placeholder="选择服务器" />
    </div>
  </JFBatchQuerySelect>
</template>

<script>
import { gamePlayers } from './gamePlayers.gql';
import JFServerSelect from '../serverSelect';
import JFBatchQuerySelect from '../batchQuerySelect.vue';
import { formatUnixDate } from '../../../utils/date';

const pidOptions = {
  pid: '角色ID',
  xdid: '心动ID',
  tap_id: 'Tap ID',
};

const pidColumns = [
  {
    title: '角色名',
    key: 'name',
  },
  {
    title: '角色ID',
    key: 'pid',
  },
  {
    title: '创角时间',
    slot: 'time',
  },
  {
    title: '操作',
    slot: 'action',
  },
];

export default {
  name: 'PidBatchQuerySelect',
  components: {
    JFServerSelect,
    JFBatchQuerySelect,
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    this.options = pidOptions;
    this.columns = pidColumns;

    return {
      values: [],
      serverId: '',
    };
  },

  watch: {
    values: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      },
    },
  },

  methods: {
    formatUnixDate,

    // 点击pid查询按钮
    handlePidSearch(values = {}) {
      const serverId = parseInt(this.serverId);

      if (isNaN(serverId)) {
        this.$Message.error('请先选择服务器');
        return Promise.reject();
      }

      let idType;
      let ids;

      Object.entries(values).forEach(([field, value]) => {
        idType = field;
        ids = value;
      });

      return this.getPids({
        sid: serverId,
        id_type: idType,
        ids: ids,
      });
    },

    // 查询pid
    getPids(params = {}) {
      const mergedParams = {
        ...params,
      };

      return this.$apollo
        .query({
          query: gamePlayers,
          variables: mergedParams,
        })
        .then(({ data = {} }) => {
          return data.gamePlayers || [];
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.batch-query-select-server {
  flex-grow: 1;

  ::v-deep {
    .server-select {
      width: 300px;
    }
  }
}
</style>