<script setup lang="ts">
import pages3 from '@images/pages/3.png'
import pages2 from '@images/pages/2.png'
import pages1 from '@images/pages/1.png'

const isCardDetailsVisible = ref(false);
const isDialogVisible = ref(false)
</script>
<template>
  <AddEditRenalType v-model:is-dialog-visible="isDialogVisible" />
  <VBtn @click="isDialogVisible = true">Opendialog</VBtn>
  <VRow>
    <VCol cols="12" md="4" sm="6">
      <VCard>
        <ImageGallery :images="[
          pages3,
          pages2,
          pages1
        ]" />

        <VCardItem>
          <VCardTitle>Popular Uses Of The Internet</VCardTitle>
        </VCardItem>

        <VCardText>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Details
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
              sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
              you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
              to
              escape.
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
    <VCol cols="12" md="4" sm="6">
      <VCard>
        <ImageGallery :images="[
          pages3,
          pages3,
          pages3
        ]" />

        <VCardItem>
          <VCardTitle>Popular Uses Of The Internet</VCardTitle>
        </VCardItem>

        <VCardText>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Details
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
              sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
              you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
              to
              escape.
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
    <VCol cols="12" md="4" sm="6">
      <VCard>
        <ImageGallery :images="[
          pages3,
          pages3,
          pages3
        ]" />

        <VCardItem>
          <VCardTitle>Popular Uses Of The Internet</VCardTitle>
        </VCardItem>

        <VCardText>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Details
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
              sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
              you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
              to
              escape.
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
    <VCol cols="12" md="4" sm="6">
      <VCard>
        <ImageGallery :images="[
          pages3,
          pages3,
          pages3
        ]" />

        <VCardItem>
          <VCardTitle>Popular Uses Of The Internet</VCardTitle>
        </VCardItem>

        <VCardText>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Details
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
              sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
              you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
              to
              escape.
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
    <VCol cols="12" md="4" sm="6">
      <VCard>
        <ImageGallery :images="[
          pages3,
          pages3,
          pages3
        ]" />

        <VCardItem>
          <VCardTitle>Popular Uses Of The Internet</VCardTitle>
        </VCardItem>

        <VCardText>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Details
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
              sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
              you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
              to
              escape.
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
    <VCol cols="12" md="4" sm="6">
      <VCard>
        <ImageGallery :images="[
          pages3,
          pages3,
          pages3
        ]" :auto="false" :interval="3000" />

        <VCardItem>
          <VCardTitle>Popular Uses Of The Internet</VCardTitle>
        </VCardItem>

        <VCardText>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Details
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
              sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
              you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
              to
              escape.
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
