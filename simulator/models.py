from django.db import models
from django.contrib.auth.models import User

class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True)  # Ex: AAPL, NOS.LS
    name = models.CharField(max_length=100)
    currency = models.CharField(max_length=10, default='EUR')

    def __str__(self):
        return f"{self.name} ({self.symbol})"

class Simulation(models.Model):
    STRATEGY_CHOICES = [
        ('DCA', 'Dollar Cost Averaging'),
        ('LUMP', 'Lump Sum'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="simulations")
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    strategy = models.CharField(max_length=10, choices=STRATEGY_CHOICES)
    initial_amount = models.FloatField()
    monthly_contribution = models.FloatField(default=0.0)
    duration_years = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    profit = models.FloatField(default=0.0)
    total_shares = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol} ({self.strategy})"

class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_value = models.FloatField(default=0.0)
    dividend_yield = models.FloatField(default=0.0)

    def __str__(self):
        return f"Portfolio de {self.user.username}"
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

    @property
    def profile_image_url(self):
        if self.profile_image:
            return self.profile_image.url
        return ""
    

class WatchlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'stock')


