package com.project.javaee.model.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameInfoBean {

    private Integer id;

    private Long appId;

    private String gameCategory;

    private String buyDate;

    private String gameDescription;

    private Boolean alreadyPlayed;

    private Long updateTime;
}
