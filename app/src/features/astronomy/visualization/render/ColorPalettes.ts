export class ColorPalettes {
  // Yallop Crescent Visibility Color Palette
  public static readonly Yallop: Record<string, string> = {
    A: '#2E7D32', // Easily visible (Green)
    B: '#66BB6A', // Visible under perfect conditions (Light Green)
    C: '#FBC02D', // May need optical aid (Yellow)
    D: '#F57C00', // Will need optical aid (Orange)
    E: '#D32F2F', // Not visible with telescope (Red)
    F: '#455A64'  // Below Danjon limit (Gray)
  };

  // Odeh Crescent Visibility Color Palette
  public static readonly Odeh: Record<string, string> = {
    A: '#1B5E20', // Easily visible by naked eye
    B: '#4CAF50', // Visible by optical aid / naked eye
    C: '#FF9800', // Visible ONLY by optical aid
    D: '#F44336'  // Not visible
  };

  // Danjon Limit Palette
  public static readonly Danjon: Record<string, string> = {
    PASS: '#2E7D32',
    FAIL: '#D32F2F'
  };

  // Prayer Timeline Color Palette
  public static readonly Prayer: Record<string, string> = {
    Fajr: '#1A237E',     // Deep Navy
    Sunrise: '#FF6F00',  // Warm Orange
    Dhuhr: '#FBC02D',    // Bright Yellow
    Asr: '#E65100',      // Deep Amber
    Maghrib: '#880E4F',  // Sunset Magenta
    Isha: '#0D47A1',     // Night Blue
    Midnight: '#000000' // Dark Midnight
  };

  // Astronomical Twilight Sky Tints
  public static readonly SkyTints = {
    Day: '#87CEEB',
    CivilTwilight: '#FF7F50',
    NauticalTwilight: '#483D8B',
    AstronomicalTwilight: '#191970',
    Night: '#050515'
  };
}
