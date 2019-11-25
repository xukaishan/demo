import X_API from "./index";

const api = new X_API({
    getList: {
        url: '/api/list/getList',
        methods: 'GET',
    },
    updateList: {
        url: '/api/list/updateList',
        methods: 'POST',
        options: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    },
    updateUser: {
        url: '/api/list/updateUser',
        methods: 'POST',
        options: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        },
    },
});

export default api;