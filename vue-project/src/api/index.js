import { get, post } from './http'

export default class {
    constructor (opts = {}) {
        return this.fetch(Object.entries(opts))
    };

    fetch (opts) {
        opts.forEach(([key, val]) => {
            let params = {
                url: val.url,
                options: val.options,
            }
            if (val.methods === 'GET') {
                Object.assign(this, {
                    [key]: (data) => get(Object.assign(params,{data}))
                })
            } else if (val.methods === 'POST') {
                Object.assign(this, {
                    [key]: (data) => post(Object.assign(params,{data}))
                })
            }
        });
        window.api = this
        console.log('this=>', this);
    };

}  