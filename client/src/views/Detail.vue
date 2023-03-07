<!--
 * new page
 * @author: Bu_ding
 * @since: 2023-03-07
 * detail.vue
-->
<template>
  <div class="container">
    <n-button @click="back">返回</n-button>

    <!-- 标题 -->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const blogInfo = ref({});
const axios = inject("axios");

onMounted(() => {
  loadBlog();
});

/**
 * 读取文章详情
 */
const loadBlog = async () => {
  let res = await axios.get("/blog/detail?id=" + route.query.id);
  blogInfo.value = res.data.rows[0];
};

const back = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
:deep(.blog-content img) {
  max-width: 100% !important;
  max-height: 100% !important;
}
.container {
  width: 1200px;
  margin: 0 auto;
}
</style>
