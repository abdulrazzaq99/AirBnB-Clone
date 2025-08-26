from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from property.models import Property, PropertyImage
import uuid

User = get_user_model()


class Command(BaseCommand):
    help = "Create sample properties"

    def handle(self, *args, **options):
        # Create a host user if it doesn't exist
        host_email = "host@example.com"
        try:
            host = User.objects.get(email=host_email)
        except User.DoesNotExist:
            host = User.objects.create_user(
                email=host_email,
                password="password123",
                first_name="John",
                last_name="Host",
            )
            self.stdout.write(f"Created host user: {host_email}")

        # Sample properties data
        properties_data = [
            {
                "title": "Modern Apartment in Downtown",
                "description": "Beautiful modern apartment with stunning city views. Perfect for business travelers and couples.",
                "location": "New York, United States",
                "address": "123 Main St, New York, NY 10001",
                "price_per_night": 120.00,
                "bedrooms": 2,
                "bathrooms": 1,
                "guests": 4,
                "amenities": "WiFi,Kitchen,Air conditioning,Heating",
            },
            {
                "title": "Cozy Beach House",
                "description": "Relaxing beachfront property with direct ocean access. Wake up to the sound of waves.",
                "location": "Miami, United States",
                "address": "456 Ocean Drive, Miami, FL 33139",
                "price_per_night": 200.00,
                "bedrooms": 3,
                "bathrooms": 2,
                "guests": 6,
                "amenities": "WiFi,Kitchen,Beach access,Parking",
            },
            {
                "title": "Mountain Cabin Retreat",
                "description": "Peaceful cabin in the mountains with hiking trails nearby. Perfect for nature lovers.",
                "location": "Denver, United States",
                "address": "789 Mountain View Rd, Denver, CO 80202",
                "price_per_night": 85.00,
                "bedrooms": 2,
                "bathrooms": 1,
                "guests": 4,
                "amenities": "WiFi,Fireplace,Kitchen,Hiking trails",
            },
            {
                "title": "Luxury Villa with Pool",
                "description": "Spacious villa with private pool and garden. Ideal for family vacations.",
                "location": "Los Angeles, United States",
                "address": "321 Beverly Hills Dr, Los Angeles, CA 90210",
                "price_per_night": 350.00,
                "bedrooms": 5,
                "bathrooms": 3,
                "guests": 10,
                "amenities": "WiFi,Pool,Kitchen,Garden,Parking",
            },
            {
                "title": "Historic Loft in Arts District",
                "description": "Unique loft in a converted warehouse with exposed brick and high ceilings.",
                "location": "Chicago, United States",
                "address": "654 Arts District Ave, Chicago, IL 60601",
                "price_per_night": 95.00,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 2,
                "amenities": "WiFi,Kitchen,Workspace,Art galleries nearby",
            },
        ]

        created_count = 0
        for prop_data in properties_data:
            # Check if property already exists
            if not Property.objects.filter(title=prop_data["title"]).exists():
                property_instance = Property.objects.create(host=host, **prop_data)
                created_count += 1
                self.stdout.write(f"Created property: {property_instance.title}")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully created {created_count} properties")
        )
