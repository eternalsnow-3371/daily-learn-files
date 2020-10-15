package com.project.javaee.service.cache.impl;

import com.project.javaee.service.cache.BaseCache;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class BaseCacheImpl implements BaseCache {
    private static final String updateEventTime = "lastUpdateBaseCacheImplTime";

    private static volatile Map<Integer, String> cacheObject = null;

    @Override
    public String getUpdateEventName() {
        return updateEventTime;
    }

    @Override
    public void refreshCache() {
        // construct new cache object
        Map<Integer, String> newCacheObject = new HashMap<>();
        newCacheObject.put(1, "1");
        newCacheObject.put(2, "2");
        newCacheObject.put(3, "3");
        cacheObject = newCacheObject;
    }


}
