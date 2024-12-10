package com.rubine.report;

import com.rubine.order.Order;
import com.rubine.order.OrderService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderReportGenerator {

    private final OrderService orderService;

    public OrderReportGenerator(OrderService orderService) {
        this.orderService = orderService;
    }

    public byte[] generateOrderExcelReport(String startDate, String endDate) throws IOException {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
        List<Order> orders = orderService.getAllOrders();

        if (start != null && end != null) {
            orders = orders.stream()
                    .filter(order -> order.getDateCreated() != null &&
                            (order.getDateCreated().isEqual(start) || order.getDateCreated().isAfter(start)) &&
                            (order.getDateCreated().isEqual(end) || order.getDateCreated().isBefore(end)))
                    .toList();
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Orders");

            String[] headers = {"ID", "Date Created", "Purchase Amount", "Status", "User ID"};
            ExcelReportUtils.createHeaderRow(sheet, headers, workbook);

            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);
                ExcelReportUtils.populateDataRow(row, order);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
