from django.contrib import admin
from django.urls import path, include
from simulator import views
from rest_framework_simplejwt.views import (  # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
)
from simulator.views_auth import RegisterView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('simulator.urls')),
    path('api/market-data/', views.MarketDataAPIView.as_view(), name='market_data'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
]

if settings.DEBUG:
    urlpatterns += static("/media/", document_root=settings.MEDIA_ROOT)
