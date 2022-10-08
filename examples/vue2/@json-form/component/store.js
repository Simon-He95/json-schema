const jsonForm = {
  namespaced: true,
  state: {
    layout: {
      tutorial: {
        modal: true, // 弹窗动画指导，提示拖拽、关闭按钮
      },
    },
    common: {},
    single: [],
    base: [],
    commonList: {},
    singleList: [],
    baseList: [],
    current: {},
    category: '',
    singleId: '',
    FormSubmits: {},
    loading: false,
    paginatorInfo: {},
    currentMenu: '',
    allData: [],
    createType: '',
    menuRefresher: false,
    menuWrapper: [
      { title: 'Content Manager', icon: 'ios-leaf' },
      { title: 'Content-Type Builder', icon: 'ios-keypad' },
    ],
  },
  mutations: {
    common: (state, data) => {
      state.common = data;
    },
    single: (state, data) => {
      state.single = data;
    },
    base: (state, data) => {
      state.base = data;
    },
    setCurrent: (state, data) => {
      state.current = data;
    },
    setCategory: (state, type) => {
      state.category = type;
    },
    singleId: (state, singleId) => {
      state.singleId = singleId;
    },
    setFormSubmits: (state, tableData) => {
      state.FormSubmits = tableData;
    },
    loading: (state, loading) => {
      state.loading = loading;
    },
    setGroupShow: (state, groupShow) => {
      state.groupShow = groupShow;
    },
    setPaginator: (state, paginatorInfo) => {
      state.paginatorInfo = paginatorInfo;
    },
    resetPageInfo: (state) => {
      state.paginatorInfo = {
        pageCurrent: 1,
      };
    },
    setMenu: (state, currentMenu) => {
      state.currentMenu = currentMenu;
    },
    setGroupData: (state, data) => {
      const { common, base, single } = data;
      state.commonList = common;
      state.baseList = base;
      state.singleList = single;
    },
    setAllData: (state, data) => {
      state.allData = data;
    },
    createType: (state, createType) => {
      state.createType = createType;
    },
    menuRefresher: (state, menuRefresher) => {
      state.menuRefresher = menuRefresher;
    },
  },
};
export default jsonForm;
