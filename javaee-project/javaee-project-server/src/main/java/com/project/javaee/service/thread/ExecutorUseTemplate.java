package com.project.javaee.service.thread;

import com.alibaba.fastjson.JSONObject;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.project.javaee.model.game.GameInfoQueryParam;
import com.project.javaee.service.game.GameInfoService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Component
public class ExecutorUseTemplate {

    private static final Integer DEFAULT_THREAD_POOL_CORE_SIZE = 10;
    private static final Integer DEFAULT_THREAD_POOL_MAX_SIZE = 20;
    @Resource
    private GameInfoService gameInfoService;
    private ExecutorService threadExecutorTemplate = new ThreadPoolExecutor(
            DEFAULT_THREAD_POOL_CORE_SIZE, DEFAULT_THREAD_POOL_MAX_SIZE, 0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<>(100),
            new ThreadFactoryBuilder().setNameFormat("default-thread-%d").build()
    );

    public void test() {
        Future<BlockingQueue<JSONObject>> futureOne = threadExecutorTemplate.submit(this::subTest);
        Future<BlockingQueue<JSONObject>> futureTwo = threadExecutorTemplate.submit(this::subTest);
        try {
            BlockingQueue<JSONObject> queueOne = futureOne.get();
            BlockingQueue<JSONObject> queueTwo = futureTwo.get();
            List<JSONObject> result = new ArrayList<>();
            result.addAll(queueOne);
            result.addAll(queueTwo);
            System.out.println(result.size());
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("error");
        }
    }

    private BlockingQueue<JSONObject> subTest() {
        BlockingQueue<JSONObject> result = new LinkedBlockingQueue<>();
        ExecutorService localThreadPool = new ThreadPoolExecutor(
                DEFAULT_THREAD_POOL_CORE_SIZE, DEFAULT_THREAD_POOL_MAX_SIZE, 0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(100),
                new ThreadFactoryBuilder().setNameFormat("default-thread-%d").build()
        );
        for (int i = 0; i < 100; ++i) {
            localThreadPool.submit(
                    () -> {
                        GameInfoQueryParam param = new GameInfoQueryParam();
                        result.add(gameInfoService.queryByParams(param));
                    }
            );
        }
        try {
            Thread.sleep(2000); // sleep两秒，确保所有任务均被提交并运行
            localThreadPool.shutdown();
            localThreadPool.awaitTermination(10, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            System.out.println("meet error");
        }

        return result;
    }


}
