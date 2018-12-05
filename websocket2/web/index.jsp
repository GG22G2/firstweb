<%--
  Created by IntelliJ IDEA.
  User: root
  Date: 2018/11/26
  Time: 13:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>$Title$</title>
    <script>
      var ws=new WebSocket("ws://localhost:54321/socket");
      ws.onopen = function()
      {
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send("hello tomcat");
      };

       ws.onmessage = function (message)
      {
          var msg = message.data;
          console.log(msg);
      };
    </script>



  </head>
  <body>
  $END$
  </body>
</html>
