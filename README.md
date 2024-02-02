# JWT Auth Template

Starting point:
We are starting from scratch. At this point I have made a directory for my project, with the directories frontend, backend, and webserver which are all empty at this point. We will begin from creating 

## Starting the Backend


#### Create your venv

```
python -m venv venv
```

Don't forget to activate:
```
source venv/bin/activate
```

#### Install Dependencies
Some dependencies we will need for this are:
- djangorestframework
- djoser
- python-dotenv
- django-ses

You should already be familiar with djangorestframework and python-dotenv. Djoser is a third party library that provides us with some Django Rest Framework Views to help deal with authentication.

Reference: https://djoser.readthedocs.io/en/latest/introduction.html

```
pip install djangorestframework djoser python-dotenv "psycopg[binary] django-ses"
```

Helpful note: Don't forget to update your requirements anytime you add or change your dependencies

```
pip freeze > requirements.txt
```

#### Create Project

```
python -m django startproject jwt_auth_db .
```

#### Create App

```
python manage.py startapp users
```

##### Setting up Django settings and .env
Inside your backend directory at the root level create an .env file:
```
touch .env
```

Inside your django settings import getenv and dotenv:

```
from os import getenv, path
from pathlib import Path
import dotenv
```

A simple way we can make sure our .env gets loaded is by placing this in our settings:

```
dotenv_file = BASE_DIR / '.env'

if path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)
```

Note that setting up the secret key like this implies you have a .env with 'DJANGO_SECRET_KEY' assigned to something

get_random_secret_key() is a built-in that we can import like:
```
from django.core.management.utils import get_random_secret_key
```


```
SECRET_KEY = getenv('DJANGO_SECRET_KEY', get_random_secret_key())
```
Note that there are many configuration setups and settings you can make use of. We will leave a lot of things hardcoded until we establish that things are working properly.


### Development setup

Lets update our ALLOWED_HOSTS in our django settings to be '*' for now, we will change this later.
```
ALLOWED_HOSTS = ['*']
```

### Add restframework to installed apps

```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
]
```

Now we can modify an example from the docs to set up rest_framework the way we would like to use it:
https://www.django-rest-framework.org/#example
```
REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}
```

We want to utilize the permission class IsAuthenticated so we can change our example to:

```
REST_FRAMEWORK = {
    
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ]
}

```

However we still need to add in our default authentication classes:

Similar to how we only installed restframework and did not need to install django.. simplejwt is a dependency of djoser so we do not need to install anything else to access the simplejwt authentication class
```
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ]
}
```

### Setting up DJOSER

First lets make sure djoser is in our installed apps:

```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'djoser',
]
```



Lets update our settings for Djoser:

You can find information about the available settings configuration for djoser at https://djoser.readthedocs.io/en/latest/settings.html

```
DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'activation/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'TOKEN_MODEL': None,
}
```


## Making Custom User Model

At this point we now want to add 'users' to our installed apps in our django settings.


Use the docs to help make a customized user model https://docs.djangoproject.com/en/5.0/topics/auth/customizing/
Towards the example you will find a full example we can modify for our users app

##### Note: This is the example from the docs that we are modifying
```
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class MyUserManager(BaseUserManager):
    def create_user(self, email, date_of_birth, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, date_of_birth, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    date_of_birth = models.DateField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["date_of_birth"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
```

Lets create a checklist to keep track of our changes:
- Change required fields to ['first_name', 'last_name']
- Remove date_of_birth_field
- Remove verbose from MyUser(AbstractBaseUser)
- Add 'first_name' and 'last_name' fields to MyUser(AbstractBaseUser)
- Rename MyUser to UserAccount
- Update objects in UserAccount(AbstractBaseUser) to use UserAccountManager
- Rename MyManager(BaseUserManager) to UserAccountManager(BaseUserManager)
- Remove date_of_birth argument from UserAccountManager
- Add an argument of **kwargs to handle first_name, last_name
- Normalize and .lower email before processing
- Add **kwargs to be used in User
- Add PermissionsMixin to imports to be used in UserAccount
- Remove is_admin from UserAccount and add is_staff and is_superuser with default=false
- On the create_superuser method, remove and replace date_of_birth with **kwargs
- instead of having the method changing is_admin to true, add lines for is_staff and is_superuser
- Add AUTH_USER_MODEL to django settings to use users.UserAccount

Our users.models should look like:

```
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")
        
        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        user = self.create_user(
            email,
            password=password,
            **kwargs
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=255)
   
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
```

And we have added this to our django settings:
```
AUTH_USER_MODEL = 'users.UserAccount'
```

Okay at this point we have created a custom user model, but we are still not quite ready to test things out yet. When a user signs up, we will be sending an activation email to the user to let them activate their account

# Amazon SES (Simple Email Service) Setup

Docs: https://github.com/django-ses/django-ses

```

# Email settings
EMAIL_BACKEND = 'django_ses.SESBackend'
DEFAULT_FROM_EMAIL = 'successphil90@gmail.com'

AWS_SES_ACCESS_KEY_ID = getenv('AWS_SES_ACCESS_KEY_ID')
AWS_SES_SECRET_ACCESS_KEY = getenv('AWS_SES_SECRET_ACCESS_KEY')
AWS_SES_REGION_NAME = getenv('AWS_SES_REGION_NAME')
AWS_SES_REGION_ENDPOINT = f'email.{AWS_SES_REGION_NAME}.amazonaws.com'
AWS_SES_FROM_EMAIL = 'successphil90@gmail.com'
USE_SES_V2 = True

DOMAIN = getenv('DOMAIN')
SITE_NAME = 'JWT Template'
```

You are going to want to go to AWS and search SES as a service.

Make sure to take note of the region you are setup in as you will need it in your django settings

Under Configuration --> Verified Identities, you need to add and verify an email address for the sender and receiver
(You just need to verify at least 2 addresses, it will send you confirmation emails to activate)

Next go to SMTP settings --> Create SMTP Credentials
Click create and you will get the credentials for your access_key and secret_access_key
Update the permissions by clicking add permissions --> attach policies directly --> search SES --> ReadOnlyAccess

Make sure to properly update your .env to utlize the email settings above


#### Initial testing

Ok we have set quite a few things up. At this point we should be able to make migrations and test what we have set up so far on our backend.

Lets start by adding a docker-compose.yml to our backend to dockerize our database

```
touch docker-compose.yml
```

Your docker-compose should look something like:
```
version: '3'
services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=jwt_auth_db
    ports:
      - '5454:5432'
    volumes: 
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```


And our django settings for our database should look something like:

```
DATABASES = {
"default": {
"ENGINE": "django.db.backends.postgresql",
"NAME": "jwt_auth_db", 
"USER": "postgres",
"PASSWORD": "postgres",
"HOST": "localhost",
"PORT": 5454,
    }
}
```

### Update settings urls:

```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('djoser.urls')),
    path('api/', include('djoser.urls.jwt'))
]
```

If everything is correct you should be able to run docker compose up -d
Once the container has started you should be able to start your django server and make migrations

###### Create User endpoint (POST):

```
http://127.0.0.1:8000/api/users/
```

Body:
```
{
    "first_name": "Bobbyphil",
    "last_name": "Daddoo",
    "email": "pbasti1990@gmail.com",
    "password": "mysecretpassword",
    "re_password": "mysecretpassword"
}
```

Expected Response: 201 Created:

```
{
    "first_name": "Bobbyphil",
    "last_name": "Daddoo",
    "email": "pbasti1990@gmail.com",
    "id": 1
}
```

###### Activation Endoint (POST):

```
localhost:8000/api/users/activation/
```

To activate we are going to need to check the email address used to get our uid and token.

Example link:
```
http://localhost:5173/activation/MQ/c0pt3o-9f8071745887cb280bf74e2c37a196a8
```

Body:
```
{
    "uid": "MQ",
    "token": "c0pt3o-9f8071745887cb280bf74e2c37a196a8"
}
```

Expected Response: 204 No Content

###### JWT CREATE Endpoint (POST):

```
localhost:8000/api/jwt/create/
```

As of now we need to make a Post with the email and password used for the account:

Body:
```
{
"email": "pbasti1990@gmail.com",
"password": "mysecretpassword"
}
```

Expected Response: 200 OK with access and refresh token
```
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwNTE5MjYyNywiaWF0IjoxNzA1MTA2MjI3LCJqdGkiOiJiNmVlNzcwZjQwNjM0NzA4OTZiN2ZiZjg5YjE5ZTY2MCIsInVzZXJfaWQiOjF9.pe93MDsLm-WzDCnje8H10zFYip_bFtTIU2nMGhshS8s",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1MTA2NTI3LCJpYXQiOjE3MDUxMDYyMjcsImp0aSI6IjM3NWQwOTRkYzc2NTRiMjhiNGI3OTEwMjQzNTkxNjA1IiwidXNlcl9pZCI6MX0.VNkmlyfaC2gWZtZLEthwQmvTlQTZzpgTj0epYhV_GGo"
}
```

###### JWT Refresh Endpoint (POST):

```
localhost:8000/api/jwt/refresh/
```

Body:
```
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwNTE5MzExMiwiaWF0IjoxNzA1MTA2NzEyLCJqdGkiOiIyMjljZGJiMGJjNjY0NTA1YWI5OTUwMjZiOTE0ZDFhOCIsInVzZXJfaWQiOjF9.z1_NQiExbezyycWKvNKoUIvcdtkGmbLt4_-F-tF455o"
}
```

Expected Response: 200 OK with access token

```
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1MTA3MDM0LCJpYXQiOjE3MDUxMDY3MTIsImp0aSI6ImNmOWU4NjNlMjRhNzRhYWJiOWM1MWQwYmM5MjI2MDJiIiwidXNlcl9pZCI6MX0.HuIMRYln1fhvgX1NVU9DSdSjG5XIg4Zw97J7H8mgf3M"
}
```

###### JWT Verify Endpoint (POST)

```
localhost:8000/api/jwt/verify/
```

token is the access token
Body:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1MTA3MDM0LCJpYXQiOjE3MDUxMDY3MTIsImp0aSI6ImNmOWU4NjNlMjRhNzRhYWJiOWM1MWQwYmM5MjI2MDJiIiwidXNlcl9pZCI6MX0.HuIMRYln1fhvgX1NVU9DSdSjG5XIg4Zw97J7H8mgf3M"
}
```

Expected Response: 200 OK {}

###### Retrieve User Endpoint (GET)

```
localhost:8000/api/users/me/
```

(the access token goes after Bearer)
For now, we need to add a authorization header to our request:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1MTA3NTMyLCJpYXQiOjE3MDUxMDcyMzIsImp0aSI6IjI4ZGUxMmE5NjIxMTQ5MjZiZjk4ZTVjMTVlN2EzNDRiIiwidXNlcl9pZCI6MX0.wuQGL7Jy8doXMNy-GhfAZD9XaPWpeCioD1hCh4qkAtk
```

Expected Response: 200 OK

```
{
    "first_name": "Bobbyphil",
    "last_name": "Daddoo",
    "id": 1,
    "email": "pbasti1990@gmail.com"
}
```


###### Reset Password Endpoint (POST)

```
localhost:8000/api/users/reset_password/
```

Body:
```
{
    "email": "pbasti1990@gmail.com"
}
```

Expected Response: 204 No Content

###### Reset Password Confirm Endpoint (POST)
This endpoint needs the uid and token from the email that was sent out, as well as the new password and matching password

```
localhost:8000/api/users/reset_password_confirm/
```

Body:
```
{
    "uid": "MQ",
    "token": "c0purp-7422f8aab683895917bc099960882a67",
    "new_password": "mysecretpassword2",
    "re_password": "mysecretpassword2"
}
```

Expected Response: 204 No Content


## Customizing Authentication

Lets add some variables to our settings that we will use later:
```
#Auth Settings
AUTH_COOKIE = 'access'
AUTH_COOKIE_ACCESS_MAX_AGE = 60 * 5
AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_SECURE = 'False'
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = '/'
AUTH_COOKIE_SAMESITE = 'None'
```

Inside the users app, create a new file called authentication.py

Authentication.py:
```
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            header = self.get_header(request)
            if header is None:
                raw_token = request.COOKIES.get(settings.AUTH_COOKIE)
            else:
                raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None

            validated_token = self.get_validated_token(raw_token)

            return self.get_user(validated_token), validated_token
        except:
            return None
```

Now that we have made this file we need to update our django settings to use our CustomJWTAuth

```

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
       'users.authentication.CustomJWTAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ]
}
```

Another thing we will want to do is make sure that our users views override some built in authentication classes, specifically TokenObtainPairView, TokenRefreshView, and TokenVerifyView. We additionally added a Logout View as well, but that is utilizing APIView and is not being used to override anything

Your users.views should look something like:

```
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
        return response
    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token
        
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token
        return super().post(request, *args, **kwargs)
    

    
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response
```


## Setting up our users urls.py

Add a file called urls.py to the users app

```
from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    LogoutView,
    )

urlpatterns = [
    path('jwt/create/', CustomTokenObtainPairView.as_view()),
    path('jwt/refresh/', CustomTokenRefreshView.as_view()),
    path('jwt/verify/', CustomTokenVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),

]

```

With this set up, we want to adjust our settings urls.py to use our users.urls

```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('djoser.urls')),
    path('api/', include('users.urls'))
]
```

## At this point we can test our endpoints again

When we hit the JWT Create endpoint to get our access and refresh token, we should see in postman that we now have access and refresh cookies with our tokens stored.

If things are set up properly, you should be able to receive your access token and cookie and try making a request to the Retrieve User Endpoint without providing an authorization header.

Note that tokens expire every 5 minutes, so if you waited longer than that you will need to hit the create endpoint again.

This should also be the case with our refresh and verify endpoints

At minimum, the last thing you should verify is that the logout view correctly clears a users cookies





To Be Continued ... 




# React Frontend setup

Inside the frontend folder create a react app with vite

```
npm create vite@latest .
```



Lets also install tailwind:
1.
```
npm install -D tailwindcss postcss autoprefixer
```
2.
```
npx tailwindcss init -p
```

tailwindconfig.js
```
/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),],
}

```

index.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Once thats done go ahead and install axios and react-router-dom

```
npm install axios
```

```
npm install react-router-dom
```


