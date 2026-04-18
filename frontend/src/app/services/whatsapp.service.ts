import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { SettingService } from './setting.service';
import { ContactService } from './contact.service';
import { SettingsMap } from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private settings: SettingsMap = {};
  private loaded = false;

  constructor(
    private settingService: SettingService,
    private contactService: ContactService
  ) {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.settingService.getPublicSettings().subscribe({
      next: (res) => {
        if (res.success) {
          this.settings = res.data;
          this.loaded = true;
        }
      },
      error: () => {
        // Fallback values
        this.settings = {
          contacto_metodo: 'whatsapp',
          contacto_whatsapp: '573195631384'
        };
        this.loaded = true;
      }
    });
  }

  private getMethod(): string {
    return this.settings['contacto_metodo'] || 'whatsapp';
  }

  sendProductMessage(product: Product, cantidad: number = 1): void {
    const method = this.getMethod();

    // Registrar clic
    this.contactService.trackClick({
      metodo: method,
      tipo: 'producto',
      productId: product.id,
      productName: product.nombre
    }).subscribe();

    if (method === 'whatsapp') {
      const phone = this.settings['contacto_whatsapp'] || '573195631384';
      const message = `¡Hola! 🍄 Estoy interesado en el producto:\n\n` +
        `*${product.nombre}*\n` +
        `Precio: $${product.precio}\n` +
        `Cantidad: ${cantidad}\n\n` +
        `¿Podrían darme más información?`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');

    } else if (method === 'telefono') {
      const phone = this.settings['contacto_telefono'] || '';
      window.open(`tel:${phone}`, '_blank');

    } else if (method === 'email') {
      const email = this.settings['contacto_email'] || '';
      const subject = encodeURIComponent(`Consulta sobre: ${product.nombre}`);
      const body = encodeURIComponent(
        `¡Hola! 🍄 Estoy interesado en el producto:\n\n` +
        `${product.nombre}\n` +
        `Precio: $${product.precio}\n` +
        `Cantidad: ${cantidad}\n\n` +
        `¿Podrían darme más información?`
      );
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

    } else if (method === 'instagram') {
      const user = this.settings['contacto_instagram'] || '';
      window.open(`https://ig.me/m/${user}`, '_blank');
    }
  }

  sendGeneralMessage(): void {
    const method = this.getMethod();

    // Registrar clic
    this.contactService.trackClick({
      metodo: method,
      tipo: 'general'
    }).subscribe();

    if (method === 'whatsapp') {
      const phone = this.settings['contacto_whatsapp'] || '573195631384';
      const message = `¡Hola! 🍄 Me gustaría obtener información sobre sus productos.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');

    } else if (method === 'telefono') {
      const phone = this.settings['contacto_telefono'] || '';
      window.open(`tel:${phone}`, '_blank');

    } else if (method === 'email') {
      const email = this.settings['contacto_email'] || '';
      const subject = encodeURIComponent('Consulta general');
      const body = encodeURIComponent('¡Hola! 🍄 Me gustaría obtener información sobre sus productos.');
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

    } else if (method === 'instagram') {
      const user = this.settings['contacto_instagram'] || '';
      window.open(`https://ig.me/m/${user}`, '_blank');
    }
  }

  getContactInfo(): { method: string; label: string; icon: string } {
    const method = this.getMethod();
    switch (method) {
      case 'whatsapp': return { method, label: 'WhatsApp', icon: '💬' };
      case 'telefono': return { method, label: 'Llamar', icon: '📞' };
      case 'email': return { method, label: 'Email', icon: '📧' };
      case 'instagram': return { method, label: 'Instagram', icon: '📸' };
      default: return { method: 'whatsapp', label: 'WhatsApp', icon: '💬' };
    }
  }
}
