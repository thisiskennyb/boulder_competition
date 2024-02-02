from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status


class DjoserJWtAuthTest(APITestCase):
    def setUp(self):
        # Endpoint for user creation
        url = '/api/users/'
        # dummy user data
        data = {
        "first_name": "BobbyHill",
        "last_name": "DaleBill",
        "email": "testuser@gmail.com",
        "password": "mysecretpassword",
        "re_password": "mysecretpassword"
        }
        # Making client request with dummy data to endpoint
        response = self.client.post(url, data, format='json')
        # Verifying User was created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Query the user that was created
        self.user = get_user_model().objects.get(email="testuser@gmail.com")
        # Check that user is not active when created (should require email activation)
        self.assertFalse(self.user.is_active)

        # Activate user
        self.user.is_active = True
        # Save so active user can be reused in future tests
        self.user.save()
        # Check that user is active at the end of setup
        self.assertTrue(self.user.is_active)

        

    def test_user_registration(self):
        # Endpoint to get jwt token
        url = '/api/jwt/create/'
        # Dummy loggin credentials
        jwt_create_data = {
            "email": "testuser@gmail.com",
            "password": "mysecretpassword",
            }
        
        jwt_create_response = self.client.post(url, jwt_create_data, format='json')
        # Check Response is 200
        self.assertEqual(jwt_create_response.status_code, status.HTTP_200_OK)
        # Check existence of tokens
        self.assertIsNotNone(jwt_create_response.data['refresh'])
        self.assertIsNotNone(jwt_create_response.data['access'])

    def test_refresh(self):
        create_url = '/api/jwt/create/'
        jwt_create_data = {
            "email": "testuser@gmail.com",
            "password": "mysecretpassword",
            }
        
        jwt_create_response = self.client.post(create_url, jwt_create_data, format='json')
        self.assertEqual(jwt_create_response.status_code, status.HTTP_200_OK)
        refresh_token = jwt_create_response.data['refresh']
        url = '/api/jwt/refresh/'
        payload = {"refresh": refresh_token}
        refresh = self.client.post(url, payload, format='json')
        self.assertIsNotNone(refresh.data['access'])

    def test_access(self):
        create_url = '/api/jwt/create/'
        jwt_create_data = {
            "email": "testuser@gmail.com",
            "password": "mysecretpassword",
            }
        
        jwt_create_response = self.client.post(create_url, jwt_create_data, format='json')
        self.assertEqual(jwt_create_response.status_code, status.HTTP_200_OK)
        access_token = jwt_create_response.data['access']
        url = '/api/jwt/verify/'
        payload = {"token": access_token}
        response = self.client.post(url, payload, format='json')
        self.assertEqual({}, response.data)
        



