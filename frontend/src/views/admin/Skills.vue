<template>
    <div class="dashboard__skills">
        <div class="panel__header">
            <h3>Скилы</h3>
            <button @click="openModal">
                Создать скилл
            </button>
        </div>
        <div class="skill-counter">
            <span>Всего скилов: </span>
            <b>{{ skillsAdmin?.length }}</b>
        </div>

        <BaseModal
            :modalWidth="480"
            :isOpenModal="isOpenModal"
            @closeModal="closeModal"
        >
            <CreateSkillForm />
        </BaseModal>
        <ConfirmModal
            :isOpenModal="isOpenConfirmModal"
            @closeModal="closeConfirmModal"
            @giveResponse="event => confirmAction(event)"
        >
            <div class="h3">Вы действительно хотите удалить скилл?</div>
        </ConfirmModal>
    </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
// import SkillCard from '@/components/admin/Skill/SkillCard.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import CreateSkillForm from '@/components/Admin/Skill/CreateSkillForm.vue'
import ConfirmModal from '@/components/Modal/ConfirmModal.vue'
import { useSkillStore } from '@/stores/skillStore'

const skillStore = useSkillStore()

const isOpenModal = ref(false)
const isOpenConfirmModal = ref(false);
const skillIdForDelete = ref();

const skillsAdmin = computed(() => skillStore.skillsAdmin)

const updateSkill = async(data) => {
    await skillStore.updateSkill(data)
}

const deleteSkill = (id) => {
    skillIdForDelete.value = id
    isOpenConfirmModal.value = true
}

const confirmAction = async (event) => {
    if(event) {
        await skillStore.deleteSkill(skillIdForDelete.value)
        isOpenConfirmModal.value = false;
    } else {
        isOpenConfirmModal.value = false;
    }
}

const openModal = () => {
    isOpenModal.value = true
}

const closeModal = () => {
    isOpenModal.value = false
}

const closeConfirmModal = () => {
    isOpenConfirmModal.value = false;
}

onMounted(() => {
  skillStore.fetchSkillsAdmin()
})
</script>