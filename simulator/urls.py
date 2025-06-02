from django.urls import path, include
from rest_framework import routers
from .views import StockViewSet, SimulationViewSet, PortfolioViewSet
from .views import RealSimulationAPIView
from . import views
from .views import portfolio_summary
from .views import delete_simulations_by_stock
from .views import user_profile
from django.conf import settings
from django.conf.urls.static import static
from .views import watchlist_view
from .views import user_watchlist

router = routers.DefaultRouter()
router.register(r'stocks', StockViewSet)
router.register(r'simulations', SimulationViewSet, basename='simulations')
router.register(r'portfolios', PortfolioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

urlpatterns += [
    path('market-data/', views.MarketDataAPIView.as_view(), name='market_data'),
    path('simulate-real/', RealSimulationAPIView.as_view(), name='simulate-real'),
    path('portfolio/', portfolio_summary, name='portfolio-summary'),
    path("delete-simulations/<str:symbol>/", delete_simulations_by_stock, name="delete_simulations"),
    path("profile/", user_profile, name="user_profile"),
    path('watchlist/data/', user_watchlist, name='user-watchlist'),
    path('watchlist/', watchlist_view, name='watchlist-view'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
