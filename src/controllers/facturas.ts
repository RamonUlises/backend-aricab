import { Request, Response } from 'express';
import FacturasModels from '../models/facturas';
import { ProductoFacturaType } from '@/types/facturas';

class FacturasControllers {
  async obtenerFacturas(req: Request, res: Response) {
    try {
      const facturas = await FacturasModels.obtenerFacturas();

      if (facturas.length === 0) {
        return res.status(404).json({ message: 'No hay facturas' });
      }

      return res.status(200).json(facturas);
    } catch {
      res.status(500).json({ message: 'Error al obtener facturas' });
    }
  }
  async obtenerFactura(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const factura = await FacturasModels.obtenerFactura(id);

      if (!factura) {
        return res.status(404).json({ message: 'Factura no existe' });
      }

      return res.status(200).json(factura);
    } catch {
      res.status(500).json({ message: 'Error al obtener factura' });
    }
  }
  async crearFactura(req: Request, res: Response) {
    try {
      const { id, nombre, productos, tipo, facturador, fecha, pagado } = req.body as {
        id: string;
        nombre: string;
        productos: ProductoFacturaType[];
        tipo: string;
        facturador: string;
        fecha: Date;
        pagado: number;
      };

      if (
        !nombre ||
        !Array.isArray(productos) ||
        !tipo ||
        !facturador ||
        isNaN(new Date(fecha).getTime())
      ) {
        return res.status(400).json({ message: 'Faltan datos' });
      }

      const response = await FacturasModels.crearFactura({
        id,
        nombre,
        fecha,
        productos,
        tipo,
        total: 0,
        'id-facturador': facturador,
        pagado,
      });

      if (response === 'Cliente no encontrado') {
        return res.status(404).json({ message: response });
      }

      if (response === 'Error al crear la factura') {
        return res.status(400).json({ message: response });
      }

      return res.status(200).json({ message: response });
    } catch {
      res.status(500).json({ message: 'Error al crear factura' });
    }
  }
  async actualizarFactura(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { productos, tipo, pagado } = req.body as { productos: ProductoFacturaType[], tipo: string, pagado: number };

      if (!Array.isArray(productos)) {
        return res.status(400).json({ message: 'Faltan datos' });
      }

      const response = await FacturasModels.actualizarFactura(id, productos, tipo, pagado);

      if (response === 'Factura no encontrada') {
        return res.status(404).json({ message: response });
      }

      if (response === 'Error al actualizar la factura') {
        return res.status(400).json({ message: response });
      }

      return res.status(200).json({ message: response });
    } catch {
      res.status(500).json({ message: 'Error al actualizar factura' });
    }
  }
  async eliminarFactura(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await FacturasModels.eliminarFactura(id);

      if (response === 'Error al eliminar la factura') {
        return res.status(400).json({ message: response });
      }

      return res.status(200).json({ message: response });
    } catch {
      res.status(500).json({ message: 'Error al eliminar factura' });
    }
  }
  async abonarFactura(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { abono } = req.body as { abono: number };

      if (isNaN(abono)) {
        return res.status(400).json({ message: 'Faltan datos' });
      }

      const response = await FacturasModels.abonarFactura(id, abono);

      if (response === 'Factura no encontrada') {
        return res.status(404).json({ message: response });
      }

      if (response === 'Error al abonar la factura') {
        return res.status(400).json({ message: response });
      }

      return res.status(200).json({ message: response });
    } catch {
      res.status(500).json({ message: 'Error al abonar factura' });
    }
  }
}

export default new FacturasControllers();
