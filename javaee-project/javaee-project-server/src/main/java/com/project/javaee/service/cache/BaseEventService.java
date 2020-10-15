package com.project.javaee.service.cache;

public interface BaseEventService {
    void addNewEvent(String eventName, Long newEventTime);

    void updateEventOccurTime(String eventName, Long eventTime);

    Long getEventLastOccurTime(String eventName);
}
