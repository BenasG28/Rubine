package com.rubine.report;

import com.rubine.user.User;
import com.rubine.user.UserService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class UserReportGenerator {

    private final UserService userService;

    public UserReportGenerator(UserService userService) {
        this.userService = userService;
    }

    public byte[] generateUserExcelReport(LocalDate startDate, LocalDate endDate) throws IOException {
        List<User> users = userService.getAllUsers();
        if (startDate != null && endDate != null) {
            users = users.stream()
                    .filter(user -> user.getBirthDate() != null &&
                            !user.getBirthDate().isBefore(startDate) &&
                            !user.getBirthDate().isAfter(endDate))
                    .toList();
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Users");

            String[] headers = {"ID", "Name", "Surname", "Email", "Phone", "Gender", "Birth Date", "Region", "Roles"};
            ExcelReportUtils.createHeaderRow(sheet, headers, workbook);

            int rowIdx = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);
                ExcelReportUtils.populateDataRow(row, user);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}

