<template>
  <div class="home">
    <Menu :list="list"></Menu>
    <button @click="btnFn" ref='btn'>更新</button>
    <Nav :navArr='navArr' @navChange='navChange'/>
  </div>
</template>

<script>
import Menu from "@/components/Menu.vue";
import Nav from "@/components/Period.vue";
export default {
  components: {
    Menu,
    Nav
  },
  data() {
    return {
      list: this.$store.getters["get_menuitems"],
      updateList:[
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
        }
      ],
      navArr: [
        {
          id: "12312",
          name: "小学",
          subjectList: [
            {
              id: "12345",
              name: "语文"
            },
            {
              id: "12344",
              name: "数学"
            },
            {
              id: "12343",
              name: "英语"
            },
            {
              id: "12342",
              name: "马来语"
            }
          ]
        },
        {
          id: "12382",
          name: "初中",
          subjectList: [
            {
              id: "12385",
              name: "语文"
            },
            {
              id: "12384",
              name: "数学"
            },
            {
              id: "12383",
              name: "英语"
            },
            {
              id: "12382",
              name: "马来语"
            }
          ]
        }
      ],
    };
  },
  computed: {
    cp_menuitems() {
      return this.$store.getters["get_menuitems"];
    }
  },
  watch: {
    cp_menuitems: {
      immediate: true,
      deep: true,
      handler(val) {
        this.list = val
      }
    }
  },
  mounted() {
     console.log(this.$el);
  },
  methods: {
    /* 递归换键名 */
    cpt_menu(arr) {
      return arr.map(itm => {
        return (
          (itm.children &&
            itm.children.length && {
              id: itm.index,
              tit: itm.label,
              children: this.cpt_menu(itm.children)
            }) || { id: itm.index, tit: itm.label }
        );
      });
    },
    btnFn() {
    
      this.$store.dispatch('ac_update_menu',this.updateList)
    },
    navChange(data){
      console.log(data)
    }
  }
};
</script>

<style scoped lang="less">
</style>