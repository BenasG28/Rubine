package com.rubine.report;

import com.rubine.product.Product;
import com.rubine.product.ProductService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ProductReportGenerator {

    private final ProductService productService;

    public ProductReportGenerator(ProductService productService) {
        this.productService = productService;
    }

    public byte[] generateProductExcelReport(String productType) throws IOException {
        List<Product> products = productService.getAllProducts();
        if (productType != null && !productType.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getProductType() != null && product.getProductType().name().equalsIgnoreCase(productType))
                    .toList();
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Products");

            String[] headers = {"ID", "Brand", "Color", "Description", "Price", "Product Type"};
            ExcelReportUtils.createHeaderRow(sheet, headers, workbook);

            int rowIdx = 1;
            for (Product product : products) {
                Row row = sheet.createRow(rowIdx++);
                ExcelReportUtils.populateDataRow(row, product);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
