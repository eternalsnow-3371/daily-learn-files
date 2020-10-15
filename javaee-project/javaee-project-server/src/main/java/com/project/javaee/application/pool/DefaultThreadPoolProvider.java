package com.project.javaee.application.pool;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Component
public class DefaultThreadPoolProvider {

    private static final Integer DEFAULT_THREAD_POOL_CORE_SIZE = 200;
    private static final Integer DEFAULT_THREAD_POOL_MAX_SIZE = 200;

    private ExecutorService defaultThreadPool = new ThreadPoolExecutor(
            DEFAULT_THREAD_POOL_CORE_SIZE, DEFAULT_THREAD_POOL_MAX_SIZE, 0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<>(100),
            new ThreadFactoryBuilder().setNameFormat("default-thread-%d").build()
    );
}
