package com.project.javaee.application.config;

import com.project.javaee.constant.PunctuationConstant;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.context.annotation.Bean;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;

import java.util.HashSet;
import java.util.Set;

//@Configuration
//@EnableCaching
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
            return new JedisCluster(nodes, 5000, 1000, 5, password, new GenericObjectPoolConfig());
        } catch (Exception e) {
            System.out.println("error");
            return null;
        }
    }
}
