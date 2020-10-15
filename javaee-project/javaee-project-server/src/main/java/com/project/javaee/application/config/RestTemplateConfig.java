package com.project.javaee.application.config;

import com.project.javaee.constant.Constant;
import com.project.javaee.exception.OperationException;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.TrustStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

@Configuration
public class RestTemplateConfig {

    private static final Integer RETRY_COUNT = 3;
    @Value("${rest.template.timeout.connection}")
    private Integer connectionTimeout;
    @Value("${rest.template.timeout.connection-request}")
    private Integer connectionRequestTimeout;
    @Value("${rest.template.timeout.read}")
    private Integer readTimeout;
    @Value("${rest.template.httpclient.connection.pool.max.total}")
    private Integer httpClientPoolMaxTotal;
    @Value("${rest.template.httpclient.connection.pool.max.perroute}")
    private Integer httpClientPoolMaxPerRoute;
    @Resource
    private Environment environment;

    @Bean
    public RestTemplate restTemplate() {
        SSLContext sslContext = null;
        try {
            sslContext = new SSLContextBuilder().loadTrustMaterial(null, new ServerTrustStrategy()).build();
        } catch (NoSuchAlgorithmException | KeyManagementException | KeyStoreException e) {
            throw new OperationException("0", "", e);
        }
        SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
        Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create().register(Constant.HTTP_REQUEST_SCHEME,
                PlainConnectionSocketFactory.getSocketFactory()).register(Constant.HTTPS_REQUEST_SCHEME, sslConnectionSocketFactory).build();

        PoolingHttpClientConnectionManager poolingHttpClientConnectionManager = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
        poolingHttpClientConnectionManager.setMaxTotal(httpClientPoolMaxTotal);
        poolingHttpClientConnectionManager.setDefaultMaxPerRoute(httpClientPoolMaxPerRoute);

        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
        httpClientBuilder.setConnectionManager(poolingHttpClientConnectionManager);
        httpClientBuilder.setSSLContext(sslContext);
        httpClientBuilder.setRetryHandler(new DefaultHttpRequestRetryHandler(RETRY_COUNT, true));

        HttpComponentsClientHttpRequestFactory httpRequestFactory = new HttpComponentsClientHttpRequestFactory(httpClientBuilder.build());
        httpRequestFactory.setConnectTimeout(connectionTimeout);
        httpRequestFactory.setConnectionRequestTimeout(connectionRequestTimeout);
        httpRequestFactory.setReadTimeout(readTimeout);

        RestTemplate restTemplate = new RestTemplate(httpRequestFactory);
        restTemplate.setErrorHandler(new DefaultResponseErrorHandler());
        return restTemplate;
    }

    public static class ServerTrustStrategy implements TrustStrategy {
        @Override
        public boolean isTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            return true;
        }
    }
}
