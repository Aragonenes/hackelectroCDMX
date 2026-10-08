"""Prepara geometría a 50 m, CEM 4.0 y auditoría conservadora; no descarga datos.
python3 scripts/preparar-jornada.py --terrain /tmp/ruta1-cem4.tif
Requiere Pillow. Entradas meteorológicas horarias opcionales: --weather CSV.
"""
import argparse, csv, hashlib, json, math, collections
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--terrain', required=True)
p.add_argument('--weather')
a = p.parse_args()

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def distance(a, b):
    x1, y1, x2, y2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    h = math.sin((y2-y1)/2)**2 + math.cos(y1)*math.cos(y2)*math.sin((x2-x1)/2)**2
    return 6371008.8 * 2 * math.atan2(math.sqrt(h), math.sqrt(1-h))

image = Image.open(a.terrain)
t = image.tag_v2[34264]
def elevation(point):
    # Centro de celda; interpolación bilineal sin inventar valores NoData.
    x, y = (point[0]-t[3])/t[0]-.5, (point[1]-t[7])/t[5]-.5
    ix, iy = math.floor(x), math.floor(y)
    values = [image.getpixel((xx, yy)) for xx, yy in [(ix,iy),(ix+1,iy),(ix,iy+1),(ix+1,iy+1)]]
    if any(v == 32767 for v in values):
        raise ValueError('NoData en el terreno: no se sustituye por cero')
    fx, fy = x-ix, y-iy
    return values[0]*(1-fx)*(1-fy)+values[1]*fx*(1-fy)+values[2]*(1-fx)*fy+values[3]*fx*fy

route_path = ROOT/'public/data/routes.geojson'
features = [f for f in json.loads(route_path.read_text())['features'] if f['properties'].get('recordId')=='M09-514']
segments = []
offset = 0
for trace, feature in enumerate(features, 1):
    coords = feature['geometry']['coordinates']
    lengths = [0]
    for x, y in zip(coords, coords[1:]): lengths.append(lengths[-1]+distance(x,y))
    positions = [i*50 for i in range(math.ceil(lengths[-1]/50))]+[lengths[-1]]
    samples = []
    for d in positions:
        j = next((j for j in range(len(lengths)-1) if lengths[j+1]>=d),len(lengths)-2)
        f = (d-lengths[j])/(lengths[j+1]-lengths[j])
        xy = [coords[j][k]+(coords[j+1][k]-coords[j][k])*f for k in range(2)]
        samples.append((d,xy,elevation(xy)))
    heights = [sum(s[2] for s in samples[max(0,i-2):i+3])/len(samples[max(0,i-2):i+3]) for i in range(len(samples))]
    for i in range(len(samples)-1):
        start, end = samples[i],samples[i+1]
        segments.append(dict(trace=trace, sector=min(2,int(start[0]/lengths[-1]*3)), fromKm=(offset+start[0])/1000, toKm=(offset+end[0])/1000, start=start[1], end=end[1], elevationStartM=round(heights[i],3), elevationEndM=round(heights[i+1],3)))
    offset += lengths[-1]
prepared = dict(routeId='M09-514', cycleKm=offset/1000, sampleM=50, smoothing='Media móvil centrada de 5 muestras por trazo; extremos truncados; no conecta trazos.', terrain='INEGI CEM 4.0 · 15 m', terrainSha256=digest(a.terrain), geometrySha256=digest(route_path), sourceId='J-CEM', segments=segments)
(ROOT/'src/data/journey-route.json').write_text(json.dumps(prepared,ensure_ascii=False,indent=2)+'\n')
rows = list(csv.DictReader((ROOT/'docs/investigacion/Variables_Factores/catalogo-modelos-consumo-dinamico.csv').open()))
status = lambda value, unit: dict(value=value, unit=unit, status='supuesto' if value is not None else 'desconocido', sourceId='J-AUDIT', level='F', limitation='Propuesta del expediente; variante y condiciones de prueba no acreditadas.')
audit = []
for r in rows:
    audit.append(dict(id=r['ID'], name=r['Marca']+' '+r['Modelo'], category='van' if r['ID'].startswith('VAN') else 'minibus' if r['ID'].startswith('MIDI') else 'urban', variant='Por confirmar; no equivale a una configuración mexicana homologada', parameters=dict(batteryKwh=status(float(r['Bateria_Nominal_kWh']),'kWh nominales'), massKg=status(float(r['Tara_Estimada_kg']),'kg sin pasajeros'), capacity=status(int(r['Plazas_Nominales']),'plazas supuestas'), consumption=status(float(r['Consumo_Base_kWh_km']),'kWh/km netos de referencia'), hvac=status(r['Tecnologia_HVAC'],'configuración propuesta'), price=status(None,'MXN'), maxChargeKw=status(None,'kW'), connector=status(None,'tipo'))))
(ROOT/'src/data/journey-vehicles.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
print(f'{len(segments)} tramos; {len(audit)} modelos; desnivel total ascendente {sum(max(0,s["elevationEndM"]-s["elevationStartM"]) for s in segments):.1f} m')

if a.weather:
    vals=collections.defaultdict(list)
    with open(a.weather,encoding='utf-8-sig') as f:
     for _ in range(9):next(f)
     for r in csv.DictReader(f):
      if r['id_station']!='PED' or r['id_parameter']!='TMP':continue
      try:v=float(r['value'])
      except ValueError:continue
      if not -30<v<50:continue
      month=int(r['date'][5:7]);hour=int(r['date'][11:13]);season='fria' if month in (11,12,1,2) else 'calida' if month in (3,4,5) else 'lluvias'
      vals[season,hour].append(v)
    profiles={season:[round(sum(vals[season,h])/len(vals[season,h]),3) for h in range(24)] for season in ['fria','calida','lluvias']}
    d=dict(sourceId='J-MET',station='PED · Pedregal (SIMAT REDMET)',years='2023',coverage=f'{sum(len(v) for v in vals.values())} registros TMP válidos de 8760 horas posibles; medias por temporada/hora, sin imputación.',profiles=profiles)
    Path('src/data/journey-climate.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    manifest=dict(date='2026-10-08',url='https://aire.cdmx.gob.mx/descargas/Opendata/anuales_horarios/meteorologia_2023.csv',sha256=hashlib.sha256(Path(a.weather).read_bytes()).hexdigest(),station='PED',counts={season:[len(vals[season,h]) for h in range(24)] for season in profiles},method='Media aritmética de TMP por estación PED, temporada y hora civil tal como figura en CSV. Excluye no numéricos y fuera de (-30,50) °C. Fría nov–feb; cálida mar–may; lluvias jun–oct. No estima lluvia ni temperatura de batería.',retention='Original inspeccionado temporalmente; se conserva derivación propia, no CSV externo. El inventario histórico no cambia.')
    Path('docs/desarrollo/fuentes-jornada.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
