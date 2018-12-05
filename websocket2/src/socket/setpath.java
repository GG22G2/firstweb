package socket;

import javax.websocket.Endpoint;
import javax.websocket.server.ServerApplicationConfig;
import javax.websocket.server.ServerEndpointConfig;
import java.util.HashSet;
import java.util.Set;



public class setpath implements ServerApplicationConfig{

    @Override
    public Set<Class<?>> getAnnotatedEndpointClasses(Set<Class<?>> scanned) {
        return scanned;
    }



    @Override
    public Set<ServerEndpointConfig> getEndpointConfigs(Set<Class<? extends Endpoint>> scanned) {
        Set<ServerEndpointConfig> result = new HashSet<>();
        if (scanned.contains(wsconnect.class)) {
            //配置访问路径
            result.add(ServerEndpointConfig.Builder.create(wsconnect.class, "/socket").build());
        }
        return result;
    }
}
