from django.contrib import admin
from .views import Account, AccountHistory

# Register your models here.
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    model = Account

@admin.register(AccountHistory)
class AccountHistoryAdmin(admin.ModelAdmin):
    model = AccountHistory
