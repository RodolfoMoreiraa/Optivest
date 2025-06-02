import yfinance as yf

# Escolher uma ação, ex: Galp Energia
galp = yf.Ticker("GALP.LS")

# Buscar o histórico dos últimos 5 anos
hist = galp.history(period="5y")

# Mostrar no terminal as últimas 5 linhas
print(hist.tail())
