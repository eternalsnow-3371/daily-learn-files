package com.project.javaee.util;

import java.io.Serializable;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class MapHandleUtil {

    public static <K, V extends Comparable<? super V>> Comparator<Map.Entry<K, V>> comparingByValueDesc() {
        return (Comparator<Map.Entry<K, V>> & Serializable)
                (c1, c2) -> c2.getValue().compareTo(c1.getValue());
    }

    public static <K, V> Comparator<Map.Entry<K, V>> comparingByValueDesc(Comparator<? super V> cmp) {
        Objects.requireNonNull(cmp);
        return (Comparator<Map.Entry<K, V>> & Serializable)
                (c1, c2) -> cmp.compare(c2.getValue(), c1.getValue());
    }

    public Map<String, Double> sortByValue(Map<String, Double> map, Integer maxNum) {
        return map.entrySet().stream().sorted(Map.Entry.comparingByValue()).limit(maxNum)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    public Map<String, Double> sortByValueUseComp(Map<String, Double> map, Integer maxNum) {
        return map.entrySet().stream().sorted(comparingByValueDesc(new DoubleValueComparator(1.0))).limit(maxNum)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    public static class DoubleValueComparator implements Comparator<Double> {
        private Double base;

        public DoubleValueComparator(Double base) {
            this.base = base;
        }

        @Override
        public int compare(Double o1, Double o2) {
            return o2.compareTo(o1 + base);
        }
    }

}
