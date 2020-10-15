package com.project.javaee.util;

import org.apache.commons.lang3.StringUtils;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class IpCheckUtil {

    public static boolean ipCheck(String needCheckString) {
        if (StringUtils.isNotEmpty(needCheckString)) {
            String ipRegex = "^((1[0-9][0-9]\\.)|(2[0-4][0-9]\\.)|(25[0-5]\\.)|([1-9][0-9]\\.)|([0-9]\\.)){3}((1[0-9][0-9])|(2[0-4][0-9])|(25[0-5])|([1-9][0-9])|([0-9]))$";
            Pattern pattern = Pattern.compile(ipRegex);
            Matcher matcher = TimeLimitedMatcherFactory.matcher(pattern, needCheckString);
            return matcher.find();
        }
        return false;
    }

    public static void main(String[] args) {
        try {
            InetAddress inetAddress = InetAddress.getLocalHost();
            System.out.println(inetAddress.getHostAddress());
        } catch (UnknownHostException e) {
            System.out.println("error");
        }
    }

}
