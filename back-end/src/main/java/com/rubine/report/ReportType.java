package com.rubine.report;

import lombok.Getter;

@Getter
public enum ReportType {
    USER("user_report"),
    PRODUCT("product_report"),
    ORDER("order_report");

    private final String fileName;

    ReportType(String fileName) {
        this.fileName = fileName;
    }
}
