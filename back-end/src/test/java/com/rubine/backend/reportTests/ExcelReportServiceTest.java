package com.rubine.backend.reportTests;

import com.rubine.order.Order;
import com.rubine.order.OrderService;
import com.rubine.order.OrderStatus;
import com.rubine.product.Product;
import com.rubine.product.ProductService;
import com.rubine.report.ExcelReportUtils;
import com.rubine.user.Role;
import com.rubine.user.User;
import com.rubine.user.UserService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ExcelReportServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private ProductService productService;

    @Mock
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = mock(UserService.class);
        productService = mock(ProductService.class);
        orderService = mock(OrderService.class);
    }
    @Test
    void testCreateHeaderRow() {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        String[] headers = {"ID", "Name", "Email"};

        ExcelReportUtils.createHeaderRow(sheet, headers, workbook);

        // Tikriname, ar header eilutė buvo tinkamai sukurta
        Row headerRow = sheet.getRow(0);
        assertNotNull(headerRow);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.getCell(i);
            assertNotNull(cell);
            assertEquals(headers[i], cell.getStringCellValue());
        }
    }
    @Test
    void testPopulateDataRowWithUser() {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        Row row = sheet.createRow(0);

        User user = new User();
        user.setId(1L);
        user.setName("John");
        user.setSurname("Doe");
        user.setEmail("john.doe@example.com");

        Role role = new Role();
        role.setName("Admin");
        user.setRoles(Set.of(role));

        ExcelReportUtils.populateDataRow(row, user);

        // Tikriname reikšmes
        assertEquals(1L, (long) row.getCell(0).getNumericCellValue());
        assertEquals("John", row.getCell(1).getStringCellValue());
        assertEquals("Doe", row.getCell(2).getStringCellValue());
        assertEquals("john.doe@example.com", row.getCell(3).getStringCellValue());
        assertEquals("Admin", row.getCell(8).getStringCellValue());
    }
    @Test
    void testPopulateDataRowWithProduct() {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        Row row = sheet.createRow(0);

        Product product = new Product();
        product.setId(1L);
        product.setBrand("TestBrand");
        product.setDescription("TestDescription");

        ExcelReportUtils.populateDataRow(row, product);

        // Tikriname reikšmes
        assertEquals(1L, (long) row.getCell(0).getNumericCellValue());
        assertEquals("TestBrand", row.getCell(1).getStringCellValue());
        assertEquals("TestDescription", row.getCell(3).getStringCellValue());
    }
    @Test
    void testPopulateDataRowWithOrder() {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        Row row = sheet.createRow(0);

        Order order = new Order();
        order.setId(1L);
        order.setDateCreated(LocalDate.of(2024, 12, 1));
        order.setPurchaseAmount(100.0);
        order.setStatus(OrderStatus.PENDING);

        ExcelReportUtils.populateDataRow(row, order);

        // Tikriname reikšmes
        assertEquals(1L, (long) row.getCell(0).getNumericCellValue());
        assertEquals("2024-12-01", row.getCell(1).getStringCellValue());
        assertEquals(100.0, row.getCell(2).getNumericCellValue());
        assertEquals("PENDING", row.getCell(3).getStringCellValue());
    }

}
