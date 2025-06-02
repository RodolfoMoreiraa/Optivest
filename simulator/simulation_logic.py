import yfinance as yf
import pandas as pd
from .models import Portfolio, Simulation

def simulate_dca(symbol, initial_amount, monthly_contribution, duration_years):
    stock = yf.Ticker(symbol)
    hist = stock.history(period=f"{duration_years}y").resample('ME').last()

    total_shares = 0
    cash_invested = initial_amount

    if not hist.empty:
        first_price = hist.iloc[0]['Close']
        total_shares += initial_amount / first_price

    for date in hist.index[1:]:
        price = hist.loc[date]['Close']
        if price > 0:
            shares_bought = monthly_contribution / price
            total_shares += shares_bought
            cash_invested += monthly_contribution

    return _final_result(hist, total_shares, cash_invested)

def simulate_lump_sum(symbol, initial_amount, duration_years):
    stock = yf.Ticker(symbol)
    hist = stock.history(period=f"{duration_years}y").resample('ME').last()

    total_shares = 0
    cash_invested = initial_amount

    if not hist.empty:
        first_price = hist.iloc[0]['Close']
        total_shares += initial_amount / first_price

    return _final_result(hist, total_shares, cash_invested)


def simulate_with_dividends(symbol, initial_amount, monthly_contribution, duration_years):
    stock = yf.Ticker(symbol)
    hist = stock.history(period=f"{duration_years}y").resample('ME').last()
    dividends = stock.dividends.resample('ME').sum()

    total_shares = 0
    cash_invested = initial_amount

    if not hist.empty:
        first_price = hist.iloc[0]['Close']
        total_shares += initial_amount / first_price

    for date in hist.index[1:]:
        price = hist.loc[date]['Close']
        if price > 0:
            shares_bought = monthly_contribution / price
            total_shares += shares_bought
            cash_invested += monthly_contribution

            dividend_per_share = dividends.get(date, 0)
            if dividend_per_share > 0:
                dividend_total = total_shares * dividend_per_share
                shares_from_dividends = dividend_total / price
                total_shares += shares_from_dividends

    return _final_result(hist, total_shares, cash_invested)


def _final_result(hist, total_shares, cash_invested):
    last_price = hist.iloc[-1]['Close'] if not hist.empty else 0
    portfolio_value = total_shares * last_price
    profit = portfolio_value - cash_invested

    return {
        "cash_invested": round(float(cash_invested or 0), 2),
        "portfolio_value": round(float(portfolio_value or 0), 2),
        "profit": round(float(profit or 0), 2),
        "total_shares": round(float(total_shares or 0), 4)
    }


def update_portfolio(user):
    simulations = Simulation.objects.filter(user=user)

    total_invested = 0
    total_value = 0

    for sim in simulations:
        if sim.strategy == "DCA":
            result = simulate_dca(sim.stock.symbol, sim.initial_amount, sim.monthly_contribution, sim.duration_years)
        elif sim.strategy == "LUMP_SUM":
            result = simulate_lump_sum(sim.stock.symbol, sim.initial_amount, sim.duration_years)
        elif sim.strategy == "DIV":
            result = simulate_with_dividends(sim.stock.symbol, sim.initial_amount, sim.monthly_contribution, sim.duration_years)
        else:
            continue  # ou logar erro de estratégia desconhecida

        total_invested += result["cash_invested"]
        total_value += result["portfolio_value"]

    profit = total_value - total_invested

    portfolio, created = Portfolio.objects.get_or_create(user=user)
    portfolio.total_value = round(total_value, 2)
    portfolio.dividend_yield = round((profit / total_invested) * 100, 2) if total_invested > 0 else 0
    portfolio.save()


