#!/usr/bin/env python3
"""Ejecutar desde cualquier ruta después de copiar este archivo a scripts/ del repo.
Lee public/data/routes.json y su manifiesto; emite CSV 995 filas sin inferir electricidad.
Opcional: lee data/electricidad-cdmx/relaciones-verificadas.csv para enlaces comprobados.
"""
import csv, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public/data/routes.json'
MANIFEST=ROOT/'public/data/routes-manifest.json'
OUTPUT=ROOT/'data/electricidad-cdmx/rutas-995-estado-electrificacion.csv'
LINKS=ROOT/'data/electricidad-cdmx/relaciones-verificadas.csv'
FIELDS=['id_ruta','clave_ruta','nombre_ramal','detalle','longitud_cartografica_km','numero_trazos','trazos_ids','fecha_interna_fuente','fuente_geografica','tecnologia_m09','estado_operativo_actual','estado_electrificacion','id_servicio_vinculado','fuente_vinculacion','fecha_verificacion','observaciones']
def build():
  routes=json.loads(SOURCE.read_text(encoding='utf-8'))
  manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
  assert len(routes)==manifest['records']==995, 'El inventario no coincide con los 995 registros esperados'
  linked={}
  if LINKS.exists():
    with LINKS.open(encoding='utf-8-sig',newline='') as f:
      for rec in csv.DictReader(f):
        rid=rec['id_ruta']
        if not rec.get('fuente_vinculacion') or not rec.get('fecha_verificacion') or not rec.get('id_servicio_vinculado'):
          raise ValueError('Vinculación incompleta: '+rid)
        if rid in linked:raise ValueError('Vinculación duplicada: '+rid)
        linked[rid]=rec
  rows=[]
  for r in routes:
    rel=linked.get(r['id'],{})
    rows.append(dict(id_ruta=r['id'],clave_ruta=r.get('route',''),nombre_ramal=r.get('name',''),detalle=r.get('detail',''),longitud_cartografica_km=r.get('cycleKm',''),numero_trazos=len(r.get('featureIds',[])),trazos_ids=';'.join(r.get('featureIds',[])),fecha_interna_fuente=r.get('internalDate',''),fuente_geografica=r.get('sourceId',''),tecnologia_m09=r.get('technology','unknown'),estado_operativo_actual='no_verificado',estado_electrificacion=rel.get('estado_electrificacion','no_verificado'),id_servicio_vinculado=rel.get('id_servicio_vinculado',''),fuente_vinculacion=rel.get('fuente_vinculacion',''),fecha_verificacion=rel.get('fecha_verificacion',''),observaciones='Trazo histórico: no implica operación vigente ni tecnología actual'))
  unknown=set(linked)-set(r['id'] for r in routes)
  if unknown:raise ValueError('IDs de ruta no encontrados: '+str(unknown))
  OUTPUT.parent.mkdir(parents=True,exist_ok=True)
  with OUTPUT.open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.DictWriter(f,fieldnames=FIELDS);w.writeheader();w.writerows(rows)
  print('Generados',len(rows),'registros:',OUTPUT)
if __name__=='__main__':build()
