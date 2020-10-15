package com.project.javaee.application.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.project.javaee.dao", sqlSessionFactoryRef = "javaeedbSqlSessionFactory")
public class SessionFactoryConfig {

    private static final String MYBATIS_CONFIG_PATHFILE = "/config/mybatis-config.xml";

    private static final String MAPPER_PATH = "/mapper/**.xml";

    @Bean(name = "javaeedbDataSource")
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource.javaeedb")
    public DataSource javaeedbDataSource() {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setPasswordCallback(new DbPasswordCallback());
        return druidDataSource;
    }


    @Bean(name = "javaeedbSqlSessionFactory")
    @Primary
    public SqlSessionFactory javaeedbSqlSessionFactory(@Qualifier("javaeedbDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new ExceptionWithSqlSessionFactoryBean();
        bean.setConfigLocation(new ClassPathResource(MYBATIS_CONFIG_PATHFILE));
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources(MAPPER_PATH));
        return bean.getObject();
    }

    @Bean(name = "javaeedbDataSourceTransactionManager")
    @Primary
    public DataSourceTransactionManager javaeedbDataSourceTransactionManager(@Qualifier("javaeedbDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "javaeedbDataSourceTransactionManager")
    @Primary
    public SqlSessionTemplate javaeedbSqlSessionTemplate(@Qualifier("javaeedbSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
