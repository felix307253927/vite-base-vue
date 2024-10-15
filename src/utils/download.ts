/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-08-14 13:31:21
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-08-15 14:47:12
 */

export function downloadBase64Png(base64Data: string, fileName: string) {
  // 将Base64数据转换为Blob对象
  const byteString = atob(base64Data.split(",")[1]); // 移除头部信息
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  downLoad(new Blob([uint8Array], { type: "image/png" }), fileName);
}

export function downloadCsv(data: Array<string | number>[], fileName: string) {
  const blob = convertArrayToCSVBlob(data);
  downLoad(blob, fileName);
}

export function downLoad(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertArrayToCSVBlob(data: Array<string | number>[]) {
  // "\ufeff" 解决中文乱码问题
  return new Blob(["\ufeff" + data.map((row) => row.join(",")).join("\n")], {
    type: "text/csv;charset=utf-8"
  });
}
