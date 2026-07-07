import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

// Bounding box of the municipality of Crateús/CE (SRID 4326)
const BBOX = {
  latMin: -5.65,
  latMax: -4.70,
  lngMin: -41.20,
  lngMax: -40.10,
};

export class GeolocationOutOfBoundsError extends DomainError {
  constructor(lat: number, lng: number) {
    super(
      `Geolocation (${lat}, ${lng}) is outside the municipality of Crateús/CE.`,
    );
  }
}

export class Geolocation {
  private constructor(
    readonly latitude: number,
    readonly longitude: number,
  ) {}

  static create(latitude: number, longitude: number): Geolocation {
    const withinMunicipality =
      latitude >= BBOX.latMin &&
      latitude <= BBOX.latMax &&
      longitude >= BBOX.lngMin &&
      longitude <= BBOX.lngMax;

    if (!withinMunicipality) {
      throw new GeolocationOutOfBoundsError(latitude, longitude);
    }

    return new Geolocation(latitude, longitude);
  }

  equals(other: Geolocation): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  toGeoJSON(): { type: 'Point'; coordinates: [number, number] } {
    return { type: 'Point', coordinates: [this.longitude, this.latitude] };
  }
}
