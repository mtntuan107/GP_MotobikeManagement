from django.contrib import admin
from django.template.response import TemplateResponse
from django.utils.html import format_html

from .models import *



class MyAdminSite(admin.AdminSite):
    site_header = 'Motobike Management Admin Site'

class MMAdmin(admin.ModelAdmin):
    list_display = ['brand','engine_capacity','model_code','color','image_tag','year','price','company']
    list_filter = ('company',)
    def image_tag(self, obj):
        if obj.image:
            return format_html(
                '<img src="https://res.cloudinary.com/dryypwknd/{}" width="100" height="100" />'.format(obj.image))
        return "No Image"

    image_tag.short_description = 'Image'

class PartAdmin(admin.ModelAdmin):
    list_display = ['name','part_number','image_tag','duration_tag','price_tag','company','category']
    list_filter = ('category','company')
    def image_tag(self, obj):
        if obj.image:
            return format_html(
                '<img src="https://res.cloudinary.com/dryypwknd/{}" width="100" height="100" />'.format(obj.image))
        return "No Image"


    def duration_tag(self, obj):
        return obj.duration
    def price_tag(self, obj):
        return obj.price
    duration_tag.short_description = 'Duration (days)'
    image_tag.short_description = 'Image'
    price_tag.short_description = 'Price (VND)'

class UMAdmin(admin.ModelAdmin):
    list_display = ['user','motorbike_model']
    list_filter = ('motorbike_model','user')

class POMMAdmin(admin.ModelAdmin):
    list_display = ['part','motorbike_model']
    list_filter = ('motorbike_model','part')
    def part_category(self, obj):
        return obj.part.category.name

admin_site = MyAdminSite('Motobike Management')

# Register
admin_site.register(Company)
admin_site.register(PartCategory)
admin_site.register(Part, PartAdmin)
admin_site.register(MotorbikeModel, MMAdmin)
admin_site.register(PartMM, POMMAdmin)
admin_site.register(UserMotorbike, UMAdmin)
admin_site.register(Account)
admin_site.register(MaintenanceType)
admin_site.register(Maintenance)