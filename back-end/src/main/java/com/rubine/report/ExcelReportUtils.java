package com.rubine.report;

import com.rubine.product.Product;
import com.rubine.user.User;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import com.rubine.user.Role;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import com.rubine.order.Order;
import org.apache.poi.ss.usermodel.*;

public class ExcelReportUtils {

    // Privatus konstruktorius, kad užkirstų kelią klasės egzempliorių kūrimui
    private ExcelReportUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    // Bendras metodas, kuris sukuria header'į bet kokiai ataskaitai
    public static void createHeaderRow(Sheet sheet, String[] headers, Workbook workbook) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(createHeaderCellStyle(workbook));
        }
    }

    // Bendras stilius header'io cellams
    public static CellStyle createHeaderCellStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    // Bendras metodas duomenų eilutėms užpildyti
    public static void populateDataRow(Row row, Object entity) {
        if (entity instanceof User user) {
            populateUserData(row, user);
        } else if (entity instanceof Product product) {
            populateProductData(row, product);
        } else if (entity instanceof Order order) {
            populateOrderData(row, order);
        }
    }

    // Atskiras metodas vartotojo duomenims užpildyti
    private static void populateUserData(Row row, User user) {
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

    // Atskiras metodas produkto duomenims užpildyti
    private static void populateProductData(Row row, Product product) {
        row.createCell(0).setCellValue(product.getId());
        row.createCell(1).setCellValue(product.getBrand());
        row.createCell(2).setCellValue(product.getColor());
        row.createCell(3).setCellValue(product.getDescription());
        row.createCell(4).setCellValue(product.getPrice() != null ? product.getPrice() : 0.0);
        row.createCell(5).setCellValue(product.getProductType() != null ? product.getProductType().name() : "N/A");
    }

    // Atskiras metodas užsakymo duomenims užpildyti
    private static void populateOrderData(Row row, Order order) {
        row.createCell(0).setCellValue(order.getId());
        row.createCell(1).setCellValue(order.getDateCreated() != null ? order.getDateCreated().toString() : "N/A");
        row.createCell(2).setCellValue(order.getPurchaseAmount() != null ? order.getPurchaseAmount() : 0.0);
        row.createCell(3).setCellValue(order.getStatus() != null ? order.getStatus().name() : "N/A");
        row.createCell(4).setCellValue(order.getUser() != null ? order.getUser().getId() : 0);
    }
}