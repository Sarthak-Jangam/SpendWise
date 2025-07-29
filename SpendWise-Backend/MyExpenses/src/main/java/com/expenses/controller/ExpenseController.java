package com.expenses.controller;

import com.expenses.entity.Expense;
import com.expenses.enums.ExpenseCategory;
import com.expenses.exception.ExpenseNotFoundException;
import com.expenses.service.ExpenseService;
import com.expenses.util.CurrencyFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }


    @GetMapping("")
    public ResponseEntity<?> listExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount
    ) {
        try {
            List<Expense> expenses = expenseService.getAllExpenses();
            Double totalAmount = expenseService.calculateTotalExpenseAmount();
            ExpenseCategory selectedCategory = null;
            if (category != null && !category.isEmpty()) {
                try {
                    selectedCategory = ExpenseCategory.valueOf(category.toUpperCase());
                    expenses = expenseService.getExpensesByCategory(selectedCategory);
                    totalAmount = expenseService.calculateTotalExpenseAmountByCategory(selectedCategory);
                } catch (IllegalArgumentException e) {
                    // Invalid category - ignore the filter
                }
            }
            if (startDate != null && endDate != null && !endDate.isBefore(startDate)) {
                expenses = expenseService.getExpensesBetweenDates(startDate, endDate);
            }
            if (minAmount != null && maxAmount != null && maxAmount >= minAmount) {
                expenses = expenseService.getExpensesBetweenRanges(minAmount, maxAmount);
            }
            // Category-wise totals
            Map<String, Double> categoryTotals = new java.util.HashMap<>();
            for (ExpenseCategory cat : ExpenseCategory.values()) {
                categoryTotals.put(cat.name(), expenseService.calculateTotalExpenseAmountByCategory(cat));
            }
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("expenses", expenses);
            response.put("totalAmount", totalAmount);
            response.put("categories", ExpenseCategory.values());
            response.put("categoryTotals", categoryTotals);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing your request. Please try again.");
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createExpense(@RequestBody Expense expense) {
        Expense created = expenseService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExpense(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .<ResponseEntity<?>>map(expense -> ResponseEntity.ok(expense))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        try {
            Expense updated = expenseService.updateExpense(id, expense);
            return ResponseEntity.ok(updated);
        } catch (ExpenseNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.noContent().build();
        } catch (ExpenseNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
