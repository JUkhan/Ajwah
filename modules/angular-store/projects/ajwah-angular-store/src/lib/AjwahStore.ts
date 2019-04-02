export const AjwahStore = {
    install(Vue: any, options: { states: any[], effects?: any[], devTools?: any }) {
        Vue.prototype.$tore = 'myStore';
    }
}