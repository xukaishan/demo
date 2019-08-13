import Vue from 'vue'
import RowItem from '@/components/RowItem.vue'


   function install(){
        if (install.installed) return;
        install.installed = true;
        Vue.component('RowItem', RowItem)

    }
    Vue.use(install)

export default plugin