package com.rubine.report;

import com.rubine.order.Order;
import com.rubine.order.OrderService;
import com.rubine.product.Product;
import com.rubine.product.ProductService;
import com.rubine.user.Role;
import com.rubine.user.User;
import com.rubine.user.UserService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExcelReportService {

    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;

    public ExcelReportService(UserService userService, ProductService productService, OrderService orderService) {
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
    }

    public byte[] generateUserExcelReport(LocalDate startDate, LocalDate endDate) throws IOException {
        // Fetch all users
        List<User> users = userService.getAllUsers();

        // Filter by date range if startDate and endDate are not null
        if (startDate != null && endDate != null) {
            users = users.stream()
                    .filter(user -> user.getBirthDate() != null &&
                            !user.getBirthDate().isBefore(startDate) &&
                            !user.getBirthDate().isAfter(endDate))
                    .collect(Collectors.toList());
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Users");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Name", "Surname", "Email", "Phone Number", "Gender", "Birth Date", "Region", "Roles"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderCellStyle(workbook));
            }

            // Populate data rows
            int rowIdx = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getName());
                row.createCell(2).setCellValue(user.getSurname());
                row.createCell(3).setCellValue(user.getEmail());
                row.createCell(4).setCellValue(user.getPhoneNumber());
                row.createCell(5).setCellValue(user.getGender() != null ? user.getGender().name() : "N/A");
                row.createCell(6).setCellValue(user.getBirthDate() != null ? user.getBirthDate().toString() : "N/A");
                row.createCell(7).setCellValue(user.getSelectedRegion() != null ? user.getSelectedRegion().name() : "N/A");
                row.createCell(8).setCellValue(user.getRoles().stream()
                        .map(Role::getName)
                        .reduce((a, b) -> a + ", " + b)
                        .orElse("No Roles"));
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }


    private CellStyle createHeaderCellStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }
    public byte[] generateProductExcelReport(String productType) throws IOException {
        // Fetch all products
        List<Product> products = productService.getAllProducts();

        // Filter products by productType if provided
        if (productType != null && !productType.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getProductType() != null) // Ensure product has a type
                    .filter(product -> product.getProductType().name().equalsIgnoreCase(productType)) // Match product type
                    .collect(Collectors.toList());
        }

        // Debugging: Print filtered product list size
        System.out.println("Filtered product count: " + products.size());

        // If no products match the filter, return an empty Excel file or handle appropriately
        if (products.isEmpty()) {
            try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                Sheet sheet = workbook.createSheet("Products");

                // Create header row
                Row headerRow = sheet.createRow(0);
                String[] headers = {"ID", "Brand", "Color", "Description", "Price", "Product Type"};
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                    cell.setCellStyle(createHeaderCellStyle(workbook));
                }

                workbook.write(out);
                return out.toByteArray(); // Return an empty Excel file with headers only
            }
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Products");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Brand", "Color", "Description", "Price", "Product Type"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderCellStyle(workbook));
            }

            // Populate data rows
            int rowIdx = 1;
            for (Product product : products) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(product.getId());
                row.createCell(1).setCellValue(product.getBrand());
                row.createCell(2).setCellValue(product.getColor());
                row.createCell(3).setCellValue(product.getDescription());
                row.createCell(4).setCellValue(product.getPrice() != null ? product.getPrice() : 0.0);
                row.createCell(5).setCellValue(product.getProductType() != null ? product.getProductType().name() : "N/A");
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }


    public byte[] generateOrderExcelReport(String startDate, String endDate) throws IOException {
        // Parse date range if provided
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;

        // Fetch all orders
        List<Order> orders = orderService.getAllOrders();

        // Filter orders by date range if provided
        if (start != null && end != null) {
            orders = orders.stream()
                    .filter(order -> order.getDateCreated() != null &&
                            (order.getDateCreated().isEqual(start) || order.getDateCreated().isAfter(start)) &&
                            (order.getDateCreated().isEqual(end) || order.getDateCreated().isBefore(end)))
                    .collect(Collectors.toList());
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Orders");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Date Created", "Purchase Amount", "Status", "User ID"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderCellStyle(workbook));
            }

            // Populate data rows
            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getDateCreated() != null ? order.getDateCreated().toString() : "N/A");
                row.createCell(2).setCellValue(order.getPurchaseAmount() != null ? order.getPurchaseAmount() : 0.0);
                row.createCell(3).setCellValue(order.getStatus() != null ? order.getStatus().name() : "N/A");
                row.createCell(4).setCellValue(order.getUser() != null ? order.getUser().getId() : 0);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

}
