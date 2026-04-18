export interface Setting {
  id?: number;
  clave: string;
  valor: string;
  descripcion?: string;
}

export interface SettingsMap {
  [clave: string]: string;
}
