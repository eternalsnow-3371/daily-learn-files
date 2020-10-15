package com.project.javaee.application.help;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextProvider implements ApplicationContextAware {
    /**
     * 上下文对象实例
     */
    private static ApplicationContext context;

    private static void setApplicationContextInnerMethod(ApplicationContext applicationContext) {
        context = applicationContext;
    }

    /**
     * 通过name获取 Bean.
     */
    public static Object getBean(String name) {
        return context.getBean(name);
    }

    /**
     * 通过class获取Bean.
     */
    public static <T> T getBean(Class<T> clazz) {
        return context.getBean(clazz);
    }

    /**
     * 通过name,以及Clazz返回指定的Bean
     */
    public static <T> T getBean(String name, Class<T> clazz) {
        return context.getBean(name, clazz);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        setApplicationContextInnerMethod(applicationContext);
    }
}
