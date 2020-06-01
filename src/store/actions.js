import Vue from "vue";

export const setTradeResult = ({ state, commit }, tradeResult) => {
  commit("updateTradeResult", tradeResult);
  let tradeData = {
    purchase: state.purchase,
    sale: state.sale
  }
  console.log(state.purchase)
  Vue.http.put("https://product-e2760.firebaseio.com/trade-result.json", tradeData)
    .then(response => {
      console.log(response);
    })
}
export const getTradeResult = ({ commit }) => {
  Vue.http.get("https://product-e2760.firebaseio.com/trade-result.json")
    .then(response => {
      console.log(response);
      commit("updateTradeResult", response.body);
    })

}