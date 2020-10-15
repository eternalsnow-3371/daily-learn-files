package com.project.javaee.service;

import org.springframework.stereotype.Component;

@Component
public class BaseThread extends Thread {
    @Override
    public void run() {
        int i = 0;
        while (true) {
            System.out.println("Server has been running for " + i + (i <= 1 ? " minute." : " minutes."));
            i++;
            try {
                Thread.sleep(1000 * 60);
            } catch (Exception e) {
                System.out.println("error");
            }
        }
    }
}
