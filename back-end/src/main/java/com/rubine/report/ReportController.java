package com.rubine.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final UserReportGenerator userReportGenerator;
    private final ProductReportGenerator productReportGenerator;
    private final OrderReportGenerator orderReportGenerator;

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    private static final String CONTENT_DISPOSITION = "Content-Disposition";

    public ReportController(UserReportGenerator userReportGenerator,
                            ProductReportGenerator productReportGenerator,
                            OrderReportGenerator orderReportGenerator) {
        this.userReportGenerator = userReportGenerator;
        this.productReportGenerator = productReportGenerator;
        this.orderReportGenerator = orderReportGenerator;
    }

    // Bendras metodas, kad išvengti kodo dubliavimo
    private ResponseEntity<byte[]> generateReport(
            ReportType reportType,
            Object... params) {
        try {
            byte[] report = switch (reportType) {
                case USER -> userReportGenerator.generateUserExcelReport((LocalDate) params[0], (LocalDate) params[1]);
                case PRODUCT -> productReportGenerator.generateProductExcelReport((String) params[0]);
                case ORDER -> orderReportGenerator.generateOrderExcelReport((String) params[0], (String) params[1]);
            };
            return ResponseEntity.ok()
                    .header(CONTENT_DISPOSITION, "attachment; filename=" + reportType.getFileName() + ".xlsx")
                    .body(report);
        } catch (IOException e) {
            logger.error("Error generating report for " + reportType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<byte[]> getUserReport(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        try {
            byte[] report = userReportGenerator.generateUserExcelReport(startDate, endDate);
            return ResponseEntity.ok()
                    .header(CONTENT_DISPOSITION, "attachment; filename=user_report.xlsx")
                    .body(report);
        } catch (IOException e) {
            logger.error("Error generating user report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/product")
    public ResponseEntity<byte[]> getProductReport(@RequestParam(required = false) String productType) {
        try {
            byte[] report = productReportGenerator.generateProductExcelReport(productType);
            return ResponseEntity.ok()
                    .header(CONTENT_DISPOSITION, "attachment; filename=product_report.xlsx")
                    .body(report);
        } catch (IOException e) {
            logger.error("Error generating product report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/order")
    public ResponseEntity<byte[]> getOrderReport(@RequestParam(required = false) String startDate,
                                                 @RequestParam(required = false) String endDate) {
        try {
            byte[] report = orderReportGenerator.generateOrderExcelReport(startDate, endDate);
            return ResponseEntity.ok()
                    .header(CONTENT_DISPOSITION, "attachment; filename=order_report.xlsx")
                    .body(report);
        } catch (IOException e) {
            logger.error("Error generating order report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}