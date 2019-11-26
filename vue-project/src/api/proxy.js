import X_API from "./index";

const api = new X_API({
    getList: {
        url: '/api/list/getList',
        methods: 'GET',
    },
    updateList: {
        url: '/api/list/updateList',
        methods: 'post',
        options: {
            headers: {
                'Content-Type': 'application/json',
                'orgId':3333
            },
        },
    },
    updateUser: {
        url: '/api/list/updateUser',
        methods: 'POST',
        options: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'orgId':4444444,
            },
        },
    },
    updateId: {
        url: '/api/list/updateId',
        methods: 'POST',
        options: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    },
    importThematic: {
        url: '/api/resource/solr/thematic/import',
        methods: 'POST',
        options: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        },
    },
});

export default api;