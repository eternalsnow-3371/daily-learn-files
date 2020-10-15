package com.project.javaee.dao.game;

import com.project.javaee.model.game.GameInfoBean;
import com.project.javaee.model.game.GameInfoQueryParam;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface GameInfoMapper {

    List<GameInfoBean> queryBeansByParams(GameInfoQueryParam queryParam);

    Integer queryCountByParams(GameInfoQueryParam queryParam);

    Integer insertNewGameInfo(GameInfoBean newGameInfo);

    Integer upsertNewGameInfo(GameInfoBean needUpdateGameInfo);

    void deleteGameInfo(@Param("id") Integer id, @Param("appId") String appId);

}
