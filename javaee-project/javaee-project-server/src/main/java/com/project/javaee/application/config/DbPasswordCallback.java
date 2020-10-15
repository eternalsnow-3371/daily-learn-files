package com.project.javaee.application.config;

import com.alibaba.druid.util.DruidPasswordCallback;

import java.util.Properties;

public class DbPasswordCallback extends DruidPasswordCallback {

    @Override
    public void setProperties(Properties properties) {
        super.setProperties(properties);
        String password = properties.getProperty("encryptedPassword");
        setPassword(password.toCharArray());
    }

}
