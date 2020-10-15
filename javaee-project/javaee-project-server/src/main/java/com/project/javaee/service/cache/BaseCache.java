package com.project.javaee.service.cache;

public interface BaseCache {
    void refreshCache();

    String getUpdateEventName();
}
