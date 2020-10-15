package com.project.javaee.service.cache;

import java.util.List;

public interface BaseCacheRefreshService {
    void init(List<BaseCache> needRefreshCache);

    void checkIfNeedToUpdate();
}
