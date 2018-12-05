package socket;

import org.json.JSONObject;

public class room{
    String roomid;
    int number;
    String offerid = null;
    String anserid = null;

    public room(String id) {
        this.roomid = id;
        number = 0;
    }


    public void joinroom(String id) {
        if (number == 0) {
            offerid = id;
        } else {
            anserid = id;
        }
        number++;
    }

    public void sendmessage() {
        JSONObject offermsg = new JSONObject();
        offermsg.put("what", "1");
        offermsg.put("state", "offer");
        offermsg.put("target", anserid);
        wsconnect.connections.get(offerid).asyncchannel.sendText(offermsg.toString());

        JSONObject answermsg = new JSONObject();
        answermsg.put("what", "1");
        answermsg.put("state", "answer");
        answermsg.put("target", offerid);
        wsconnect.connections.get(anserid).asyncchannel.sendText(answermsg.toString());

    }


    public void Exchangemessage() {

    }


}
