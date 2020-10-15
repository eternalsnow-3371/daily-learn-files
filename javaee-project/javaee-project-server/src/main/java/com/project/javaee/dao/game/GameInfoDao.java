package com.project.javaee.dao.game;

import com.project.javaee.exception.OperationException;
import com.project.javaee.model.game.GameInfoBean;
import com.project.javaee.model.game.GameInfoQueryParam;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;

@Repository
public class GameInfoDao {

    @Resource
    private GameInfoMapper gameInfoMapper;

    public List<GameInfoBean> queryBeansByParams(GameInfoQueryParam queryParam) {
        try {
            return gameInfoMapper.queryBeansByParams(queryParam);
        } catch (Exception e) {
            e.printStackTrace();
            throw new OperationException("testCode", "testMsg", e);
        }
    }

    public Integer queryCountByParams(GameInfoQueryParam queryParam) {
        try {
            return gameInfoMapper.queryCountByParams(queryParam);
        } catch (Exception e) {
            e.printStackTrace();
            throw new OperationException("testCode", "testMsg", e);
        }
    }

}
