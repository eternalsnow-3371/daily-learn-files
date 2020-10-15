package com.project.javaee.application.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;

import java.io.IOException;

public class ExceptionWithSqlSessionFactoryBean extends SqlSessionFactoryBean {

    @Override
    protected SqlSessionFactory buildSqlSessionFactory() throws IOException {
        try {
            return super.buildSqlSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

}
