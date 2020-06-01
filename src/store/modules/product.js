import Vue from 'vue';
import { router } from '../../router';

const state = {
    products: []
}
const getters = {
    getProducts(state) {
        return state.products;
    },
    getProduct(state) {
        return key => state.products.filter(element => {
            return element.key == key;
        })
    }
}
const mutations = {
    updateProductList(state, product) {
        state.products.push(product);
    }
}
const actions = {
    initApp({ commit }) {
        // Kayıtları Ürün listesine yazdırıyoruz
        Vue.http.get("https://product-e2760.firebaseio.com/products.json")
            .then(response => {
                let data = response.body;
                for (let key in data) {
                    data[key].key = key;
                    commit("updateProductList", data[key])
                }
            })
    },
    saveProduct(VuexContext, product) {
        return Vue.http.post("https://product-e2760.firebaseio.com/products.json", product)
            .then((response) => {
                /// ürün listesi güncellemesi
                product.key = response.body.name;
                VuexContext.commit("updateProductList", product);
                /// Alış satış bakiye güncellemesi

                let tradeResult = {
                    purchase: product.price,
                    count: product.count,
                    sale: 0,

                }
                VuexContext.dispatch("setTradeResult", tradeResult);
                router.replace("/");

            })
        //Vue Resource

    },
    sellProduct({ state,dispatch }, payload) {
        let product = state.products.filter(element => {
            return element.key == payload.key;
        })
        if (product) {
            let totalCount = product[0].count - payload.count;
            Vue.http.patch("https://product-e2760.firebaseio.com/products/" + payload.key + ".json", { count: totalCount })
                .then(response => {
                    console.log(response);
                    product[0].count = totalCount;
                    let tradeResult = {
                        purchase: 0,
                        count: payload.count,
                        sale: product[0].price,

                    }
                    dispatch("setTradeResult", tradeResult);
                    router.replace("/");
                })
        }
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}