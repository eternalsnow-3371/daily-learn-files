package com.project.javaee.service.cache.impl;

import com.project.javaee.service.cache.BaseCache;
import com.project.javaee.service.cache.BaseCacheRefreshService;
import com.project.javaee.service.cache.BaseEventService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CacheRefreshServiceImpl implements BaseCacheRefreshService {

    private static final List<BaseCache> CACHE_OBJECT_LISTS = new ArrayList<>();

    private static final Map<String, BaseCache> EVENT_2_CACHE_OBJECT_MAP = new HashMap<>();

    private static final Map<String, Long> LOCAL_EVENT_2_TIME_MAP = new HashMap<>();

    @Resource
    private BaseEventService eventService;

    @Override
    public void init(List<BaseCache> needRefreshCache) {
        CACHE_OBJECT_LISTS.addAll(needRefreshCache);
        for (BaseCache cache : CACHE_OBJECT_LISTS) {
            EVENT_2_CACHE_OBJECT_MAP.put(cache.getUpdateEventName(), cache);
            LOCAL_EVENT_2_TIME_MAP.put(cache.getUpdateEventName(), 0L);
        }
    }

    @Override
    public void checkIfNeedToUpdate() {
        for (Map.Entry<String, Long> entry : LOCAL_EVENT_2_TIME_MAP.entrySet()) {
            String eventName = entry.getKey();
            Long eventLastOccurTime = eventService.getEventLastOccurTime(eventName);
            if (eventLastOccurTime == null) {
                eventService.addNewEvent(eventName, System.currentTimeMillis());
                continue;
            }
            Long memLastUpdateTime = entry.getValue();
            if (!memLastUpdateTime.equals(eventLastOccurTime)) {

                BaseCache cache = EVENT_2_CACHE_OBJECT_MAP.get(eventName);
                if (cache != null) {
                    try {
                        cache.refreshCache();
                        entry.setValue(eventLastOccurTime);
                    } catch (Exception e) {
                        System.out.println(cache.getUpdateEventName() + " fail");
                    }
                }
            }
        }
    }
}
