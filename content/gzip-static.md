# gzip_static的有效使用

> 聊到前端性能优化，总逃不过 `Nginx`的 `gzip`压缩，那你知道静态压缩 gzip_static吗？以及它的有效使用方式吗？

## 压缩模式

一般来说， `Nginx`的 `gzip`分为两种模式：

1. 动态压缩
2. 静态压缩

### 动态压缩

动态压缩是指 `Nginx`服务器在发送前端产物时，消耗自身的资源进行实时压缩，这样即便产物中不存在 `.gz`结尾的文件，浏览器端也能拿到 `gzip`格式的前端产物。其一般配置如下：

```nginx
server {
  gzip on;
  gzip_vary on;
  gzip_min_length 1k;
  gzip_proxied expired no-cache no-store private auth;
  gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
  gzip_disable "MSIE [1-6]\.";
}
```

### 静态压缩

静态压缩会直接将产物中预先压缩过的 `.gz`文件发送给浏览器，而不再实时压缩文件，如果找不到 `.gz`文件，将会使用对应的原始文件。

#### 开启

有个前提条件，要保证 `Nginx`存在 `ngx_http_gzip_static_module`模块，这个模块默认不开启，需要使用 `--with-http_gzip_static_module`来激活。

可以使用下面指令查看是否已经激活该模块

```shell
nginx -V 2>&1| grep -o http_gzip_static_module
# http_gzip_static_module
```

![http_gzip_static_module](https://zion-bucket1.obs.cn-north-4.myhuaweicloud.com/images/%E6%88%AA%E5%B1%8F2023-02-22%2016.09.09-2023-02-22-ce49bcafc29c90fc5385879926a87e97-b0201b.png)

如果不存在则需要在编译时开启

```shell
cd nginx-1.20.2
./configure --prefix=/usr/local/nginx --with-http_gzip_static_module
make && make install
```

#### Docker

对于 `Docker`版本的 `nginx:alpine`则不需要查看这些，接着配置就可以了

#### 一般配置

```nginx
gzip_static  on;
gzip_proxied expired no-cache no-store private auth;
```

按照一般的文档，到这里就可以结束了，已经完成静态压缩的配置了。

但是真得有效果吗？我们来试一下

## 项目演示

### 使用 vite

示例以 vite来创建，webpack也是可以的

```shell
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
```

### Gzip配置

> webpack可以使用 `compression-webpack-plugin`，配置不再赘述

安装 `vite-plugin-compression`插件（用于生成 `.gz`文件），并修改 vite.config.ts。

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  	viteCompression({ // 开启 gzip压缩
      deleteOriginFile: true,
    }),
  ],
})
```

`deleteOriginFile`选项默认为 `false`，表示生成 `.gz`文件后，不会删除源文件。为了测试 `Nginx`的 `gzip_static`是不是直接使用了 `.gz`文件，我们把 `deleteOriginFile`设为 `true`

### build

![https://zion-bucket1.obs.cn-north-4.myhuaweicloud.com/images/截屏2023-02-22 14.36.07-2023-02-22-60bcc31828aef685aff9091fc4e6f092-3e9e48.png](https://zion-bucket1.obs.cn-north-4.myhuaweicloud.com/images/%E6%88%AA%E5%B1%8F2023-02-22%2014.36.07-2023-02-22-60bcc31828aef685aff9091fc4e6f092-3e9e48.png)

### deploy

有了创建产物，就可以开始部署前端服务了，先来看一下现有 `Nginx`配置。

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root   /usr/share/nginx/html;

  gzip_static on;
  gzip on;
  gzip_vary on;
  gzip_min_length 1k;
  gzip_proxied expired no-cache no-store private auth;
  gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
  gzip_disable "MSIE [1-6]\.";

  location / {
    try_files $uri $uri/ /index.html;
    index  index.html index.htm;
  }
}
```

演示的时候将直接使用 `Nginx`的方式进行部署，部署步骤不再演示。部署成功就可以直接访问服务了。

## 问题处理

### MIME Type

这时，我们发现页面出现了空白，控制台也出现了报错。

```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
```

报错的原因是返回头的格式与实际请求的文件格式不相符，点开其中 js的请求，我们可以看到它的 `Content-Type`变成了  `text/html`，css文件的 `Content-Type`也成了 `text/html`。

<img src="https://zion-bucket1.obs.cn-north-4.myhuaweicloud.com/images/%E6%88%AA%E5%B1%8F2023-02-22%2015.13.28-2023-02-22-3e56d55ca8f42f5a59ce646250c0e602-f47e57.png" alt="js返回格式" style="zoom:67%;" />

这就说明目前的 `gzip_static`并没有发挥作用，没有正确识别文件的格式。那现在就从文件的格式入手解决。加一些 `Nginx`对文件格式的配置，测试一下，下列两种配置均有效果，但是推荐使用第一种，原因参考下文中 `502`错误处理。

```nginx
# 第一种
location ~ \.(js|mjs|json|css|html)$ {
  gzip_static on;
}

# 第二种
location /assets {
  gzip_static on;
}
```

然后检测 `Nginx`配置，重启 `Nginx`。

```shell
nginx -t
nginx -s reload
```

刷新页面，就可以看到正常的页面，`Response Headers`中：

- js文件 `Content-Type: application/javascript`
- css文件 `Content-Type: text/css`
- `Content-Encoding: gzip`

<img src="https://zion-bucket1.obs.cn-north-4.myhuaweicloud.com/images/%E6%88%AA%E5%B1%8F2023-02-22%2015.29.30-2023-02-22-2019d4fa33ac903c00f8b4c5bf1347a6-bbd892.png" alt="成功页面响应" style="zoom: 50%;" />

### 502

如果访问网站出现 502的情况，检查一下 `dist`包中 html文件是不是 `.gz`格式。如果是这种情况，就需要在 `Nginx`中增加 html处理。

```nginx
location ~ \.(js|mjs|json|css|html)$ {
  gzip_static on;
}
```

## 总结

最后来看一下 `Nginx`的配置。考虑到浏览器兼容性，有些浏览器不支持 gzip压缩，大家在 build阶段，不要删除源文件，尽可能保证 `.gz`文件及其源文件同时存在。

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root   /usr/share/nginx/html;

  gzip_static on;
  gzip on;
  gzip_vary on;
  gzip_min_length 1k;
  gzip_proxied expired no-cache no-store private auth;
  gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
  gzip_disable "MSIE [1-6]\.";

  location ~ \.(js|mjs|json|css|html)$ {
    gzip_static on;
  }

  location / {
    try_files $uri $uri/ /index.html;
    index  index.html index.htm;
  }
}
```

希望能帮助大家，3Q!

