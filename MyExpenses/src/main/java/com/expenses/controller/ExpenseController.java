package com.expenses.controller;

import com.expenses.entity.Expense;
import com.expenses.enums.ExpenseCategory;
import com.expenses.exception.ExpenseNotFoundException;
import com.expenses.service.ExpenseService;
import com.expenses.util.CurrencyFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

@Controller
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/")
    public String redirectToExpenses() {
        return "redirect:/expenses";
    }

    @GetMapping("/expenses")
    public String listExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount,
            Model model) {
        
        try {
            List<Expense> expenses = expenseService.getAllExpenses();
            Double totalAmount = expenseService.calculateTotalExpenseAmount();

            // Apply category filter if present
            ExpenseCategory selectedCategory = null;
            if (category != null && !category.isEmpty()) {
                try {
                    selectedCategory = ExpenseCategory.valueOf(category.toUpperCase());
                    expenses = expenseService.getExpensesByCategory(selectedCategory);
                    totalAmount = expenseService.calculateTotalExpenseAmountByCategory(selectedCategory);
                    model.addAttribute("selectedCategory", selectedCategory);
                } catch (IllegalArgumentException e) {
                    // Invalid category - ignore the filter
                }
            }

            // Apply date filter if both dates are present
            if (startDate != null && endDate != null) {
                if (!endDate.isBefore(startDate)) {
                    expenses = expenseService.getExpensesBetweenDates(startDate, endDate);
                    model.addAttribute("startDate", startDate);
                    model.addAttribute("endDate", endDate);
                }
            }

            // Apply amount filter if both values are present
            if (minAmount != null && maxAmount != null) {
                if (maxAmount >= minAmount) {
                    expenses = expenseService.getExpensesBetweenRanges(minAmount, maxAmount);
                    model.addAttribute("minAmount", minAmount);
                    model.addAttribute("maxAmount", maxAmount);
                }
            }

            model.addAttribute("expenses", expenses);
            model.addAttribute("totalAmount", totalAmount);
            model.addAttribute("currencyFormatter", new CurrencyFormatter());
            model.addAttribute("categories", ExpenseCategory.values());

            // Add category-wise totals when no category filter is applied
            if (selectedCategory == null) {
                for (ExpenseCategory cat : ExpenseCategory.values()) {
                    Double categoryTotal = expenseService.calculateTotalExpenseAmountByCategory(cat);
                    model.addAttribute("total_" + cat.name().toLowerCase(), categoryTotal);
                }
            }

        } catch (Exception e) {
            model.addAttribute("error", "An error occurred while processing your request. Please try again.");
            model.addAttribute("expenses", expenseService.getAllExpenses());
            model.addAttribute("totalAmount", expenseService.calculateTotalExpenseAmount());
            model.addAttribute("currencyFormatter", new CurrencyFormatter());
            model.addAttribute("categories", ExpenseCategory.values());
        }

        return "expenses/list";
    }

    @GetMapping("/expenses/new")
    public String showCreateForm(Model model) {
        model.addAttribute("expense", new Expense());
        model.addAttribute("categories", ExpenseCategory.values());
        return "expenses/form";
    }

    @PostMapping("/expenses/new")
    public String createExpense(@ModelAttribute Expense expense, RedirectAttributes redirectAttributes) {
        expenseService.createExpense(expense);
        redirectAttributes.addFlashAttribute("message", "Expense created successfully!");
        return "redirect:/expenses";
    }

    @GetMapping("/expenses/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        model.addAttribute("expense", expenseService.getExpenseById(id).orElseThrow());
        model.addAttribute("categories", ExpenseCategory.values());
        return "expenses/form";
    }

    @PostMapping("/expenses/edit/{id}")
    public String updateExpense(@PathVariable Long id, @ModelAttribute Expense expense, RedirectAttributes redirectAttributes) {
        expenseService.updateExpense(id, expense);
        redirectAttributes.addFlashAttribute("message", "Expense updated successfully!");
        return "redirect:/expenses";
    }

    @GetMapping("/expenses/delete/{id}")
    public String deleteExpense(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        expenseService.deleteExpense(id);
        redirectAttributes.addFlashAttribute("message", "Expense deleted successfully!");
        return "redirect:/expenses";
    }
}
