package com.project.javaee.service.cache.impl;

import com.project.javaee.service.cache.BaseEventService;
import org.springframework.stereotype.Component;

@Component
public class EventServiceImpl implements BaseEventService {
    @Override
    public Long getEventLastOccurTime(String eventName) {
        return null;
    }

    @Override
    public void addNewEvent(String eventName, Long newEventTime) {
    }

    @Override
    public void updateEventOccurTime(String eventName, Long eventTime) {

    }
}
