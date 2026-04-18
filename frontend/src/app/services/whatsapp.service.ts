import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private phoneNumber = '573195631384';

  sendProductMessage(product: Product, cantidad: number = 1): void {
    const message = `¡Hola! 🍄 Estoy interesado en el producto:\n\n` +
      `*${product.nombre}*\n` +
      `Precio: $${product.precio}\n` +
      `Cantidad: ${cantidad}\n\n` +
      `¿Podrían darme más información?`;

    const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  sendGeneralMessage(): void {
    const message = `¡Hola! 🍄 Me gustaría obtener información sobre sus productos.`;
    const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
