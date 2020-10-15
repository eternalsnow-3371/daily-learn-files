package com.project.javaee.service.game;

import com.alibaba.fastjson.JSONObject;
import com.project.javaee.dao.game.GameInfoDao;
import com.project.javaee.model.game.GameInfoBean;
import com.project.javaee.model.game.GameInfoQueryParam;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@Service
public class GameInfoService {

    @Resource
    private GameInfoDao gameInfoDao;

    public JSONObject queryByParams(@Valid GameInfoQueryParam queryParam) {
        List<GameInfoBean> beans = gameInfoDao.queryBeansByParams(queryParam);
        Integer count = gameInfoDao.queryCountByParams(queryParam);

        JSONObject object = new JSONObject();
        object.put("info", beans);
        object.put("count", count);
        return object;
    }
}
