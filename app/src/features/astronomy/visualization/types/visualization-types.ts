export interface Vector2D {
  readonly x: number; // Normalized -1 to 1 or 0 to 1
  readonly y: number; // Normalized -1 to 1 or 0 to 1
  readonly visible?: boolean;
}

export interface Vector3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface RenderPoint extends Vector2D {
  readonly id?: string;
  readonly label?: string;
  readonly radius?: number;
  readonly color?: string;
}

export interface RenderPolyline {
  readonly id: string;
  readonly points: ReadonlyArray<Vector2D>;
  readonly strokeColor: string;
  readonly strokeWidth: number;
  readonly strokeDashArray?: ReadonlyArray<number>;
  readonly label?: string;
}

export interface RenderPolygon {
  readonly id: string;
  readonly points: ReadonlyArray<Vector2D>;
  readonly fillColor: string;
  readonly strokeColor: string;
  readonly opacity: number;
  readonly label?: string;
}

export interface RenderArc {
  readonly id: string;
  readonly center: Vector2D;
  readonly radius: number;
  readonly startAngleRad: number;
  readonly endAngleRad: number;
  readonly strokeColor: string;
}

export interface RenderLabel {
  readonly text: string;
  readonly position: Vector2D;
  readonly fontSize: number;
  readonly color: string;
  readonly anchor: 'start' | 'middle' | 'end';
}

export interface PrayerTimelineSegment {
  readonly name: string;
  readonly startTimeUTC: string;
  readonly endTimeUTC: string;
  readonly startPercent: number; // 0 to 100% of 24h day
  readonly endPercent: number;   // 0 to 100% of 24h day
  readonly color: string;
  readonly isCurrent: boolean;
}

export interface VisibilityContour {
  readonly categoryCode: string;
  readonly classification: string;
  readonly colorHex: string;
  readonly polygons: ReadonlyArray<RenderPolygon>;
}

export interface SkyObjectMarker {
  readonly id: string;
  readonly name: string;
  readonly arabicName?: string;
  readonly position: Vector2D;
  readonly altitudeDegrees: number;
  readonly azimuthDegrees: number;
  readonly apparentMagnitude?: number;
  readonly iconType: 'Sun' | 'Moon' | 'Planet' | 'Star' | 'Satellite';
  readonly color: string;
}
