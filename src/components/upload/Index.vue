<template>
  <a-upload-dragger
    class="mb-[40px]"
    v-model:file-list="fileList"
    :before-upload="beforeUpload"
    :customRequest="customRequest"
    :showUploadList="false"
    accept=".pdf,.txt,.doc,.docx,.md,.xlsx,.xls,.json,.html"
    multiple
    :maxCount="MAX_COUNT"
    @drop="handleDrop"
  >
    <img src="@/assets/icon_file.svg" alt="" />
    <p class="ant-upload-text">点击上传或拖拽文档到这里</p>
    <p class="ant-upload-hint">
      <!-- 支持 PDF、TXT、DOC、DOCX、MD、EXCEL ，最多可上传100个文件，建议文件累计大小不超过300MB -->
      支持 PDF、TXT、DOCX、MD、EXCEL ，最多可上传100个文件，建议文件累计大小不超过300MB
    </p>
  </a-upload-dragger>

  <Table :columns="columns" :data-source="fileList" :scroll="{ y: 'calc(100vh - 460px)' }" :pagination="false">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'name'">
        <div class="flex items-center">
          <img v-if="record.response?.type === 'txt'" src="@/assets/image/knowledge/icon_TXT.svg" alt="" />
          <img v-if="record.response?.type === 'pdf'" src="@/assets/image/knowledge/icon_PDF.svg" alt="" />
          <img v-if="record.response?.type === 'word'" src="@/assets/image/knowledge/icon_Word.svg" alt="" />
          <img v-if="record.response?.type === 'doc'" src="@/assets/image/knowledge/icon_Word.svg" alt="" />
          <img v-if="record.response?.type === 'docx'" src="@/assets/image/knowledge/icon_Word.svg" alt="" />
          <img v-if="record.response?.type === 'md'" src="@/assets/image/knowledge/icon_MD.svg" alt="" />
          <img v-if="record.response?.type === 'json'" src="@/assets/image/knowledge/icon_JSON.svg" alt="" />
          <img
            v-if="record.response?.type === 'xlsx' || record.response?.type === 'xls'"
            src="@/assets/image/knowledge/icon_Excel.svg"
            alt=""
          />
          <div class="file-name">{{ record.name }}</div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status === 'uploading'">{{ record.percent }}%</span>
        <span v-else-if="record.status === 'done'">
          <img src="@/assets/image/knowledge/icon_success.svg" alt="" />
        </span>
        <span v-else-if="record.status === 'error'">
          <span class="flex items-center justify-center">
            <img src="@/assets/image/knowledge/icon_failed.svg" alt="" />
            <a-button type="link" @click="reupload(record)">重新上传</a-button>
          </span>
        </span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-popconfirm title="确定要删除？" @confirm="handleDelate(index)">
          <img class="cursor-pointer" src="@/assets/image/knowledge/icon_delete.svg" alt="" />
        </a-popconfirm>
      </template>
    </template>
  </Table>
  <div class="flex justify-end mt-[20px]">
    <a-button type="primary" @click="handleOk" :disabled="hasFailed" :loading="confirmLoading">确认</a-button>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import Table from "@/components/table/Index.vue";
import { type UploadProps, type UploadFile, message, Upload } from "ant-design-vue";
import { preUploadFile, minioUploadFile } from "@/api/knowledge.ts";
import { round, throttle } from "lodash-es";
import { getFileExtension } from "@/utils/index.ts";

const MAX_COUNT = 100; // 个
const MAX_SIZE = 500 * 1024 * 1024; // byte
const outOfCountWarning = throttle(
  function warning() {
    message.warning("文件上传数量超出最大限制", 1);
  },
  1500,
  { leading: true, trailing: false }
);
const outOfSizeWarning = throttle(
  function warning() {
    message.warning("文件累计大小超出最大限制", 1);
  },
  1500,
  { leading: true, trailing: false }
);
const outOfTypeWarning = throttle(
  function warning() {
    message.warning("仅支持 PDF、TXT、DOC、DOCX、MD", 1);
  },
  1500,
  { leading: true, trailing: false }
);
// 该函数只用于前端显示，文件大小的单位后端会自动计算
function normalizeSize(size: number) {
  if (size >= 1024 * 1024) {
    // 大于 1M 的显示单位为 M
    return round(size / (1024 * 1024), 2) + "MB";
  }
  return round(size / 1024, 2) + "KB";
}

const columns = [
  {
    title: "文档名称",
    dataIndex: "name",
    key: "name",
    width: "60%"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 150
  },
  {
    title: "文件大小",
    dataIndex: "size",
    key: "size",
    align: "center",
    width: 150,
    customRender({ text }: { text: number }) {
      return normalizeSize(text);
    }
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 150
  }
];
defineProps<{ confirmLoading: boolean }>();
const fileList = ref<UploadProps["fileList"]>([]);
const hasFailed = computed(() => {
  if (!fileList.value || fileList.value.length === 0) return true;
  return !fileList.value?.every((item) => item.percent && item.percent === 100);
});

function beforeUpload(file: File, fileListArr: File[]) {
  const newFileArr = fileListArr ?? [];
  const oldFileArr = fileList.value ? fileList.value : [];

  // 文件数量限制
  const newFileCount = newFileArr.length;
  const oldFileCount = oldFileArr.length;
  if (newFileCount + oldFileCount > MAX_COUNT) {
    outOfCountWarning();
    return Upload.LIST_IGNORE;
  }

  // 文件累计大小限制
  const newFileSize = newFileArr.reduce((prev, curr) => prev + (curr.size ?? 0), 0);
  const oldFileSize = oldFileArr.reduce((prev, curr) => prev + (curr.size ?? 0), 0);
  if (newFileSize + oldFileSize > MAX_SIZE) {
    outOfSizeWarning();
    return Upload.LIST_IGNORE;
  }

  const extension = file?.name.split(".").pop();
  const isAcceptType =
    extension && ["pdf", "txt", "doc", "docx", "md", "xlsx", "xls", "json", "html"].includes(extension);
  if (!isAcceptType) {
    outOfTypeWarning();
    return Upload.LIST_IGNORE;
  }

  return true;
}
// 处理拖拽时文件格式不满足要求时提醒用户
function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files) {
    const filesArr = Array.from(files);
    filesArr.forEach((file) => {
      const extension = file?.name.split(".").pop();
      const isAcceptType =
        extension && ["pdf", "txt", "doc", "docx", "md", "xlsx", "xls", "json", "html"].includes(extension);
      if (!isAcceptType) {
        outOfTypeWarning();
      }
    });
  }
}

// 自定义上传请求
function customRequest(option: { file: File; onProgress: Function; onSuccess: Function; onError: Function }) {
  // console.log("customRequest");
  // const formData = new FormData();
  // formData.append("file", option.file);

  // http链接过程中，会持续触发 ajax 的 onprogress 事件
  // 后端返回错误时，会先走 catch 回调，再走 onprogress 导致最后上传的状态不对
  // 所以添加 isFailed 标识，只要 isFailed 未true，则代表上传失败，不再走 onprogress 回调
  // let gotResult = false;

  // uploadFile(formData, function onUploadProgress(event: ProgressEvent) {
  //   if (gotResult) return;

  //   const percent = event.total > 0 ? Math.ceil((event.loaded / event.total) * 100) : 0;
  //   option.onProgress({ percent: Math.min(99, percent) });
  // })
  //   .then((res) => {
  //     gotResult = true;
  //     option.onSuccess(res.data);
  //     console.log("上传成功", fileList.value);
  //   })
  //   .catch((err) => {
  //     gotResult = true;
  //     const error = new Error(err.msg);
  //     option.onError(error);
  //     console.log("上传出错", fileList.value);
  //   })
  //   .finally(() => {});

  let gotResult = false;
  const fileName = option.file.name ?? "";
  const size = round(option.file.size / 1024, 2) + "kb";
  const type = getFileExtension(fileName);

  preUploadFile({ fileName, size, type }).then((res) => {
    const response = res?.data ?? {};
    const { uploadPath } = response;
    if (!uploadPath) return;

    // minio 上传接口直接 file 放进 body，不需要使用 FormData https://zhuanlan.zhihu.com/p/692509243
    minioUploadFile(uploadPath, option.file, function onUploadProgress(event: ProgressEvent) {
      if (gotResult) return;
      const percent = event.total > 0 ? Math.ceil((event.loaded / event.total) * 100) : 0;
      option.onProgress({ percent: Math.min(99, percent) });
    })
      .then(() => {
        gotResult = true;
        option.onSuccess(response);
        console.log("上传成功", fileList.value);
      })
      .catch((err) => {
        gotResult = true;
        const error = new Error(err.msg);
        option.onError(error);
        console.log("上传出错", fileList.value);
      });
  });
}

// 重新上传
function reupload(file: UploadFile) {
  if (!file.originFileObj) return;

  // const formData = new FormData();
  // formData.append("file", file.originFileObj);

  // let gotResult = false;
  // uploadFile(formData, function onUploadProgress(event: ProgressEvent) {
  //   if (gotResult) return;

  //   file.status = "uploading";
  //   const percent = event.total > 0 ? Math.ceil((event.loaded / event.total) * 100) : 0;
  //   file.percent = Math.min(99, percent);
  // })
  //   .then((res) => {
  //     gotResult = true;
  //     file.status = "done";
  //     file.percent = 100;
  //     file.response = res.data;
  //     file.xhr = res.request;
  //     console.log("重新上传成功", fileList.value);
  //   })
  //   .catch((err) => {
  //     gotResult = true;
  //     file.error = err.data;
  //     file.response = err.data;
  //     file.status = "error";
  //     console.log("重新上传出错", fileList.value);
  //   });

  // 直接上传 minio
  let gotResult = false;
  const fileName = file.originFileObj.name ?? "";
  const size = round(file.originFileObj.size / 1024, 2) + "kb";
  const type = getFileExtension(fileName);
  preUploadFile({ fileName, size, type }).then((res) => {
    const response = res?.data ?? {};
    const { uploadPath } = response;
    if (!uploadPath) return;

    // minio 上传接口直接 file 放进 body，不需要使用 FormData https://zhuanlan.zhihu.com/p/692509243
    minioUploadFile(uploadPath, file.originFileObj, function onUploadProgress(event: ProgressEvent) {
      if (gotResult) return;

      file.status = "uploading";
      const percent = event.total > 0 ? Math.ceil((event.loaded / event.total) * 100) : 0;
      file.percent = Math.min(99, percent);
    })
      .then((res) => {
        gotResult = true;
        file.status = "done";
        file.percent = 100;
        file.response = response;
        file.xhr = (res as any).request;
        console.log("重新上传成功", fileList.value);
      })
      .catch((err) => {
        gotResult = true;
        file.error = err.data;
        file.response = err.data;
        file.status = "error";
        console.log("重新上传出错", fileList.value);
      });
  });
}

function handleDelate(index: number) {
  fileList.value?.splice(index, 1);
}

const emit = defineEmits(["ok"]);
const handleOk = throttle(
  function handleOk() {
    emit("ok", fileList.value);
  },
  1000,
  { leading: true }
);
</script>

<style scoped lang="less">
:deep(.ant-upload-drag) {
  background: #f2f7ff;
  border-radius: 12px;
  border: 1px dashed#015cff;
}
.ant-upload-text {
  color: #015cff !important;
}
.ant-upload-hint {
  color: #8b929f !important;
}
.file-name {
  max-width: 80%;
  // background: #ffffff;
  // border-radius: 8px 8px 8px 8px;
  // border: 1px solid #dbe0f1;
  // padding: 0 14px;
  margin-left: 20px;
  line-height: 40px;
  overflow: hidden; /*内容超出后隐藏*/
  text-overflow: ellipsis; /*超出内容显示为省略号*/
  white-space: nowrap;
}
</style>
