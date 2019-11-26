import { get, post } from './http'

export default class {
    constructor (opts = {}) {
        return this.fetch(Object.entries(opts))
    };

    fetch (opts) {
        opts.forEach(([key, val]) => {
            let params = {
                url: val.url || 'GET',
                options: val.options,
            }
            if (val.methods.toUpperCase() === 'GET') {
                Object.assign(this, {
                    [key]: (data, opt) => get(Object.assign( params, opt && { options: opt } || {}, { data } ))
                })
            } else if (val.methods.toUpperCase() === 'POST') {
                Object.assign(this, {
                    [key]: (data, opt) => post(Object.assign( params, opt && { options: opt} || {}, { data } ))
                })
            }
        });
    };

}  