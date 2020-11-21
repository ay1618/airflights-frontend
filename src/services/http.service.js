import axios from 'axios';
import * as authService from './auth.service';

export default class Http {
    constructor(status) {
        this.isAuth = !!status && status.auth;

        this.instance = axios.create({
            baseURL: process.env.VUE_APP_API_URL
        });

        return this.init();
    }

    init() {
        let needToPutJwt = this.isAuth;
        this.instance.interceptors.request.use(
            config => {
                if (needToPutJwt) {
                    if (authService.isTokenExpired()) {
                        authService.logOut();
                        return;
                    }
                    config.headers['Authorization'] = `Bearer ${authService.getAccessToken()}`;
                }
                return config;
            },
            error => {
                window.console.error(error);
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(response => {
            //some conds
            return response;
        },
        error => {
            let alertMessage = '';
            if (error.response) {
                alertMessage = error.response.data.message;
            }
            else {
                alertMessage = error.message;
            }
            window.alert(alertMessage);

            return Promise.reject(error);
        });
        
        return this.instance;
    }
}