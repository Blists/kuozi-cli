import vm from "../../index";
export default {
    state: {
        conn: null,
        // 我的圈子的id
        groupIds: [],
        // 圈子未读消息
        groupUnRead: {}
    },
    mutations: {
        // 初始化我的圈子和新动态
        initGroup(state, groups) {
            state.groupIds = groups.map(v => v.groupId);
            for (let group of groups) {
                vm.$set(state.groupUnRead, group.groupId, { num: group.num });
            }
        },
        // 设置我的圈子ids
        setGroupIds(state, groupIds) {
            state.groupIds = groupIds;
        },
        // 圈子新动态+1
        groupUnRead(state, { groupId }) {
            groupId = groupId / 1;
            // 查看groupId是否是我的圈子的id
            if (state.groupIds.findIndex(v => v == groupId) >= 0) {
                if (state.groupUnRead[groupId]) {
                    state.groupUnRead[groupId].num += 1;
                } else {
                    vm.$set(state.groupUnRead, groupId, { num: 1 });
                }
            }
        },
        // 阅读圈子新动态
        groupRead(state, groupId) {
            if (state.groupUnRead[groupId]) {
                state.groupUnRead[groupId].num = 0;
            }
        }
    },
    actions: {
        // 查询我的圈子
        queryGroup({ commit }) {
            vm.$get("listSelfGroup").then(res => {
                // 设置我的圈子ids
                commit("setGroupIds", res.map(v => v.id));
            });
        }
    }
};
