package com.expenses.service;

import com.expenses.entity.Expense;
import com.expenses.enums.ExpenseCategory;
import com.expenses.exception.ExpenseNotFoundException;
import com.expenses.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense expense) {
        if (expense.getCreatedAt() == null) {
            expense.setCreatedAt(java.time.LocalDate.now());
        }

        return expenseRepository.save(expense);
    }


    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Optional<Expense> existingExpense = expenseRepository.findById(id);
        if (existingExpense.isPresent()) {
            Expense expense = existingExpense.get();

            expense.setDescription(updatedExpense.getDescription());
            expense.setAmount(updatedExpense.getAmount());
            expense.setCategory(updatedExpense.getCategory());
            expense.setDate(updatedExpense.getDate());
            expense.setUpdatedAt(java.time.LocalDate.now());
            return expenseRepository.save(expense);
        }
        throw new ExpenseNotFoundException("Expense not found with id: " + id);
    }

    public void deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
        } else {
            throw new ExpenseNotFoundException("Expense not found with id: " + id);
        }
    }

    public List<Expense> getExpensesByCategory(ExpenseCategory category) {
        return expenseRepository.findByCategory(category);
    }

    public Double calculateTotalExpenseAmount() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    public List<Expense> getExpensesBetweenDates(LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public Double calculateTotalExpenseAmountByCategory(ExpenseCategory category) {
        List<Expense> expenses = expenseRepository.findByCategory(category);

        return expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    public List<Expense> getExpensesBetweenRanges(Double start, Double end) {
       return expenseRepository.findByAmountBetween(start, end);
    }
}

