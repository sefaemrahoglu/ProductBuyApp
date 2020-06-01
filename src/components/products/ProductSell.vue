<template>
  <div class="container">
    <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 offset-3 pt-3 card mt-5 shadow">
        <div class="card-body">
          <h3>Ürün Çıkışı</h3>
          <hr />
          <div class="form-group">
            <label>Ürün Adı</label> 
            <select class="form-control" v-model="selectedProduct" @change="productSelected">
              <option
                :disabled="product.count==0"
                v-for="(product, index) in getProducts"
                :value="product.key"
                :key="index"
              >{{product.title}}</option>
            </select>
          </div>
          <transition name="fade" mode="out-in">
            <div class="card mb-2 border border-danger" v-if="product !== null">
              <div class="card-body">
                <div class="row">
                  <div class="col-12 text-center">
                    <div class="mb-3">
                      <span class="badge badge-info">Stok : {{product.count}}</span>
                      <span class="badge badge-primary">Fiyat : {{product.price}}</span>
                    </div>
                    <p
                      class="border border-warning p-2 text-secondary"
                    >Açıklama : {{product.description}}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div class="form-group">
            <label>Adet</label>
            <input
              type="text"
              v-model="product_count"
              class="form-control"
              placeholder="Ürün adetini giriniz.."
            />
          </div>
          
          <hr />
          <button class="btn btn-primary" :disabled="saveEnabled" @click="save">Kaydet</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../../mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      selectedProduct: null,
      product: null,
      product_count: null,
      saveButtonClicked: false
    };
  },
  computed: {
    ...mapGetters(["getProducts"]),
    saveEnabled() {
      if (this.selectedProduct !== null && this.product_count > 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    productSelected() {
      this.product = this.$store.getters.getProduct(this.selectedProduct)[0];
    },
    save() {
      this.saveButtonClicked = true;
      let product = {
        key: this.selectedProduct,
        count: this.product_count
      };
      this.$store.dispatch("sellProduct", product);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      (this.selectedProduct !== null || this.product_count > 0) &&
      !this.saveButtonClicked
    ) {
      if (
        confirm(
          "Kaydedilmemiş değişiklikler var. Yine de çıkmak istiyor musunuz?"
        )
      ) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>

<style scoped>
.border-danger {
  border-style: dashed !important;
}
</style>