import vue from 'vue'
import Vuex from 'vuex'
vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        menuitems: [{
            index: "01",
            label: "一级菜单01",
            children: [
                {
                    index: "010201",
                    label: "二级菜单01"
                },
                {
                    index: "010202",
                    label: "二级菜单02",
                    children: [
                        {
                            index: "010301",
                            label: "三级菜单01"
                        },
                        {
                            index: "010302",
                            label: "三级菜单02",
                            children: [
                                {
                                    index: "010401",
                                    label: "四级菜单01"
                                },
                                {
                                    index: "010402",
                                    label: "四级菜单02"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            index: "02",
            label: "一级菜单02",
            children: [
                {
                    index: "020201",
                    label: "二级菜单01"
                },
                {
                    index: "020202",
                    label: "二级菜单02"
                }
            ]
        }]
    },
    actions: {
        ac_update_menu({state,commit},params=[]){
            setTimeout(()=>{
                commit('mu_update_menu',params)
            },500)
        }
    },
    mutations: {
        mu_update_menu(state,params){
            state.menuitems=params
        }
    },
    getters: {
        get_menuitems(state) {
            return state.menuitems
        }
    }
})
export default store