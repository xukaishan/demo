
<script>
import Ueditor from "./Index.vue";
export default {
  name: "UeditorBase",
  extends: Ueditor,
  props: {},
  data() {
    return {
      myData: [
        {
          label: "用户管理",
          num: 0,
          comp: "RowItem"
        },
        {
          label: "通讯录管理",
          num: 1,
          comp: "ButtonBase"
        },
        {
          label: "角色管理",
          num: 2,
          comp: "RowItem"
        },
        {
          label: "权限管理",
          num: 3,
          comp: "ButtonBase"
        }
      ],
      defaultOptions: {
        fontSize: 12,
        width: 70,
        heigth: 40,
        borderRadius: 20,
        color: "red",
        background: "#ccc"
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="">
</style>
