package com.project.javaee.controller.game;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.project.javaee.constant.ResponseCode;
import com.project.javaee.model.common.BaseResponse;
import com.project.javaee.model.game.GameInfoQueryParam;
import com.project.javaee.service.game.GameInfoService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping(value = "/v1/javaee/game")
public class GameInfoController {

    @Resource
    private GameInfoService gameInfoService;

    @GetMapping(value = "/list")
    @ResponseBody
    public BaseResponse queryByParams(@RequestBody String body) {
        GameInfoQueryParam queryParam = JSON.parseObject(body, GameInfoQueryParam.class);
        JSONObject result = gameInfoService.queryByParams(queryParam);
        return BaseResponse.constructBaseResponse(ResponseCode.SERVER_RESPONSE_OK, "success", result);
    }

    @PostMapping(value = "/createTest")
    @ResponseBody
    public BaseResponse createTest(@Valid @RequestBody GameInfoQueryParam queryParam) {
        try {
            JSONObject result = gameInfoService.queryByParams(queryParam);
            return BaseResponse.constructBaseResponse(ResponseCode.SERVER_RESPONSE_OK, "success", result);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
