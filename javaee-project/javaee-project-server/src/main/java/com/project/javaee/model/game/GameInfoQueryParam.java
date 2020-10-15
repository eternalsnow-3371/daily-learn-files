package com.project.javaee.model.game;

import com.project.javaee.util.validator.EnumValidator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameInfoQueryParam {
    private Long appId;

    @EnumValidator(value = "tome4")
    private String gameCategory;

    private String buyDate;

    @EnumValidator(value = "true,false")
    private Boolean alreadyPlayed;

    private String keywords;

    private Integer pageSize;

    private Integer offset;
}
