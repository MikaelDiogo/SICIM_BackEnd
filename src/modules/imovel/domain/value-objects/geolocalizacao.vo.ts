import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

// Bounding box do município de Crateús/CE (SRID 4326)
const BBOX = {
  latMin: -5.65,
  latMax: -4.70,
  lngMin: -41.20,
  lngMax: -40.10,
};

export class GeolocalizacaoForaDoBboxError extends DomainError {
  constructor(lat: number, lng: number) {
    super(
      `Geolocalização (${lat}, ${lng}) está fora do município de Crateús/CE.`,
    );
  }
}

export class Geolocalizacao {
  private constructor(
    readonly latitude: number,
    readonly longitude: number,
  ) {}

  static criar(latitude: number, longitude: number): Geolocalizacao {
    const dentroDoMunicipio =
      latitude >= BBOX.latMin &&
      latitude <= BBOX.latMax &&
      longitude >= BBOX.lngMin &&
      longitude <= BBOX.lngMax;

    if (!dentroDoMunicipio) {
      throw new GeolocalizacaoForaDoBboxError(latitude, longitude);
    }

    return new Geolocalizacao(latitude, longitude);
  }

  equals(outro: Geolocalizacao): boolean {
    return this.latitude === outro.latitude && this.longitude === outro.longitude;
  }

  toGeoJSON(): { type: 'Point'; coordinates: [number, number] } {
    return { type: 'Point', coordinates: [this.longitude, this.latitude] };
  }
}
