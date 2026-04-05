<script setup lang="ts">
import RenalTypeAPI from '@/Api/Business/Renal/RenalTypeAPI';
import { RenalTypeDTO } from '@/models/Business/Renal/RenalTypeDTO';

const datarennalTypes = ref<RenalTypeDTO[]>([])

const getdatas = async () => {
  await RenalTypeAPI.GetAll("").then((res) => {
    console.log(res);
    datarennalTypes.value = res;
  }).catch((err) => { console.log(err) })
}

onMounted(() => {
  getdatas();
})

const moreMenuList = [
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Download', value: 'Download' },
  { title: 'View All', value: 'View All' },
]

const addNewItem = (val: RenalTypeDTO) => {
  datarennalTypes.value.push(val)
}

const updateItem = (val: RenalTypeDTO) => {
  datarennalTypes.value = datarennalTypes.value.filter(x => x.id !== val.id);
  datarennalTypes.value.push(val)
}

const renalData = ref<RenalTypeDTO>()

const rennaltypeVisible = ref(false)
const rennaltypeVisibleUpdate = ref(false)

const OpenUpdateRenalType = (val: RenalTypeDTO) => {
  renalData.value = val;
  rennaltypeVisibleUpdate.value = true;
}

const Deleteitem = async (item: RenalTypeDTO) => {
  await RenalTypeAPI.Delete(item.id).then((res) => {
    datarennalTypes.value = datarennalTypes.value.filter(x => x.id !== res);
  }).catch((err) => { console.error(err) })
}
</script>

<template>
  <div>
    <AddEditRennalType :data="renalData" v-on:updated-data="updateItem" :is-dialog-visible="rennaltypeVisibleUpdate"
      v-on:update:is-dialog-visible="rennaltypeVisibleUpdate = $event" />
    <AddEditRennalType v-on:add:data="addNewItem" :is-dialog-visible="rennaltypeVisible"
      v-on:update:is-dialog-visible="rennaltypeVisible = $event" />
    <VCard title="Monthly Campaign State" subtitle="8.52k Social Visitors">
      <template #append>
        <div class="mt-n4 me-n2">
          <MoreBtn :menu-list="moreMenuList" />
        </div>
      </template>

      <VCardText>
        <VList class="card-list">
          <VListItem v-for="item in datarennalTypes" :key="item.id">
            <template #prepend>
              <VAvatar :color="item.color" variant="tonal" size="34" rounded>
                <VIcon :icon="'tabler-' + item.tablerIcon" />
              </VAvatar>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ item.name }}
            </VListItemTitle>

            <template #append>
              <IconBtn @click="OpenUpdateRenalType(item)">
                <VIcon color="warning" icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="Deleteitem(item)">
                <VIcon color="error" icon="tabler-trash" />
              </IconBtn>
            </template>
          </VListItem>
          <VListItem @click="rennaltypeVisible = true">
            <template #prepend>
              <VAvatar color="primary" variant="tonal" size="34" rounded>
                <VIcon icon="tabler-new-section" />
              </VAvatar>
            </template>

            <VListItemTitle class="font-weight-medium">
              Create
            </VListItemTitle>

            <template #append>
              <IconBtn @click="rennaltypeVisible = true">
                <VIcon icon="tabler-new-section" />
              </IconBtn>
            </template>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 26px;
}
</style>
