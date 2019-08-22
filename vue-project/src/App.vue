<template>
  <div id="app">
    <Layout>
      <!-- <Sider hide-trigger>
        <Menu
          active-key="1-1"
          theme="dark"
          width="auto"
          :open-keys="['1']"
          @on-select="onMenuSelect"
        >
          <div class="layout-logo-left">123</div>
          <Submenu v-for="v in navData" :key="v.id" :name='v.label'>
            <template slot="title">
              <Icon type="ios-navigate"></Icon>{{v.label}}
            </template>
            <Menu-item v-for="item in v.children" :key="item.id" :name="item.path">{{item.label}}</Menu-item>
          </Submenu>
        </Menu>
      </Sider> -->
      <Layout>
        <!-- <Header>
          <div class="avater">
            <img src="http://localhost:3000/upload/avater.jpeg" alt="" width="100%">
          </div>
        </Header> -->
        <Content>
          <div class="mid-content"><router-view /></div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      navData: []
    };
  },
  mounted() {
    this.getNav()
  },
  methods: {
    onMenuSelect(name) {
      this.$router.push(name)
    },
    getNav(){
      this.$get('/getNavData').then(res=>{
        this.navData = res.data
      })
    }
  }
};
</script>

<style scoped lang='less'>
#app {
  font-family: "Helvetica Neue";
  .ivu-layout-sider {
    height: 100vh;
    .ivu-layout-sider-children {
      padding-top: 30px !important;
    }
  }
  .ivu-layout-header{
    display: flex;
    align-items: center;
    .avater{
      border-radius: 20px;
      width: 40px;
    }
  }
  .mid-content{
    height: 90vh;
    // overflow-y: scroll;
  }
 
}
</style>
