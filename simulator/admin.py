from django.contrib import admin
from .models import Stock, Simulation, Portfolio, WatchlistItem

admin.site.register(Stock)
admin.site.register(Simulation)
admin.site.register(Portfolio)
admin.site.register(WatchlistItem)