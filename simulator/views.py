from rest_framework import viewsets
from .models import Stock, Simulation, Portfolio, WatchlistItem
from .serializers import StockSerializer, SimulationSerializer, PortfolioSerializer, WatchlistItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .simulation_logic import simulate_dca, simulate_lump_sum, simulate_with_dividends, update_portfolio
from .models import Simulation, Stock
from django.contrib.auth.models import User
import yfinance as yf
import pandas as pd
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserProfileSerializer
from .models import UserProfile


class RealSimulationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Logar os dados recebidos para depuração
            print("Dados recebidos:", request.data)
            print("Utilizador autenticado:", request.user)

            # Lendo dados do corpo da requisição
            symbol = request.data.get('symbol')
            initial_amount = float(request.data.get('initial_amount'))  # Certifica-se de que é float
            monthly_contribution = float(request.data.get('monthly_contribution'))  # Certifica-se de que é float
            duration_years = int(request.data.get('duration_years'))  # Certifica-se de que é inteiro
            strategy = request.data.get('strategy')

            if strategy is None:
                return Response({"error": "A estratégia é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)

            print(f"Estrategia recebida: {strategy}")
            
            # Verificar se os dados são válidos
            if not symbol or initial_amount <= 0 or duration_years <= 0:
                return Response({"error": "Dados inválidos"}, status=400)

            if strategy == "DCA" and monthly_contribution <= 0:
                return Response({"error": "Contribuição mensal é obrigatória para DCA."}, status=400)

            if strategy == "LUMP_SUM" and monthly_contribution != 0:
                return Response({"error": "Contribuição mensal deve ser 0 para Lump Sum."}, status=400)

            # chamar funcao simulate_dca
            if strategy == "DCA":
                simulation_result = simulate_dca(symbol, initial_amount, monthly_contribution, duration_years)
            elif strategy == "LUMP_SUM":
                simulation_result = simulate_lump_sum(symbol, initial_amount, duration_years)
            elif strategy == "DIV":
                simulation_result = simulate_with_dividends(symbol, initial_amount, monthly_contribution, duration_years)
            else:
                return Response({"error": "Estratégia inválida."}, status=400)

            # Logar os resultados da simulação antes de enviar
            print("Resultado da simulação antes de enviar para o frontend:", simulation_result)

            simulation_result = {
                "cash_invested": round(float(simulation_result["cash_invested"]), 2),
                "portfolio_value": round(float(simulation_result["portfolio_value"]), 2),
                "profit": round(float(simulation_result["profit"]), 2),
                "total_shares": round(float(simulation_result["total_shares"]), 4),
            }

            # Logar a resposta final antes de enviar
            print("Enviando resposta com os dados da simulação:", simulation_result)

            # Guardar no banco
            user = request.user
            stock = Stock.objects.get(symbol=symbol)

            sim = Simulation.objects.create(
                user=user,
                stock=stock,
                strategy=strategy,
                initial_amount=initial_amount,
                monthly_contribution=monthly_contribution,
                duration_years=duration_years,
                profit=simulation_result["profit"],
                total_shares=simulation_result["total_shares"],
            )

            print(f"Simulação criada com sucesso: {sim}")

            # Atualiza o Portfolio do utilizador
            update_portfolio(user)

            # Logar o retorno da resposta antes de enviá-la
            print("Enviando resposta com os dados da simulação:", simulation_result)

            return Response(simulation_result, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Erro no backend:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class MarketDataAPIView(APIView):
    def get(self, request):
        try:
            stocks = [
                "GALP.LS", "JMT.LS", "EDP.LS", "SON.LS", "BCP.LS", 
                "NOS.LS", "ALTR.LS", "CTT.LS", "EGL.LS", "NVG.LS",
                "IBS.LS", "COR.LS"
            ]

            market_data = []

            def format_volume(volume):
                if volume >= 1_000_000_000:
                    return f"{volume / 1_000_000_000:.2f} bi"
                elif volume >= 1_000_000:
                    return f"{volume / 1_000_000:.2f} mi"
                elif volume >= 1_000:
                    return f"{volume / 1_000:.2f} mil"
                else:
                    return str(volume)

            for symbol in stocks:
                try:
                    stock = yf.Ticker(symbol)
                    stock_info = stock.history(period="1d")
                    dividends = stock.dividends.tail(1)

                    if stock_info.empty:
                        print(f"{symbol}: sem dados, ignorado.")
                        continue

                    try:
                        db_stock = Stock.objects.get(symbol=symbol)
                    except Stock.DoesNotExist:
                        print(f"⚠️ {symbol} não está na tabela Stock.")
                        continue

                    last_value = stock_info['Close'].iloc[-1]
                    if last_value == 0 or last_value is None:
                        continue

                    high = stock_info['High'].iloc[-1]
                    low = stock_info['Low'].iloc[-1]
                    volume = stock_info['Volume'].iloc[-1]
                    dividend = dividends.iloc[-1] if not dividends.empty else 0
                    dividend_yield = (dividend / last_value) * 100 if last_value > 0 else 0

                    change = 0
                    if len(stock_info) > 1:
                        change = ((stock_info['Close'].iloc[-1] - stock_info['Close'].iloc[-2]) / stock_info['Close'].iloc[-2])
                    
                    db_stock = Stock.objects.get(symbol=symbol)

                    data = {
                        "id": db_stock.id,
                        "symbol": symbol,
                        "last_value": last_value,
                        "high": high,
                        "low": low,
                        "change": change,
                        "volume": format_volume(volume),
                        "dividends": dividend_yield,
                    }

                    market_data.append(data)
                except Exception as err:
                    print(f"Erro ao buscar {symbol}: {err}")
                    continue

            return Response(market_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class SimulationViewSet(viewsets.ModelViewSet):
    queryset = Simulation.objects.all()
    serializer_class = SimulationSerializer

    serializer_class = SimulationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("🔍 User autenticado no GET:", self.request.user)
        return Simulation.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def portfolio_summary(request):
    user = request.user
    portfolio_items = Simulation.objects.filter(user=user)

    summary = {}

    for item in portfolio_items:
        symbol = item.stock.symbol
        name = item.stock.name
        shares = item.total_shares  
        invested = item.initial_amount + (item.monthly_contribution * item.duration_years * 12)

        if symbol not in summary:
            summary[symbol] = {
                "symbol": symbol,
                "name": name,
                "total_invested": 0,
                "total_shares": 0,
            }

        summary[symbol]["total_invested"] += invested
        summary[symbol]["total_shares"] += shares

    result = []

    for symbol, data in summary.items():
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="1d")
            if hist.empty:
                continue
            current_price = hist["Close"].iloc[-1]
            current_value = current_price * data["total_shares"]
            profit = current_value - data["total_invested"]

            result.append({
                "symbol": symbol,
                "name": data["name"],
                "total_shares": round(data["total_shares"], 2),
                "total_invested": round(data["total_invested"], 2),
                "current_price": round(current_price, 2),
                "current_value": round(current_value, 2),
                "profit": round(profit, 2)
            })
        except Exception as e:
            print(f"Erro ao processar {symbol}: {e}")

    return Response(result)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_simulations_by_stock(request, symbol):
    user = request.user
    try:
        stock = Stock.objects.get(symbol=symbol)
        simulations = Simulation.objects.filter(user=user, stock=stock)
        deleted_count = simulations.count()
        simulations.delete()
        return Response({"message": f"{deleted_count} simulações apagadas com sucesso."}, status=204)
    except Stock.DoesNotExist:
        return Response({"error": "Ação não encontrada."}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    try:
        profile, _ = UserProfile.objects.get_or_create(user=user)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    if request.method == "GET":
        serializer = UserProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserProfileSerializer(profile, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def watchlist_view(request):
    user = request.user

    if request.method == 'GET':
        items = WatchlistItem.objects.filter(user=user)
        serializer = WatchlistItemSerializer(items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        print("📩 POST recebido com dados:", request.data)
        stock_id = request.data.get('stock_id')
        if WatchlistItem.objects.filter(user=user, stock_id=stock_id).exists():
            return Response({'detail': 'Já está na watchlist'}, status=400)
        WatchlistItem.objects.create(user=user, stock_id=stock_id)
        return Response({'detail': 'Adicionado com sucesso!'})

    elif request.method == 'DELETE':
        stock_id = request.data.get('stock_id')
        WatchlistItem.objects.filter(user=user, stock_id=stock_id).delete()
        return Response({'detail': 'Removido com sucesso!'})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_watchlist(request):
    user = request.user
    favorites = WatchlistItem.objects.filter(user=user).select_related("stock")
    result = []

    def format_volume(volume):
        if volume >= 1_000_000_000:
            return f"{volume / 1_000_000_000:.2f} bi"
        elif volume >= 1_000_000:
            return f"{volume / 1_000_000:.2f} mi"
        elif volume >= 1_000:
            return f"{volume / 1_000:.2f} mil"
        else:
            return str(volume)

    for item in favorites:
        stock = item.stock
        try:
            data = yf.Ticker(stock.symbol)
            info = data.history(period="1d")
            if info.empty:
                continue

            last_value = info["Close"].iloc[-1]
            high = info["High"].iloc[-1]
            low = info["Low"].iloc[-1]
            volume = info["Volume"].iloc[-1]
            dividends = data.dividends.tail(1)
            dividend = dividends.iloc[-1] if not dividends.empty else 0
            dividend_yield = (dividend / last_value) * 100 if last_value > 0 else 0

            # Gerar sparkline fictício
            sparkline = [
                last_value + (i - 4) * 0.2 for i in range(8)
            ]

            result.append({
                "symbol": stock.symbol,
                "name": stock.name,
                "currency": stock.currency,
                "last_value": last_value,
                "high": high,
                "low": low,
                "volume": format_volume(volume),
                "dividends": dividend_yield,
                "sparkline": sparkline
            })
        except Exception as e:
            print(f"Erro ao processar {stock.symbol}: {e}")
            continue

    return Response(result)


    



