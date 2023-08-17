# window新增api记录

## 1. window.showSaveFilePicker 实验性api

```
可进行文件的保存、但是前提是需要用户进行选择 手动调用无用
```
```js
async function getNewFileHandle (blob) {
  const handle = await window.showSaveFilePicker();
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
const boundsBlob = new Blob([JSON.stringify(bounds)], {type: 'text/plain'});
getNewFileHandle(boundsBlob);
```
