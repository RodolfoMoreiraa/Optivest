from rest_framework import serializers
from .models import Stock, Simulation, Portfolio, UserProfile
from django.contrib.auth.models import User
from .models import WatchlistItem

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class SimulationSerializer(serializers.ModelSerializer):
    stock_name = serializers.CharField(source='stock.name', read_only=True)
    class Meta:
        model = Simulation
        fields = '__all__'
        read_only_fields = ['user']

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'date_joined', 'profile_image', 'profile_image_url']

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            return request.build_absolute_uri(obj.profile_image.url)
        return None


class WatchlistItemSerializer(serializers.ModelSerializer):
    stock_name = serializers.CharField(source="stock.name", read_only=True)

    class Meta:
        model = WatchlistItem
        fields = ['id', 'stock', 'stock_name']