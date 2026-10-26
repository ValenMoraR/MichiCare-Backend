
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  categoria: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  categoria: string;
  stock: number;
}