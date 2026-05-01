// Auto-generate with: npx supabase gen types typescript --project-id wbrdrxuleuojdpgfrjov > src/types/database.ts
// Hand-maintained to match the actual schema (verified 2026-04-30 via MCP).

export type CategoriaReporte = 'bache' | 'agua' | 'basura' | 'alumbrado' | 'drenaje' | 'grafiti' | 'otro';
export type SeveridadReporte = 'low' | 'medium' | 'high';
// estado is stored as text in the DB; these are the valid values.
export type EstadoReporte    = 'pending' | 'confirmed' | 'assigned' | 'resolved' | 'pendiente';

export type Database = {
  public: {
    Tables: {
      reportes: {
        Row: {
          id:          string;           // uuid
          creado_en:   string;           // timestamptz
          titulo:      string;
          descripcion: string | null;
          foto_url:    string | null;
          ubicacion:   string | null;    // geography (serialized as WKT/GeoJSON)
          estado:      string;           // text, default 'pendiente'
          tipo:        CategoriaReporte;
          severidad:   SeveridadReporte;
          votos:       number;
          anon_id:     string | null;    // uuid
        };
        Insert: {
          titulo:       string;
          descripcion?: string | null;
          foto_url?:    string | null;
          ubicacion?:   string | null;
          estado?:      string;
          tipo?:        CategoriaReporte;
          severidad?:   SeveridadReporte;
          votos?:       number;
          anon_id?:     string | null;
        };
        Update: {
          titulo?:      string;
          descripcion?: string | null;
          foto_url?:    string | null;
          ubicacion?:   string | null;
          estado?:      string;
          tipo?:        CategoriaReporte;
          severidad?:   SeveridadReporte;
          votos?:       number;
          anon_id?:     string | null;
        };
        Relationships: [];
      };
      confirmaciones: {
        Row: {
          id:         string;   // uuid
          reporte_id: string;   // uuid
          anon_id:    string;   // uuid
          created_at: string;   // timestamptz
        };
        Insert: {
          reporte_id: string;
          anon_id:    string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: 'confirmaciones_reporte_id_fkey';
            columns: ['reporte_id'];
            isOneToOne: false;
            referencedRelation: 'reportes';
            referencedColumns: ['id'];
          },
        ];
      };
      notificaciones: {
        Row: {
          id:          string;        // uuid
          anon_id:     string;        // uuid
          tipo:        string;
          title:       string;
          description: string | null;
          reporte_id:  string | null; // uuid
          leida:       boolean;
          created_at:  string;        // timestamptz
        };
        Insert: {
          anon_id:      string;
          tipo:         string;
          title:        string;
          description?: string | null;
          reporte_id?:  string | null;
          leida?:       boolean;
        };
        Update: {
          leida?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'notificaciones_reporte_id_fkey';
            columns: ['reporte_id'];
            isOneToOne: false;
            referencedRelation: 'reportes';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views:     Record<string, never>;
    Functions: {
      reportes_cercanos: {
        Args: { lat: number; lng: number; radio_m?: number };
        Returns: Database['public']['Tables']['reportes']['Row'][];
      };
    };
    Enums: {
      categoria_reporte: CategoriaReporte;
      severidad_reporte: SeveridadReporte;
    };
    CompositeTypes: Record<string, never>;
  };
};
