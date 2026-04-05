<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const queryParams = ref({})

const mappedData = ref({
  OrderDescription: '',
  TransactionId: '',
  OrderId: '',
  PaymentMethod: '',
  PaymentId: '',
  Success: false,
  Token: '',
  VnPayResponseCode: '',
})

onMounted(() => {
  const query = route.query

  mappedData.value = {
    OrderDescription: query.vnp_OrderInfo || '',
    TransactionId: query.vnp_TransactionNo || '',
    OrderId: query.vnp_TxnRef || '',
    PaymentMethod: query.vnp_CardType || '',
    PaymentId: query.vnp_BankTranNo || '',
    Success: query.vnp_ResponseCode === '00',
    Token: query.vnp_SecureHash || '',
    VnPayResponseCode: query.vnp_ResponseCode || '',
  }

  // Tự động gửi lên backend nếu cần:
})
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">
      Thông tin thanh toán VNPay
    </h2>
    <div v-if="Object.keys(queryParams).length > 0">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Tham số</th>
            <th>Giá trị</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(value, key) in queryParams"
            :key="key"
          >
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Không có tham số nào được truyền trong URL.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-inline-size: 700px;
}
</style>
