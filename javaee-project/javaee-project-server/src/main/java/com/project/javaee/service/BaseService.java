package com.project.javaee.service;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class BaseService {

    @PostConstruct
    void init() {
        BaseThread t = new BaseThread();
        t.start();
    }
}
