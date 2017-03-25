# js 防抖实现
> 多次的点击事件，进行截流，减少http的发送

### 说明
smartAjax 是主要方法，对jquery类方法进行第三方拓展。使用之前注意依赖关系，jquery需要提前引入。

### 使用说明
####　$.smartAjax(opt)
根据smartType 参数，进行控制 
1: 每次发送需要等到上次返回， 
0： 两次发送的间隔不得少于500ms
不同的smartType的ajax， 请求不进行限制。 即如果上次请求的smartType为1，这次的smartType为0，则不会进行截流。
```
$.smartAjax({
    url: "test.php",
    type: "GET",
    dataType: "json",
    cache: false,
    smartType: param,
    success: function(res){
        console.log("success");
    },
    error: function(err){
        console.log("error");
    }
});
```
