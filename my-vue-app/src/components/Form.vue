<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const formData = ref({
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
});

const errors = ref({
  username: null,
  password: null,
  isAustralian: null,
  gender: null,
  reason: null,
})

const validateName = (blur) => {
  if(formData.value.username.length < 3){
    if(blur) errors.value.username = "Username must be at least 3 characters long";
  }
  else {
    errors.value.username = null;
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if(password.length < minLength) {
    if(blur) errors.value.password = `Password must be at least ${minLength} characters long`;
  } else if(!hasUpperCase){
    if(blur) errors.value.password = "Password must contain at least one uppercase letter";
  } else if(!hasLowerCase) {
    if(blur) errors.value.password = "Password must contain at least one lowercase letter";
  } else if(!hasNumber) {
    if(blur) errors.value.password = "Password must contain at least one number";
  } else if(!hasSpecialChar) {
    if(blur) errors.value.password = "Password must contain at least one special character";
  } else {
    errors.value.password = null;
  }
}

const validateReason = (blur) => {
  const reason = formData.value.reason.trim();
  const minLength = 10;
  const maxLength = 500;
  const hasMultipleWords = reason.split(/\s+/).filter(word => word.length > 0).length >= 2;
  const hasUniqueChars = new Set(reason.replace(/\s/g, '')).size >= 3;
  const hasNoInappropriateContent = !/(.)\1{4,}|[<>]|javascript:/i.test(reason);

  if (!reason) {
    if (blur) errors.value.reason = "Please provide a reason for joining";
  } else if (reason.length < minLength) {
    if (blur) errors.value.reason = `Reason must be at least ${minLength} characters long`;
  } else if (reason.length > maxLength) {
    if (blur) errors.value.reason = `Reason cannot exceed ${maxLength} characters`;
  } else if (!hasMultipleWords) {
    if (blur) errors.value.reason = "Reason must contain at least two words";
  } else if (!hasUniqueChars) {
    if (blur) errors.value.reason = "Reason must contain more diverse characters";
  } else if (!hasNoInappropriateContent) {
    if (blur) errors.value.reason = "Reason contains inappropriate content";
  } else {
    errors.value.reason = null;
  }
}

const validateGender = (blur) => {
  if(!formData.value.gender) {
    if(blur) errors.value.gender = "Please select a gender";
  } else {
    errors.value.gender = null;
  }
}

const validateAustralian = (blur) => {
  // 选项1: 完全移除验证 - 让用户自由选择
  // 不进行任何验证，用户可以选择是或否
  errors.value.isAustralian = null;
  
  // 选项2: 提供信息性提示而不是强制要求（已注释）
  // if (!formData.value.isAustralian && blur) {
  //   errors.value.isAustralian = "Note: Some features may be limited for non-Australian residents";
  // } else {
  //   errors.value.isAustralian = null;
  // }
  
  // 选项3: 如果选择是澳大利亚居民，提供额外验证（已注释）
  // if (formData.value.isAustralian && blur) {
  //   // 可以在这里添加额外的验证逻辑，比如要求提供澳大利亚地址等
  //   errors.value.isAustralian = null;
  // } else if (!formData.value.isAustralian && blur) {
  //   errors.value.isAustralian = "Please note that some services may not be available outside Australia";
  // } else {
  //   errors.value.isAustralian = null;
  // }
}

const submittedCards = ref([]);

// 计算Reason字段的字符数
const reasonCharCount = computed(() => {
  return formData.value.reason.length;
});

// 获取Reason字段的字符限制状态
const reasonCharStatus = computed(() => {
  const count = reasonCharCount.value;
  if (count === 0) return { class: 'text-muted', text: '0/500 characters' };
  if (count < 10) return { class: 'text-danger', text: `${count}/500 characters (minimum 10 required)` };
  if (count > 450) return { class: 'text-warning', text: `${count}/500 characters` };
  return { class: 'text-success', text: `${count}/500 characters` };
});

const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validateReason(true);
  validateGender(true);
  // 移除对isAustralian的验证，让用户自由选择
  if(!errors.value.username && !errors.value.password && !errors.value.reason && !errors.value.gender) {
    submittedCards.value.push({
      ...formData.value
    });
    clearForm();
  }
};
const clearForm = () => {
    formData.value = {
        username: '',
        password: '',
        isAustralian: false,
        reason: '',
        gender: ''
    };
};
</script>

<template>
<!--    <div class="form">-->
<!--    <h1>User Information Form / Credentials</h1>-->
<!--        <form>-->
<!--            <label for="username">Username:</label><br>-->
<!--            <input type="text" id="username" name="username"><br>-->

<!--            <label for="password">Password:</label><br>-->
<!--            <input type="password" id="password" name="password"><br>-->

<!--            <label for="isAustralian">Australian Resident?</label><br>-->
<!--            <input type="checkbox" id="isAustralian" name="isAustralian"><br>-->

<!--            <label for="reason">Reason For Joining:</label><br>-->
<!--            <textarea id="reason" name="reason" rows="3"></textarea><br>-->

<!--            <label for="gender">Gender</label><br>-->
<!--            <select id="gender">-->
<!--                <option value="female">Female</option>-->
<!--                <option value="male">Male</option>-->
<!--                <option value="other">Other</option>-->
<!--            </select>-->
<!--        </form>-->
<!--    </div>-->
  <div class="container mt-5">
    <div class="row">
      <div class="col-sm-8 offset-sm-2">
        <h1 class="text-center">User Information Form</h1>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="username" class="form-label">Username:</label>
              <input type="text" class="form-control" id="username" v-model="formData.username"
              @blur ="validateName(true)"
              @input ="validateName(false)"
              >
              <div v-if="errors.username" class="text-danger">
                {{ errors.username }}</div>
            </div>
            <div class="col-sm-6">
              <label for="password" class="form-label">Password:</label>
              <input type="password" class="form-control" id="password" v-model="formData.password"
              @blur ="validatePassword(true)"
              @input ="validatePassword(false)"
              >
              <div v-if ="errors.password" class="text-danger">
                {{ errors.password }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-6">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="isAustralian" v-model="formData.isAustralian">
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender"
              @change="validateGender(true)">
                <option value="">Please select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">
                {{ errors.gender }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12">
              <label for="reason" class="form-label">Reason For Joining:</label>
              <textarea class="form-control" id="reason" rows="4" v-model="formData.reason"
              @blur="validateReason(true)"
              @input="validateReason(false)"
              placeholder="Please provide a detailed reason for joining our platform (minimum 10 characters, maximum 500 characters)"></textarea>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <div v-if="errors.reason" class="text-danger">
                  {{ errors.reason }}
                </div>
                <div v-else class="text-muted small">
                  <span :class="reasonCharStatus.class">{{ reasonCharStatus.text }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="reset" class="btn btn-secondary" @click="clearForm">Reset</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row mt-4">
    <div class="col-12">
      <DataTable :value="submittedCards"
                class="mt-5"
                stripedRows
                :paginator="true"
                :rows="5"
                responsiveLayout="scroll">
        <Column field="username" header="Username"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="isAustralian" header="Australian Resident"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="reason" header="Reason"></Column>
      </DataTable>
    </div>
  </div>
  </div>

</template>

<style scoped>
   .card {
   border: 1px solid #ccc;
   border-radius: 10px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }
   .card-header {
   background-color: #275FDA;
   color: white;
   padding: 10px;
   border-radius: 10px 10px 0 0;
   }
   .list-group-item {
   padding: 10px;
   }
   :deep(.p-datatable) {
  margin: 20px auto;
}

:deep(.p-datatable-header) {
  font-weight: bold;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: #e9ecef;
  cursor: pointer;
}
</style>