package com.expenses.util;

import java.text.NumberFormat;
import java.util.Locale;

public class CurrencyFormatter {
    private static final NumberFormat indianCurrencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

    public static String format(Double amount) {
        if (amount == null) {
            return "₹0.00";
        }
        return indianCurrencyFormat.format(amount);
    }

    public static String formatWithoutSymbol(Double amount) {
        if (amount == null) {
            return "0.00";
        }
        String formatted = indianCurrencyFormat.format(amount);
        // Remove the currency symbol and any spaces
        return formatted.substring(1).trim();
    }
} 