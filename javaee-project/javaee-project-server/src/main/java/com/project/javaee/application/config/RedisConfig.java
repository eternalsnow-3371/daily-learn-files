package com.project.javaee.application.config;

import com.project.javaee.constant.PunctuationConstant;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;

import java.util.HashSet;
import java.util.Set;

@Configuration
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {

    @Value("${spring.redis.cluster.nodes}")
    private String clusterNodes;

    @Value("${spring.redis.password}")
    private String password;

    @Bean
    public JedisCluster getJedisCluster() {
        String[] cluster = clusterNodes.split(PunctuationConstant.PUNCTUATION_STRING_OF_COMMA);
        Set<HostAndPort> nodes = new HashSet<>();
        for (String node : cluster) {
            String[] hostAndPort = node.split(PunctuationConstant.PUNCTUATION_STRING_OF_COLON);
            nodes.add(new HostAndPort(hostAndPort[0], Integer.parseInt(hostAndPort[1])));
        }
        try {
            JedisCluster jedisCluster = new JedisCluster(nodes, 5000, 1000, 5, password, new GenericObjectPoolConfig());
            if (redisTest(jedisCluster)) {
                System.out.println("Create redis connection success");
            }
            return jedisCluster;
        } catch (Exception e) {
            System.out.println("Redis create error");
            e.printStackTrace();
            return null;
        }
    }

    private boolean redisTest(JedisCluster jedisCluster) {
        try {
            jedisCluster.setex("test-key-from-javaee-project-server", 60, "1");
            if (jedisCluster.get("test-key-from-javaee-project-server").equals("1")) {
                jedisCluster.del("test-key-from-javaee-project-server");
                return true;
            }
            return false;
        } catch (Exception e) {
            System.out.println("Redis create error");
            e.printStackTrace();
            return false;
        }
    }
}
