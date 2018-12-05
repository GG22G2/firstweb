package socket;

import org.json.JSONObject;

import javax.websocket.CloseReason;
import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.MessageHandler;
import javax.websocket.RemoteEndpoint;
import javax.websocket.Session;
import java.util.HashMap;
import java.util.Map;

public class wsconnect extends Endpoint{
    static final Map<String, wsconnect> connections = new HashMap<>();
    RemoteEndpoint.Async asyncchannel;
    String id = String.valueOf((int) (Math.random() * 10000));

    private static class ChatMessageHandler implements MessageHandler.Partial<String>{
        private RemoteEndpoint.Async asyncchannel;

        private ChatMessageHandler(RemoteEndpoint.Async channel) {
            this.asyncchannel = channel;
        }

        //接收到浏览器发送的数据后触发
        @Override
        public void onMessage(String message, boolean last) {
            try {
                System.out.println("客户端发送的数据为：" + message);

                JSONObject receive = new JSONObject(message);
                String what = receive.getString("what");
                String roomid = receive.getString("room");
                String id = receive.getString("id");
                room room = roomguanli.rooms.get(roomid);
                if (room == null) {
                    room = new room(roomid);
                    roomguanli.rooms.put(roomid, room);
                }
                room.joinroom(id);
                switch (what) {
                    case "0":
                        if (room.anserid == null) {
                            return;
                        }
                        System.out.println("房间id为："+room.roomid);
                        System.out.println("房间人数为"+room.number);
                        System.out.println(room.offerid);
                        System.out.println(room.anserid);
                        room.sendmessage();
                        break;
                    case "2":
                    case "3":
                        String target = receive.getString("target");
                        wsconnect.connections.get(target).asyncchannel.sendText(message);
                        break;
                    case "4":
                        roomguanli.rooms.remove(roomid);
                        break;
                }


            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onOpen(Session session, EndpointConfig endpointConfig) {
        System.out.println("建立连接");
        asyncchannel = session.getAsyncRemote();
        connections.put("" + id, this);
        session.addMessageHandler(new ChatMessageHandler(asyncchannel));
        JSONObject re = new JSONObject();
        re.put("what", "0");
        re.put("id", id);
        asyncchannel.sendText(re.toString());
    }

    @Override
    public void onClose(Session session, CloseReason closeReason) {
        System.out.println("连接已关闭");
        connections.remove("" + id);
        super.onClose(session, closeReason);
    }
}


