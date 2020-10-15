package com.project.javaee.util;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class FieldReflectUtil {

    public static Object getObjectField(Object object, String fieldName) {
        try {
            if (object != null) {
                PropertyDescriptor prop = new PropertyDescriptor(fieldName, object.getClass());
                return prop.getReadMethod().invoke(object);
            } else {
                return null;
            }
        } catch (Exception e) {
            System.out.println("error");
            return null;
        }
    }

    public static void setObjectField(Object object, String fieldName, Object fieldValue) {
        try {
            if (object != null) {
                PropertyDescriptor prop = new PropertyDescriptor(fieldName, object.getClass());
                prop.getWriteMethod().invoke(object, fieldValue);
            }
        } catch (Exception e) {
            System.out.println("error");
        }
    }

    public static Object getObjectField(Object object, Field field) {
        try {
            if (object != null) {
                PropertyDescriptor prop = new PropertyDescriptor(field.getName(), object.getClass());
                return prop.getReadMethod().invoke(object);
            } else {
                return null;
            }
        } catch (Exception e) {
            System.out.println("error");
            return null;
        }
    }

    public static List<Field> getNotNullFields(Object object) {
        Field[] fields = object.getClass().getDeclaredFields();
        List<Field> result = new ArrayList<>();
        for (Field field : fields) {
            if (FieldReflectUtil.getObjectField(object, field) != null) {
                result.add(field);
            }
        }
        return result;
    }


}
