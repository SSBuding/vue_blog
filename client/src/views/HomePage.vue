<!--
 * new page
 * @author: Bu_ding
 * @since: 2023-03-07
 * HomePage.vue
-->
<template>
  <div class="container">
    <div class="nav">
      <div @click="homePage">首页</div>
      <div>
        <n-popselect
          @update:value="searchByCategory"
          v-model:value="selectedCategory"
          :options="categortyOptions"
          trigger="click"
        >
          <div>
            分类<span>{{ categoryName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="dashboard">后台</div>
    </div>
    <n-divider />
    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      />
      <n-button type="primary" ghost @click="loadBlogs(0)"> 搜索 </n-button>
    </n-space>

    <div
      v-for="(blog, index) in blogListInfo"
      style="margin-bottom: 15px; cursor: pointer"
    >
      <n-card :title="blog.title" @click="toDetail(blog)">
        {{ blog.content }}

        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>

    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
    />

    <n-divider />
    <div class="footer">
      <div>Power by CoCoa</div>
      <div>XICP备XXXXX号-1</div>
    </div>
  </div>
</template>

<script setup>
// 路由
const router = useRouter();
// const route = useRoute();

// const message = inject("message");
// const dialog = inject("dialog");
const axios = inject("axios");

// 选中的分类
const selectedCategory = ref(0);
// 分类选项
const categortyOptions = ref([]);
// 文章列表
const blogListInfo = ref([]);

// 查询和分页数据
const pageInfo = reactive({
  page: 1,
  pagesize: 3,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryId: 0,
});

onMounted(() => {
  loadCategorys();
  loadBlogs();
});

/**
 * 获取博客列表
 */
const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page;
  }
  // console.log(pageInfo.categoryId);
  let res = await axios.get(
    `/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pagesize=${pageInfo.pagesize}&categoryId=${pageInfo.categoryId}`
  );
  // console.log(pageInfo.pagesize);
  let temp_rows = res.data.data.searchResult;
  // console.log(res);
  for (let row of temp_rows) {
    row.content += "...";
    let d = new Date(row.create_time);
    row.create_time = `${d.getFullYear()}年${
      d.getMonth() + 1
    }月${d.getDate()}日`;
  }
  blogListInfo.value = temp_rows;
  // console.log(blogListInfo.value);
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount =
    parseInt(pageInfo.count / pageInfo.pagesize) +
    (pageInfo.count % pageInfo.pagesize > 0 ? 1 : 0);
  // console.log(res);
};
const categoryName = computed(() => {
  //获取选中的分类
  let selectedOption = categortyOptions.value.find((option) => {
    return option.value == selectedCategory.value;
  });
  //console.log(selectedCategory.value);
  //返回分类的名称
  return selectedOption ? selectedOption.label : "";
});

/**
 * 获取分类列表
 */
const loadCategorys = async () => {
  let res = await axios.get("/category/list");
  // console.log(res);
  categortyOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  //console.log(categortyOptions.value);
};

/**
 * 选中分类
 */
const searchByCategory = (e) => {
  // console.log(e);
  pageInfo.categoryId = e;
  loadBlogs();
};

//页面跳转
const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog.id } });
};

const homePage = () => {
  router.push("/");
};

const dashboard = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 15px;
}
.container {
  width: 1200px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;

  div {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: #f60;
    }

    span {
      font-size: 12px;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
