
## 基于commit id查找引入的bug

通过人工二分法查找到引入bug的commit id，然后让Cursor查找 root cause

```
将inlinks和outlink实现为Component并在 @renderPage.tsx 中调用，其样式也分别创建scss
```
