import Vue from 'vue';
import store from '@/store';
import {CancelToken} from 'axios'
// import Notifications from 'vue-notifyjs'

class BaseProxy {
    constructor(endpoint, parameters = {}) {
        this.endpoint = endpoint;
        this.parameters = parameters;
    }

    setParameters(parameters) {
        Object.keys(parameters).forEach((key) => {
            this.parameters[key] = parameters[key];
        });
        return this;
    }

    setParameter(parameter, value) {
        this.parameters[parameter] = value;
        return this;
    }

    removeParameters(parameters) {
        parameters.forEach((parameter) => {
            delete this.parameters[parameter];
        });
        return this;
    }

    removeParameter(parameter) {
        delete this.parameters[parameter];

        return this;
    }

    submit(requestType, url, data = null) {
        return new Promise((resolve, reject) => {
            Vue.$http[requestType](url + this.getParameterString(), data)
                .then((response) => {
                    let cancel;
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        cancel = c;
                    })
                    resolve(response.data);
                })
                .catch(({err}) => {
                    reject(err);
                });
        });
    }

    all() {
        return this.submit('get', `/${this.endpoint}`);
    }

    select(id) {
        return this.submit('get', `/${this.endpoint}/select`);
    }

    find(id) {
        return this.submit('get', `/${this.endpoint}/${id}`);
    }

    patch(id, data) {
        return this.submit('patch', `/${this.endpoint}/${id}`, data);
    }

    create(item) {
        return this.submit('post', `/${this.endpoint}`, item);
    }

    patchProperty(item) {
        return this.submit('patch', `/${this.endpoint}/${item.id}/${item.propertyKey}/${item.propertyValue}`);
    }

    update(id, item) {
        return this.submit('put', `/${this.endpoint}/${id}`, item);
    }

    translation(id, item) {
        return this.submit('post', `/${this.endpoint}/translation/${id}`, item);
    }

    destroy(id) {
        return this.submit('delete', `/${this.endpoint}/${id}`);
    }



    getParameterString() {
        const parameterString = $.param(this.parameters);
        return parameterString.length === 0 ? '' : `?${parameterString}`;
    }
}

export default BaseProxy;
