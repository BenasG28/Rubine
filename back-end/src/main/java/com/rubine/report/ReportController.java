package com.rubine.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ExcelReportService excelReportService;


    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    public ReportController(ExcelReportService excelReportService) {
        this.excelReportService = excelReportService;
    }

    //TODO Implement difference in data retrieval for SYS_ADMIN and ADMIN (password, other sensitive info).

    @GetMapping("/user")
    public ResponseEntity<byte[]> getUserReport(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        try {
            byte[] report;
            if (startDate == null || endDate == null) {
                // If no date range is provided, fetch all users
                report = excelReportService.generateUserExcelReport(null, null);
            } else {
                // Fetch users within the date range
                report = excelReportService.generateUserExcelReport(startDate, endDate);
            }
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=users_report.xlsx")
                    .body(report);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/product")
    public ResponseEntity<byte[]> getProductReport(
            @RequestParam(required = false) String productType) {
        try {
            byte[] report = excelReportService.generateProductExcelReport(productType);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=products_report.xlsx")
                    .body(report);
        } catch (IOException e) {
            logger.error("Error generating product report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/order")
    public ResponseEntity<byte[]> getOrderReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            byte[] report = excelReportService.generateOrderExcelReport(startDate, endDate);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=orders_report.xlsx")
                    .body(report);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



}
